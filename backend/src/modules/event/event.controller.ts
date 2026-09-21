import { Request, Response, NextFunction } from "express";
import * as eventService from "./event.service";

export async function listEvents(req: Request, res: Response, next: NextFunction) {
  try { res.json({ success: true, data: await eventService.listEvents({ type: req.query.type as string | undefined, upcoming: req.query.upcoming === "true" }) }); } catch (e) { next(e); }
}
export async function getEvent(req: Request, res: Response, next: NextFunction) {
  try { res.json({ success: true, data: await eventService.getEvent(req.params.id) }); } catch (e) { next(e); }
}
export async function createEvent(req: Request, res: Response, next: NextFunction) {
  try { res.status(201).json({ success: true, data: await eventService.createEvent(req.body) }); } catch (e) { next(e); }
}
export async function updateEvent(req: Request, res: Response, next: NextFunction) {
  try { res.json({ success: true, data: await eventService.updateEvent(req.params.id, req.body) }); } catch (e) { next(e); }
}
export async function deleteEvent(req: Request, res: Response, next: NextFunction) {
  try { res.json({ success: true, message: "Event deleted" }); await eventService.deleteEvent(req.params.id); } catch (e) { next(e); }
}