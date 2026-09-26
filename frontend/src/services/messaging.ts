import api from "./api";

export interface Message {
  id: string;
  senderId: string;
  senderRole: string;
  recipientId?: string;
  recipientRole?: string;
  subject: string;
  body: string;
  isRead: boolean;
  createdAt: string;
}

export async function listMessages(recipientRole?: string, unreadOnly = false) {
  const { data } = await api.get("/messages", { params: { recipientRole, unread: unreadOnly } });
  return data.data as Message[];
}
export async function sendMessage(m: { recipientId?: string; recipientRole?: string; subject: string; body: string }) {
  const { data } = await api.post("/messages", m);
  return data.data;
}
export async function markAsRead(id: string) { const { data } = await api.patch(`/messages/${id}/read`); return data.data; }
export async function deleteMessage(id: string) { await api.delete(`/messages/${id}`); }