import { Response, NextFunction } from "express";
import { AuthRequest } from "../../middleware/auth";
import * as timetableService from "./timetable.service";

export async function list(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { classId, sectionId, day } = req.query;
    const entries = await timetableService.listEntries({
      classId: classId as string,
      sectionId: sectionId as string,
      day: day as string,
    });
    res.json({ success: true, data: entries });
  } catch (error) {
    next(error);
  }
}

export async function getById(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const entry = await timetableService.getEntryById(req.params.id as string);
    res.json({ success: true, data: entry });
  } catch (error) {
    next(error);
  }
}

export async function create(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const entry = await timetableService.createEntry(req.body);
    res.status(201).json({ success: true, data: entry });
  } catch (error) {
    next(error);
  }
}

export async function update(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const entry = await timetableService.updateEntry(req.params.id as string, req.body);
    res.json({ success: true, data: entry });
  } catch (error) {
    next(error);
  }
}

export async function remove(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    await timetableService.deleteEntry(req.params.id as string);
    res.json({ success: true, message: "Timetable entry deleted" });
  } catch (error) {
    next(error);
  }
}
