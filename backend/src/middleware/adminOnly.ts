import { Response, NextFunction } from "express";
import { AuthRequest } from "./auth";
import { ForbiddenError } from "../utils/errors";

export function adminOnly(req: AuthRequest, _res: Response, next: NextFunction): void {
  if (!req.user || req.user.role !== "ADMIN") {
    next(new ForbiddenError("Admin access required"));
    return;
  }
  next();
}
