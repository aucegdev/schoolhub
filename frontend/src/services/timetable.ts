import api from "./api";

export interface TimetableEntry {
  id: string;
  classId: string;
  sectionId: string;
  subjectId: string;
  teacherId: string;
  day: string;
  startTime: string;
  endTime: string;
  room: string | null;
  class: { id: string; name: string };
  section: { id: string; name: string };
  subject: { id: string; name: string };
  teacher: { id: string; firstName: string; lastName: string };
}

export async function listTimetable(params?: { classId?: string; sectionId?: string; day?: string }): Promise<TimetableEntry[]> {
  const res = await api.get("/timetable", { params });
  return res.data.data;
}

export async function createTimetableEntry(data: {
  classId: string; sectionId: string; subjectId: string; teacherId: string;
  day: string; startTime: string; endTime: string; room?: string;
}): Promise<TimetableEntry> {
  const res = await api.post("/timetable", data);
  return res.data.data;
}

export async function updateTimetableEntry(id: string, data: Partial<{
  classId: string; sectionId: string; subjectId: string; teacherId: string;
  day: string; startTime: string; endTime: string; room: string;
}>): Promise<TimetableEntry> {
  const res = await api.put(`/timetable/${id}`, data);
  return res.data.data;
}

export async function deleteTimetableEntry(id: string): Promise<void> {
  await api.delete(`/timetable/${id}`);
}
