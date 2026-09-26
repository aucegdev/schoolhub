import { Request, Response, NextFunction } from "express";
import * as noticeService from "./notice.service";

const q = (v: unknown): string | undefined => (typeof v === "string" ? v : undefined);

export async function listNotices(req: Request, res: Response, next: NextFunction) {
  try { res.json({ success: true, data: await noticeService.listNotices({ target: q(req.query.target), active: req.query.active ? (req.query.active === "true") : undefined }) }); } catch (e) { next(e); }
}
export async function getNotice(req: Request, res: Response, next: NextFunction) {
  try { res.json({ success: true, data: await noticeService.getNotice(String(req.params.id)) }); } catch (e) { next(e); }
}
export async function createNotice(req: Request, res: Response, next: NextFunction) {
  try { res.status(201).json({ success: true, data: await noticeService.createNotice(req.body) }); } catch (e) { next(e); }
}
export async function updateNotice(req: Request, res: Response, next: NextFunction) {
  try { res.json({ success: true, data: await noticeService.updateNotice(String(req.params.id), req.body) }); } catch (e) { next(e); }
}
export async function deleteNotice(req: Request, res: Response, next: NextFunction) {
  try { res.json({ success: true, message: "Notice deleted" }); await noticeService.deleteNotice(String(req.params.id)); } catch (e) { next(e); }
}
