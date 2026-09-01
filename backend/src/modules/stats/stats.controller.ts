import { Response, NextFunction } from "express";
import { AuthRequest } from "../../middleware/auth";
import * as statsService from "./stats.service";

export async function getStats(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const stats = await statsService.getStats();
    res.json({ success: true, data: stats });
  } catch (error) {
    next(error);
  }
}