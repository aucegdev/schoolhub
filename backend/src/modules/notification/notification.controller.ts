import { Request, Response, NextFunction } from "express";
import * as notificationService from "./notification.service";

export async function listNotifications(req: Request, res: Response, next: NextFunction) {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 20;
    const data = await notificationService.listNotifications(limit);
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
}

export async function createNotification(req: Request, res: Response, next: NextFunction) {
  try {
    const data = await notificationService.createNotification(req.body);
    res.status(201).json({ success: true, data });
  } catch (error) {
    next(error);
  }
}

export async function markAsRead(req: Request, res: Response, next: NextFunction) {
  try {
    const data = await notificationService.markAsRead(req.params.id as string);
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
}

export async function markAllAsRead(_req: Request, res: Response, next: NextFunction) {
  try {
    await notificationService.markAllAsRead();
    res.json({ success: true, message: "All notifications marked as read" });
  } catch (error) {
    next(error);
  }
}
