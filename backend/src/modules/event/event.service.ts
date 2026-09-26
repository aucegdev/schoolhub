import prisma from "../../config/database";
import { NotFoundError } from "../../utils/errors";

export async function listEvents(query: { type?: string; upcoming?: boolean } = {}) {
  const where: Record<string, unknown> = { isActive: true };
  if (query.type) where.eventType = query.type;
  if (query.upcoming) { const now = new Date(); where.startDate = { gte: now }; }
  return prisma.event.findMany({ where, orderBy: { startDate: "asc" } });
}

export async function getEvent(id: string) {
  const event = await prisma.event.findUnique({ where: { id } });
  if (!event) throw new NotFoundError("Event");
  return event;
}

export async function createEvent(data: { title: string; description?: string; eventType: string; startDate: string; endDate?: string; location?: string; targetRoles?: string }) {
  return prisma.event.create({
    data: {
      title: data.title,
      description: data.description,
      eventType: (data.eventType as any) || "GENERAL",
      startDate: new Date(data.startDate),
      endDate: data.endDate ? new Date(data.endDate) : undefined,
      location: data.location,
      targetRoles: data.targetRoles,
      isActive: true,
    },
  });
}

export async function updateEvent(id: string, data: Partial<{ title: string; description: string; eventType: string; startDate: string; endDate: string; location: string; targetRoles: string; isActive: boolean }>) {
  await getEvent(id);
  const updateData: Record<string, unknown> = {};
  const fields: string[] = ["title", "description", "eventType", "location", "targetRoles", "isActive"];
  for (const f of fields) { if (data[f as keyof typeof data] !== undefined) updateData[f] = data[f as keyof typeof data]; }
  if (data.startDate) updateData.startDate = new Date(data.startDate);
  if (data.endDate) updateData.endDate = new Date(data.endDate);
  return prisma.event.update({ where: { id }, data: updateData });
}

export async function deleteEvent(id: string) {
  await getEvent(id);
  return prisma.event.delete({ where: { id } });
}