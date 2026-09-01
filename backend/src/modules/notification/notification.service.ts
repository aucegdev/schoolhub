import prisma from "../../config/database";
import { broadcastRealtimeNotification } from "../../config/socket";
import { NotFoundError } from "../../utils/errors";

export async function createNotification(data: {
  title: string;
  message: string;
  type?: "LEAVE_STATUS" | "ATTENDANCE_ALERT" | "EXAM_ANNOUNCEMENT" | "SYSTEM_NOTICE";
  userId?: string;
  role?: string;
  link?: string;
}) {
  const notification = await prisma.notification.create({
    data: {
      title: data.title,
      message: data.message,
      type: data.type || "SYSTEM_NOTICE",
      userId: data.userId,
      role: data.role || "ALL",
      link: data.link,
    },
  });

  // Broadcast via Socket.io in real-time
  broadcastRealtimeNotification(notification);

  return notification;
}

export async function listNotifications(limit: number = 20) {
  return prisma.notification.findMany({
    take: limit,
    orderBy: { createdAt: "desc" },
  });
}

export async function markAsRead(id: string) {
  const existing = await prisma.notification.findUnique({ where: { id } });
  if (!existing) throw new NotFoundError("Notification");

  return prisma.notification.update({
    where: { id },
    data: { isRead: true },
  });
}

export async function markAllAsRead() {
  return prisma.notification.updateMany({
    where: { isRead: false },
    data: { isRead: true },
  });
}
