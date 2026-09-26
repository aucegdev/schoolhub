import prisma from "../../config/database";
import { NotFoundError } from "../../utils/errors";

export async function listNotices(query: { target?: string; active?: boolean } = {}) {
  const where: Record<string, unknown> = {};
  if (query.target && query.target !== "ALL") where.target = query.target;
  if (query.active !== undefined) where.isActive = query.active;
  return prisma.notice.findMany({ where, orderBy: { publishedAt: "desc" } });
}

export async function getNotice(id: string) {
  const notice = await prisma.notice.findUnique({ where: { id } });
  if (!notice) throw new NotFoundError("Notice");
  return notice;
}

export async function createNotice(data: {
  title: string;
  content: string;
  priority?: string;
  target?: string;
  authorId?: string;
  publishedAt?: string;
}) {
  return prisma.notice.create({
    data: {
      title: data.title,
      content: data.content,
      priority: data.priority || "NORMAL",
      target: (data.target as any) || "ALL",
      authorId: data.authorId,
      publishedAt: data.publishedAt ? new Date(data.publishedAt) : undefined,
      isActive: true,
    },
  });
}

export async function updateNotice(id: string, data: Partial<{ title: string; content: string; priority: string; target: string; isActive: boolean }>) {
  await getNotice(id);
  const updateData: Record<string, unknown> = {};
  const fields: string[] = ["title", "content", "priority", "target", "isActive"];
  for (const f of fields) { if (data[f as keyof typeof data] !== undefined) updateData[f] = data[f as keyof typeof data]; }
  return prisma.notice.update({ where: { id }, data: updateData });
}

export async function deleteNotice(id: string) {
  await getNotice(id);
  return prisma.notice.delete({ where: { id } });
}