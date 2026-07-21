import { Request, Response, NextFunction } from "express";
import { UnauthorizedError } from "../utils/errors";

export interface AuthRequest extends Request {
  user?: {
    id: string;
    role: string;
    email: string;
  };
}

export function authenticate(req: AuthRequest, _res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new UnauthorizedError("Missing or invalid authorization header");
  }

  try {
    const token = authHeader.split(" ")[1];
    // TODO: Verify JWT token
    // For now, set a mock admin user for development
    req.user = {
      id: "admin-dev-id",
      role: "ADMIN",
      email: "admin@school.com",
    };
    next();
  } catch {
    next(new UnauthorizedError("Invalid token"));
  }
}
