import api from "./api";

export interface Teacher {
  id?: string;
  employeeId?: string;
  firstName: string;
  lastName: string;
  dateOfBirth?: string;
  gender?: string;
  qualification?: string;
  specialization?: string;
  experience?: number;
  department?: string;
  designation?: string;
  dateOfJoining?: string;
  email?: string;
  phone?: string;
  address?: string;
  salary?: number;
  bankAccount?: string;
  ifscCode?: string;
  photo?: string;
  status: string;
}

export interface TeacherListResult {
  teachers: Teacher[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export async function listTeachers(params: { search?: string; status?: string; department?: string; page?: number } = {}): Promise<TeacherListResult> {
  const query: Record<string, string> = {};
  if (params.search) query.search = params.search;
  if (params.status) query.status = params.status;
  if (params.department) query.department = params.department;
  if (params.page) query.page = String(params.page);
  const { data } = await api.get("/teachers", { params: query });
  return data;
}

export async function getTeacher(id: string): Promise<Teacher> {
  const { data } = await api.get(`/teachers/${id}`);
  return data.data;
}

export async function createTeacher(teacher: Teacher): Promise<Teacher> {
  const { data } = await api.post("/teachers", teacher);
  return data.data;
}

export async function updateTeacher(id: string, teacher: Partial<Teacher>): Promise<Teacher> {
  const { data } = await api.put(`/teachers/${id}`, teacher);
  return data.data;
}

export async function deleteTeacher(id: string): Promise<void> {
  await api.delete(`/teachers/${id}`);
}
