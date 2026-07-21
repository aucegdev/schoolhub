import { Response, NextFunction } from "express";
import { AuthRequest } from "../../middleware/auth";
import * as calendarService from "./calendar.service";

export async function getCalendar(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const month = req.query.month ? parseInt(req.query.month as string) : undefined;
    const year = req.query.year ? parseInt(req.query.year as string) : undefined;
    const calendar = await calendarService.getCalendar(month, year);
    res.json({ success: true, data: calendar });
  } catch (error) {
    next(error);
  }
}

export async function listHolidays(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const holidays = await calendarService.listHolidays();
    res.json({ success: true, data: holidays });
  } catch (error) {
    next(error);
  }
}

export async function addHoliday(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const holiday = await calendarService.addHoliday(req.body);
    res.status(201).json({ success: true, data: holiday });
  } catch (error) {
    next(error);
  }
}

export async function removeHoliday(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    await calendarService.removeHoliday(req.params.id as string);
    res.json({ success: true, message: "Holiday removed" });
  } catch (error) {
    next(error);
  }
}
