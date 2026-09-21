import api from "./api";

export interface Setting {
  id: string;
  key: string;
  value: string;
  category: string;
}

export async function listSettings(category?: string) {
  const { data } = await api.get("/settings", category ? { params: { category } } : undefined);
  return data.data as Setting[];
}

export async function getSetting(key: string) {
  const { data } = await api.get(`/settings/${encodeURIComponent(key)}`);
  return data.data as Setting;
}

export async function setSetting(s: { key: string; value: string; category?: string }) {
  const { data } = await api.post("/settings", s);
  return data.data;
}

export async function updateSetting(key: string, updates: { value?: string; category?: string }) {
  const { data } = await api.put(`/settings/${encodeURIComponent(key)}`, updates);
  return data.data;
}

export async function deleteSetting(key: string) {
  await api.delete(`/settings/${encodeURIComponent(key)}`);
}

export async function seedSettings() {
  const { data } = await api.post("/settings/seed");
  return data.data;
}