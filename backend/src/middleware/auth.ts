import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { getFirebaseAdminApp } from "../config/firebase";
import { UnauthorizedError } from "../utils/errors";

const admin: any = require("firebase-admin");

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
      const role = (decoded.role ?? "ADMIN").toString().toUpperCase();
      const email = decoded.email ?? "unknown@schoolhub.local";

      req.user = { id: userId, role, email };
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
    const decodedFirebase = await admin.auth().verifyIdToken(token);
    const firebaseClaims = decodedFirebase as JwtPayload & { role?: string };
    const role = (firebaseClaims.role ?? "USER").toString().toUpperCase();

    req.user = {
      id: decodedFirebase.uid,
      role,
      email: decodedFirebase.email ?? "unknown@schoolhub.local",
    };

    next();
  } catch {
    next(new UnauthorizedError("Invalid token"));
  }
}
