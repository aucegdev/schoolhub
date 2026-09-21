import prisma from "../../config/database";
import { NotFoundError } from "../../utils/errors";

export async function listMessages(query: { senderId?: string; recipientRole?: string; unread?: boolean } = {}) {
  const where: Record<string, unknown> = {};
  if (query.senderId) where.senderId = query.senderId;
  if (query.recipientRole) where.recipientRole = query.recipientRole;
  if (query.unread) where.isRead = false;
  return prisma.message.findMany({ where, orderBy: { createdAt: "desc" } });
}

export async function getMessage(id: string) {
  const msg = await prisma.message.findUnique({ where: { id } });
  if (!msg) throw new NotFoundError("Message");
  return msg;
}

export async function createMessage(data: {
  senderId: string;
  senderRole: string;
  recipientId?: string;
  recipientRole?: string;
  subject: string;
  body: string;
}) {
  return prisma.message.create({
    data: {
      senderId: data.senderId,
      senderRole: data.senderRole,
      recipientId: data.recipientId,
      recipientRole: data.recipientRole,
      subject: data.subject,
      body: data.body,
    },
  });
}

export async function markAsRead(id: string) {
  await getMessage(id);
  return prisma.message.update({ where: { id }, data: { isRead: true } });
}

export async function deleteMessage(id: string) {
  await getMessage(id);
  return prisma.message.delete({ where: { id } });
}