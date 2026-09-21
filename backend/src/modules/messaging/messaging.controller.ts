import { Request, Response, NextFunction } from "express";
import * as msgService from "./messaging.service";
import { AuthRequest } from "../../middleware/auth";

const q = (v: unknown): string | undefined => (typeof v === "string" ? v : undefined);

export async function listMessages(req: AuthRequest, res: Response, next: NextFunction) {
  try { res.json({ success: true, data: await msgService.listMessages({ senderId: q(req.query.senderId), recipientRole: q(req.query.recipientRole), unread: req.query.unread === "true" }) }); } catch (e) { next(e); }
}
export async function getMessage(req: Request, res: Response, next: NextFunction) {
  try { res.json({ success: true, data: await msgService.getMessage(String(req.params.id)) }); } catch (e) { next(e); }
}
export async function createMessage(req: AuthRequest, res: Response, next: NextFunction) {
  try { res.status(201).json({ success: true, data: await msgService.createMessage({ ...req.body, senderId: req.user!.id, senderRole: req.user!.role }) }); } catch (e) { next(e); }
}
export async function markAsRead(req: Request, res: Response, next: NextFunction) {
  try { res.json({ success: true, data: await msgService.markAsRead(String(req.params.id)) }); } catch (e) { next(e); }
}
export async function deleteMessage(req: Request, res: Response, next: NextFunction) {
  try { res.json({ success: true, message: "Message deleted" }); await msgService.deleteMessage(String(req.params.id)); } catch (e) { next(e); }
}
