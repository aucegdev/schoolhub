import api from "./api";

export interface PreviewUser {
  id: string;
  email: string;
  role: string;
}

const STORAGE_KEY = "schoolhub-dev-preview-user";

export function getPreviewUserId(): string | null {
  return localStorage.getItem(STORAGE_KEY);
}

export function setPreviewUserId(userId: string | null): void {
  if (userId) {
    localStorage.setItem(STORAGE_KEY, userId);
  } else {
    localStorage.removeItem(STORAGE_KEY);
  }
}

export async function listPreviewUsers(): Promise<PreviewUser[]> {
  const response = await api.get<{ data: PreviewUser[] }>("/dev-preview/users");
  return response.data.data;
}