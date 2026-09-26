import { Request, Response, NextFunction } from "express";
import * as auditService from "./audit-log.service";

const q = (v: unknown): string | undefined => (typeof v === "string" ? v : undefined);

export async function listAuditLogs(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await auditService.listAuditLogs({
      actorId: q(req.query.actorId),
      resource: q(req.query.resource),
      action: q(req.query.action),
      fromDate: q(req.query.fromDate),
      toDate: q(req.query.toDate),
      page: q(req.query.page) ? parseInt(q(req.query.page)!) : undefined,
      limit: q(req.query.limit) ? parseInt(q(req.query.limit)!) : undefined,
    });
    res.json({ success: true, ...result });
  } catch (error) {
    next(error);
  }
}

export async function getAuditLog(req: Request, res: Response, next: NextFunction) {
  try { res.json({ success: true, data: await auditService.getAuditLog(String(req.params.id)) }); } catch (e) { next(e); }
}

export async function createAuditLog(req: Request, res: Response, next: NextFunction) {
  try { res.status(201).json({ success: true, data: await auditService.createAuditLog(req.body) }); } catch (e) { next(e); }
}