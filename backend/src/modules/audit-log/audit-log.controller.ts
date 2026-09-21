import { Request, Response, NextFunction } from "express";
import * as auditService from "./audit-log.service";

export async function listAuditLogs(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await auditService.listAuditLogs({
      actorId: req.query.actorId as string | undefined,
      resource: req.query.resource as string | undefined,
      action: req.query.action as string | undefined,
      fromDate: req.query.fromDate as string | undefined,
      toDate: req.query.toDate as string | undefined,
      page: req.query.page ? parseInt(req.query.page as string) : undefined,
      limit: req.query.limit ? parseInt(req.query.limit as string) : undefined,
    });
    res.json({ success: true, ...result });
  } catch (error) {
    next(error);
  }
}

export async function getAuditLog(req: Request, res: Response, next: NextFunction) {
  try { res.json({ success: true, data: await auditService.getAuditLog(req.params.id) }); } catch (e) { next(e); }
}

export async function createAuditLog(req: Request, res: Response, next: NextFunction) {
  try { res.status(201).json({ success: true, data: await auditService.createAuditLog(req.body) }); } catch (e) { next(e); }
}