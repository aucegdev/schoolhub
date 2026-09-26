import api from "./api";

export interface Notice {
  id: string;
  title: string;
  content: string;
  priority: string;
  target: string;
  authorId?: string;
  publishedAt?: string;
  isActive: boolean;
  createdAt: string;
}

export async function listNotices(target?: string, activeOnly = true) {
  const { data } = await api.get("/notices", { params: { target, active: activeOnly } });
  return data.data as Notice[];
}
export async function createNotice(n: Partial<Notice>) { const { data } = await api.post("/notices", n); return data.data; }
export async function updateNotice(id: string, n: Partial<Notice>) { const { data } = await api.put(`/notices/${id}`, n); return data.data; }
export async function deleteNotice(id: string) { await api.delete(`/notices/${id}`); }