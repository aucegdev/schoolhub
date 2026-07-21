import api from "./api";

export interface Holiday {
  id?: string;
  name: string;
  date: string;
  type: "PUBLIC" | "ACADEMIC" | "EMERGENCY";
  isRecurring: boolean;
}

export interface CalendarData {
  month: number;
  year: number;
  holidays: Holiday[];
}

export async function getCalendar(month?: number, year?: number): Promise<CalendarData> {
  const params: Record<string, string> = {};
  if (month) params.month = String(month);
  if (year) params.year = String(year);
  const { data } = await api.get("/calendar", { params });
  return data.data;
}

export async function addHoliday(holiday: Omit<Holiday, "id">): Promise<Holiday> {
  const { data } = await api.post("/calendar/holidays", holiday);
  return data.data;
}

export async function removeHoliday(id: string): Promise<void> {
  await api.delete(`/calendar/holidays/${id}`);
}
