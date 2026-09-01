import api from "./api";

export interface Student {
  id?: string;
  admissionNo: string;
  rollNumber?: string;
  firstName: string;
  lastName: string;
  dateOfBirth?: string;
  gender?: string;
  email?: string;
  phone?: string;
  address?: string;
  guardianName?: string;
  guardianPhone?: string;
  guardianEmail?: string;
  status: string;
  classId?: string;
  sectionId?: string;
  class?: { id: string; name: string };
  section?: { id: string; name: string };
}

export interface StudentListResult {
  students: Student[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export async function listStudents(params: { search?: string; classId?: string; sectionId?: string; status?: string; page?: number } = {}): Promise<StudentListResult> {
  const { data } = await api.get("/students", { params });
  return data;
}

export async function getStudent(id: string): Promise<Student> {
  const { data } = await api.get(`/students/${id}`);
  return data.data;
}

export async function createStudent(student: Student): Promise<Student> {
  const { data } = await api.post("/students", student);
  return data.data;
}

export async function updateStudent(id: string, student: Partial<Student>): Promise<Student> {
  const { data } = await api.put(`/students/${id}`, student);
  return data.data;
}

export async function deleteStudent(id: string): Promise<void> {
  await api.delete(`/students/${id}`);
}
