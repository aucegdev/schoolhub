import { Request, Response, NextFunction } from "express";
import * as attendanceService from "./attendance.service";

export async function markAttendance(req: Request, res: Response, next: NextFunction) {
  try {
    const data = await attendanceService.markAttendance(req.body);
    res.status(201).json({ success: true, data });
  } catch (error) {
    next(error);
  }
}

export async function getAttendance(req: Request, res: Response, next: NextFunction) {
  try {
    const data = await attendanceService.getAttendance({
      classId: req.query.classId as string,
      sectionId: req.query.sectionId as string,
      date: req.query.date as string,
      studentId: req.query.studentId as string,
    });
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
}

export async function getSummary(req: Request, res: Response, next: NextFunction) {
  try {
    const data = await attendanceService.getAttendanceSummary(
      req.query.classId as string,
      req.query.sectionId as string,
      req.query.date as string
    );
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
}
