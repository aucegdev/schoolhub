import prisma from "../../config/database";
import { NotFoundError } from "../../utils/errors";

export async function listExams(query: { classId?: string; subjectId?: string; examType?: string }) {
  const where: any = {};
  if (query.classId) where.classId = query.classId;
  if (query.subjectId) where.subjectId = query.subjectId;
  if (query.examType) where.examType = query.examType;

  return prisma.exam.findMany({
    where,
    include: {
      subject: true,
      marks: { include: { student: true } },
    },
    orderBy: { examDate: "desc" },
  });
}

export async function getExamById(id: string) {
  const exam = await prisma.exam.findUnique({
    where: { id },
    include: {
      subject: true,
      marks: { include: { student: true } },
    },
  });

  if (!exam) throw new NotFoundError("Exam");
  return exam;
}

export async function createExam(data: {
  title: string;
  examType: string;
  classId: string;
  subjectId: string;
  examDate: string;
  totalMarks: number;
  passingMarks: number;
}) {
  return prisma.exam.create({
    data: {
      title: data.title,
      examType: data.examType,
      classId: data.classId,
      subjectId: data.subjectId,
      examDate: new Date(data.examDate),
      totalMarks: Number(data.totalMarks),
      passingMarks: Number(data.passingMarks),
    },
    include: {
      subject: true,
    },
  });
}

export async function enterMarks(
  examId: string,
  marks: { studentId: string; marksObtained: number; remarks?: string }[]
) {
  const exam = await prisma.exam.findUnique({ where: { id: examId } });
  if (!exam) throw new NotFoundError("Exam");

  const results = await prisma.$transaction(
    marks.map((m) =>
      prisma.examMark.upsert({
        where: {
          examId_studentId: {
            examId,
            studentId: m.studentId,
          },
        },
        create: {
          examId,
          studentId: m.studentId,
          marksObtained: Number(m.marksObtained),
          remarks: m.remarks,
        },
        update: {
          marksObtained: Number(m.marksObtained),
          remarks: m.remarks,
        },
      })
    )
  );

  return results;
}
