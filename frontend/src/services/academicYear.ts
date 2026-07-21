import api from "./api";

export interface AcademicYear {
  id?: string;
  name: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
  _count?: { terms: number };
}

export async function listAcademicYears(): Promise<AcademicYear[]> {
  const { data } = await api.get("/academic-years");
  return data.data;
}

export async function getAcademicYear(id: string): Promise<AcademicYear> {
  const { data } = await api.get(`/academic-years/${id}`);
  return data.data;
}

export async function createAcademicYear(year: Omit<AcademicYear, "id">): Promise<AcademicYear> {
  const { data } = await api.post("/academic-years", year);
  return data.data;
}

export async function updateAcademicYear(id: string, year: Partial<AcademicYear>): Promise<AcademicYear> {
  const { data } = await api.put(`/academic-years/${id}`, year);
  return data.data;
}
