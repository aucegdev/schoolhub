import { Response, NextFunction } from "express";
import { AuthRequest } from "../../middleware/auth";
import * as academicYearService from "./academic-year.service";

export async function list(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const years = await academicYearService.listAcademicYears();
    res.json({ success: true, data: years });
  } catch (error) {
    next(error);
  }
}

export async function getById(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const year = await academicYearService.getAcademicYear(req.params.id as string);
    res.json({ success: true, data: year });
  } catch (error) {
    next(error);
  }
}

export async function create(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const year = await academicYearService.createAcademicYear(req.body);
    res.status(201).json({ success: true, data: year });
  } catch (error) {
    next(error);
  }
}

export async function update(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const year = await academicYearService.updateAcademicYear(req.params.id as string, req.body);
    res.json({ success: true, data: year });
  } catch (error) {
    next(error);
  }
}
