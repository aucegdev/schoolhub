import { Response, NextFunction } from "express";
import { AuthRequest } from "../../middleware/auth";
import * as schoolService from "./school.service";

export async function getSchoolInfo(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const school = await schoolService.getSchool();
    res.json({ success: true, data: school });
  } catch (error) {
    next(error);
  }
}

export async function updateSchoolInfo(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const school = await schoolService.upsertSchool(req.body);
    res.json({ success: true, data: school });
  } catch (error) {
    next(error);
  }
}

export async function uploadLogo(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    if (!req.file) {
      res.status(400).json({ success: false, message: "No file uploaded" });
      return;
    }
    const school = await schoolService.updateLogo(req.file.filename);
    res.json({ success: true, data: school });
  } catch (error) {
    next(error);
  }
}
