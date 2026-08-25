import api from "./api";

export interface SubjectData {
  id: string;
  name: string;
  code: string | null;
  type: string | null;
  _count: { teachers: number };
}

export async function listSubjects(): Promise<{ subjects: SubjectData[]; total: number }> {
  const res = await api.get("/subjects");
  return { subjects: res.data.subjects, total: res.data.total };
}
