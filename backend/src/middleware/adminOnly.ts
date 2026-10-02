import { Response, NextFunction } from "express";
import { AuthRequest } from "./auth";
import { ForbiddenError } from "../utils/errors";
import { hasAdminAuthority } from "../config/authorization";

export function adminOnly(req: AuthRequest, _res: Response, next: NextFunction): void {
  if (!req.user || !hasAdminAuthority(req.user.role)) {
    next(new ForbiddenError("Admin access required"));
    return;
  }
  next();
}
