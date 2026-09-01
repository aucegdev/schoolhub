import api from "./api";

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: "LEAVE_STATUS" | "ATTENDANCE_ALERT" | "EXAM_ANNOUNCEMENT" | "SYSTEM_NOTICE";
  userId?: string;
  role?: string;
  isRead: boolean;
  link?: string;
  createdAt: string;
}

export async function listNotifications(): Promise<NotificationItem[]> {
  const { data } = await api.get("/notifications");
  return data.data;
}

export async function markAsRead(id: string): Promise<NotificationItem> {
  const { data } = await api.patch(`/notifications/${id}/read`);
  return data.data;
}

export async function markAllAsRead(): Promise<void> {
  await api.patch("/notifications/read-all");
}
