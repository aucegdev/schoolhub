import api from "./api";

export interface SubjectData {
  id: string;
  name: string;
  code: string | null;
  type: string | null;
  _count: { teachers: number };
}

export interface SubjectDetail extends SubjectData {
  teachers: {
    id: string;
    teacher: { id: string; firstName: string; lastName: string; employeeId: string };
    class: { id: string; name: string } | null;
  }[];
}

export async function listSubjects(params?: { search?: string; type?: string }): Promise<{ subjects: SubjectData[]; total: number }> {
  const res = await api.get("/subjects", { params });
  return { subjects: res.data.subjects, total: res.data.total };
}

export async function getSubjectById(id: string): Promise<SubjectDetail> {
  const res = await api.get(`/subjects/${id}`);
  return res.data.data;
}

export async function createSubject(data: { name: string; code?: string; type?: string }): Promise<SubjectData> {
  const res = await api.post("/subjects", data);
  return res.data.data;
}

export async function updateSubject(id: string, data: { name: string; code?: string; type?: string }): Promise<SubjectData> {
  const res = await api.put(`/subjects/${id}`, data);
  return res.data.data;
}

export async function deleteSubject(id: string): Promise<void> {
  await api.delete(`/subjects/${id}`);
}
