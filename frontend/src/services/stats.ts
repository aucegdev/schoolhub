import api from "./api";

export interface DashboardStats {
  totals: {
    teachers: number;
    activeTeachers: number;
    classes: number;
    sections: number;
    subjects: number;
    timetableEntries: number;
    holidays: number;
  };
  recentTeachers: {
    id: string;
    firstName: string;
    lastName: string;
    employeeId: string;
    designation: string | null;
    status: string;
  }[];
  classesWithSections: {
    id: string;
    name: string;
    _count: { sections: number };
  }[];
}

export async function getStats(): Promise<DashboardStats> {
  const res = await api.get("/stats");
  return res.data.data;
}