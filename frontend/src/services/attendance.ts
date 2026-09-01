import api from "./api";

export interface AttendanceRecord {
  id?: string;
  studentId: string;
  classId: string;
  sectionId: string;
  date: string;
  status: "PRESENT" | "ABSENT" | "LATE" | "EXCUSED";
  remarks?: string;
  student?: { id: string; firstName: string; lastName: string; rollNumber?: string };
}

export async function markAttendance(payload: {
  classId: string;
  sectionId: string;
  date: string;
  records: { studentId: string; status: string; remarks?: string }[];
}) {
  const { data } = await api.post("/attendance/mark", payload);
  return data.data;
}

export async function getAttendance(params: { classId?: string; sectionId?: string; date?: string; studentId?: string }): Promise<AttendanceRecord[]> {
  const { data } = await api.get("/attendance", { params });
  return data.data;
}

export async function getAttendanceSummary(params: { classId: string; sectionId: string; date?: string }) {
  const { data } = await api.get("/attendance/summary", { params });
  return data.data;
}
