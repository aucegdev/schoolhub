import { Request, Response, NextFunction } from "express";
import * as msgService from "./messaging.service";

export async function listMessages(req: Request, res: Response, next: NextFunction) {
  try { res.json({ success: true, data: await msgService.listMessages({ senderId: req.query.senderId as string | undefined, recipientRole: req.query.recipientRole as string | undefined, unread: req.query.unread === "true" }) }); } catch (e) { next(e); }
}
export async function getMessage(req: Request, res: Response, next: NextFunction) {
  try { res.json({ success: true, data: await msgService.getMessage(req.params.id) }); } catch (e) { next(e); }
}
export async function createMessage(req: Request, res: Response, next: NextFunction) {
  try { res.status(201).json({ success: true, data: await msgService.createMessage({ ...req.body, senderId: req.user!.id, senderRole: req.user!.role }) }); } catch (e) { next(e); }
}
export async function markAsRead(req: Request, res: Response, next: NextFunction) {
  try { res.json({ success: true, data: await msgService.markAsRead(req.params.id) }); } catch (e) { next(e); }
}
export async function deleteMessage(req: Request, res: Response, next: NextFunction) {
  try { res.json({ success: true, message: "Message deleted" }); await msgService.deleteMessage(req.params.id); } catch (e) { next(e); }
}