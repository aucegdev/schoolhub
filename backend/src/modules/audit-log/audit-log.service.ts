import prisma from "../../config/database";
import { NotFoundError } from "../../utils/errors";

export async function listAuditLogs(query: {
  actorId?: string;
  resource?: string;
  action?: string;
  fromDate?: string;
  toDate?: string;
  page?: number;
  limit?: number;
}) {
  const page = query.page || 1;
  const limit = query.limit || 50;
  const where: Record<string, unknown> = {};

  if (query.actorId) where.actorId = query.actorId;
  if (query.resource) where.resource = query.resource;
  if (query.action) where.action = query.action;
  if (query.fromDate) where.createdAt = { gte: new Date(query.fromDate) };
  if (query.toDate) { (where.createdAt as any) = { ...(where.createdAt as any), lte: new Date(query.toDate) }; }

  const [logs, total] = await Promise.all([
    prisma.auditLog.findMany({ where, skip: (page - 1) * limit, take: limit, orderBy: { createdAt: "desc" } }),
    prisma.auditLog.count({ where }),
  ]);
  return { logs, total, page, limit, totalPages: Math.ceil(total / limit) };
}

export async function createAuditLog(data: {
  actorId?: string;
  actorRole?: string;
  action: string;
  resource: string;
  resourceId?: string;
  beforeState?: string;
  afterState?: string;
  ipAddress?: string;
  userAgent?: string;
}) {
  return prisma.auditLog.create({ data });
}

export async function getAuditLog(id: string) {
  const log = await prisma.auditLog.findUnique({ where: { id } });
  if (!log) throw new NotFoundError("Audit Log");
  return log;
}