import api from "./api";

export interface Event {
  id: string;
  title: string;
  description?: string;
  eventType: string;
  startDate: string;
  endDate?: string;
  location?: string;
  targetRoles?: string;
  isActive: boolean;
}

export async function listEvents(type?: string, upcoming = false) {
  const { data } = await api.get("/events", { params: { type, upcoming } });
  return data.data as Event[];
}
export async function createEvent(e: Partial<Event>) { const { data } = await api.post("/events", e); return data.data; }
export async function updateEvent(id: string, e: Partial<Event>) { const { data } = await api.put(`/events/${id}`, e); return data.data; }
export async function deleteEvent(id: string) { await api.delete(`/events/${id}`); }