import api from "./api";

export interface Term {
  id?: string;
  name: string;
  academicYearId: string;
  academicYear?: { name: string };
  startDate: string;
  endDate: string;
  isActive: boolean;
}

export async function listTerms(academicYearId?: string): Promise<Term[]> {
  const params = academicYearId ? { academicYearId } : {};
  const { data } = await api.get("/terms", { params });
  return data.data;
}

export async function getTerm(id: string): Promise<Term> {
  const { data } = await api.get(`/terms/${id}`);
  return data.data;
}

export async function createTerm(term: Omit<Term, "id">): Promise<Term> {
  const { data } = await api.post("/terms", term);
  return data.data;
}

export async function updateTerm(id: string, term: Partial<Term>): Promise<Term> {
  const { data } = await api.put(`/terms/${id}`, term);
  return data.data;
}
