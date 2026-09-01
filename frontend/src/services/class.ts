import api from "./api";

export interface ClassData {
  id: string;
  name: string;
  sections: SectionData[];
  _count: { sections: number };
}

export interface SectionData {
  id: string;
  name: string;
  classId: string;
  classTeacher?: {
    teacher: { firstName: string; lastName: string };
  };
}

export async function listClasses(): Promise<ClassData[]> {
  const res = await api.get("/classes");
  return res.data.data;
}

export async function getClassById(id: string): Promise<ClassData> {
  const res = await api.get(`/classes/${id}`);
  return res.data.data;
}

export async function createClass(data: { name: string }): Promise<ClassData> {
  const res = await api.post("/classes", data);
  return res.data.data;
}

export async function updateClass(id: string, data: { name: string }): Promise<ClassData> {
  const res = await api.put(`/classes/${id}`, data);
  return res.data.data;
}

export async function deleteClass(id: string): Promise<void> {
  await api.delete(`/classes/${id}`);
}

export async function addSection(classId: string, data: { name: string }): Promise<SectionData> {
  const res = await api.post(`/classes/${classId}/sections`, data);
  return res.data.data;
}

export async function updateSection(
  classId: string,
  sectionId: string,
  data: { name: string }
): Promise<SectionData> {
  const res = await api.put(`/classes/${classId}/sections/${sectionId}`, data);
  return res.data.data;
}

export async function deleteSection(classId: string, sectionId: string): Promise<void> {
  await api.delete(`/classes/${classId}/sections/${sectionId}`);
}