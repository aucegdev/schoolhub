import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { getFirebaseAdminApp } from "../config/firebase";
import { UnauthorizedError } from "../utils/errors";
import { resolveRole } from "../config/authorization";
import prisma from "../config/database";

const admin: any = require("firebase-admin");
const { getAuth } = require("firebase-admin/auth");

export interface AuthRequest extends Request {
  user?: {
    id: string;
    role: string;
    email: string;
  };
}

interface AuthTokenPayload extends JwtPayload {
  id?: string;
  userId?: string;
  email?: string;
  role?: string;
}

async function applyDevelopmentPreview(req: AuthRequest): Promise<void> {
  if (process.env.NODE_ENV === "production" || req.user?.role !== "SUPER_ADMIN") {
    return;
  }

  const previewUserId = req.headers["x-dev-preview-user"];
  if (typeof previewUserId !== "string" || !previewUserId) {
    return;
  }

  const previewUser = await prisma.user.findUnique({
    where: { id: previewUserId },
    select: { id: true, email: true, role: true, isActive: true },
  });

  if (previewUser?.isActive) {
    req.user = {
      id: previewUser.id,
      email: previewUser.email,
      role: previewUser.role.toUpperCase(),
    };
  }
}

export async function authenticate(req: AuthRequest, _res: Response, next: NextFunction): Promise<void> {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    next(new UnauthorizedError("Missing or invalid authorization header"));
    return;
  }

  const token = authHeader.replace("Bearer ", "").trim();
  const jwtSecret = process.env.JWT_SECRET ?? (process.env.NODE_ENV === "development" ? "schoolhub-dev-secret" : undefined);

  try {
    if (jwtSecret) {
      const decoded = jwt.verify(token, jwtSecret) as AuthTokenPayload;
      const userId = decoded.id ?? decoded.userId ?? decoded.sub ?? "unknown-user";
      const email = decoded.email ?? "unknown@schoolhub.local";
      const role = resolveRole(email, decoded.role ?? "ADMIN");

      req.user = { id: userId, role, email };
      await applyDevelopmentPreview(req);
      next();
      return;
    }
  } catch {
    // Fall back to Firebase token validation below.
  }

  const firebaseApp = getFirebaseAdminApp();
  if (!firebaseApp) {
    next(new UnauthorizedError("JWT secret or Firebase configuration is not configured"));
    return;
  }

  try {
    const decodedFirebase = await getAuth(firebaseApp).verifyIdToken(token);
    const firebaseClaims = decodedFirebase as JwtPayload & { role?: string };
    const verifiedEmail = decodedFirebase.email_verified ? decodedFirebase.email : undefined;
    const role = resolveRole(verifiedEmail, firebaseClaims.role);

    req.user = {
      id: decodedFirebase.uid,
      role,
      email: decodedFirebase.email ?? "unknown@schoolhub.local",
    };

    await applyDevelopmentPreview(req);
    next();
  } catch {
    next(new UnauthorizedError("Invalid token"));
  }
}
