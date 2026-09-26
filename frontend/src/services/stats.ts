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
    students: number;
    activeStudents: number;
    exams: number;
    pendingLeaves: number;
    unreadNotifications: number;
    vehicles: number;
    routes: number;
    notices: number;
    events: number;
  };
  recentTeachers: {
    id: string;
    firstName: string;
    lastName: string;
    employeeId: string;
    designation: string | null;
    status: string;
  }[];
  recentStudents: {
    id: string;
    firstName: string;
    lastName: string;
    admissionNo: string;
    class?: { name: string };
  }[];
  classesWithSections: {
    id: string;
    name: string;
    _count: { sections: number };
  }[];
  upcomingEvents: {
    id: string;
    title: string;
    startDate: string;
    location?: string;
  }[];
  recentNotices: {
    id: string;
    title: string;
    createdAt: string;
    target: string;
  }[];
}

export async function getStats(): Promise<DashboardStats> {
  const res = await api.get("/stats");
  return res.data.data;
}