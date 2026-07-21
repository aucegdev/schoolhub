import api from "./api";

export interface School {
  id?: string;
  schoolName: string;
  tagline?: string;
  logo?: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  phone?: string;
  email?: string;
  website?: string;
  affiliationNumber?: string;
  board?: string;
  establishedYear?: number;
}

export async function getSchoolInfo(): Promise<School> {
  const { data } = await api.get("/school");
  return data.data;
}

export async function updateSchoolInfo(school: School): Promise<School> {
  const { data } = await api.put("/school", school);
  return data.data;
}

export async function uploadLogo(file: File): Promise<School> {
  const formData = new FormData();
  formData.append("logo", file);
  const { data } = await api.post("/school/logo", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data.data;
}
