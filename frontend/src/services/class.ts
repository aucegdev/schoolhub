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
}

export async function listClasses(): Promise<ClassData[]> {
  const res = await api.get("/classes");
  return res.data.data;
}
