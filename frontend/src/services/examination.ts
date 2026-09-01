import api from "./api";

export interface Exam {
  id: string;
  title: string;
  examType: string;
  classId: string;
  subjectId: string;
  examDate: string;
  totalMarks: number;
  passingMarks: number;
  subject?: { id: string; name: string };
  marks?: { id: string; studentId: string; marksObtained: number; remarks?: string; student: { firstName: string; lastName: string } }[];
}

export async function listExams(params: { classId?: string; subjectId?: string; examType?: string } = {}): Promise<Exam[]> {
  const { data } = await api.get("/exams", { params });
  return data.data;
}

export async function getExam(id: string): Promise<Exam> {
  const { data } = await api.get(`/exams/${id}`);
  return data.data;
}

export async function createExam(exam: Partial<Exam>): Promise<Exam> {
  const { data } = await api.post("/exams", exam);
  return data.data;
}

export async function enterMarks(examId: string, marks: { studentId: string; marksObtained: number; remarks?: string }[]) {
  const { data } = await api.post(`/exams/${examId}/marks`, { marks });
  return data.data;
}
