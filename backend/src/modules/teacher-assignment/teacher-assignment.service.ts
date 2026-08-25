import prisma from "../../config/database";
import { NotFoundError } from "../../utils/errors";

export async function getTeacherSubjects(teacherId: string) {
  return prisma.teacherSubject.findMany({
    where: { teacherId },
    include: { subject: true, class: true },
  });
}

export async function assignSubject(teacherId: string, subjectId: string, classId?: string) {
  const teacher = await prisma.teacher.findUnique({ where: { id: teacherId } });
  if (!teacher) throw new NotFoundError("Teacher");

  const subject = await prisma.subject.findUnique({ where: { id: subjectId } });
  if (!subject) throw new NotFoundError("Subject");

  return prisma.teacherSubject.create({
    data: { teacherId, subjectId, classId: classId || null },
    include: { subject: true, class: true },
  });
}

export async function removeSubjectAssignment(teacherId: string, subjectId: string) {
  const assignment = await prisma.teacherSubject.findFirst({
    where: { teacherId, subjectId },
  });
  if (!assignment) throw new NotFoundError("Assignment");

  return prisma.teacherSubject.delete({ where: { id: assignment.id } });
}

export async function getClassTeacher(sectionId: string) {
  const classTeacher = await prisma.classTeacher.findUnique({
    where: { sectionId },
    include: { teacher: true, section: { include: { class: true } } },
  });
  return classTeacher;
}

export async function setClassTeacher(teacherId: string, sectionId: string) {
  const teacher = await prisma.teacher.findUnique({ where: { id: teacherId } });
  if (!teacher) throw new NotFoundError("Teacher");

  const section = await prisma.section.findUnique({ where: { id: sectionId } });
  if (!section) throw new NotFoundError("Section");

  const existing = await prisma.classTeacher.findUnique({ where: { sectionId } });
  if (existing) {
    if (existing.teacherId === teacherId) return existing;
    return prisma.classTeacher.update({
      where: { sectionId },
      data: { teacherId },
      include: { teacher: true },
    });
  }

  return prisma.classTeacher.create({
    data: { teacherId, sectionId },
    include: { teacher: true },
  });
}

export async function listTeachersForSubject(subjectId: string) {
  return prisma.teacherSubject.findMany({
    where: { subjectId },
    include: { teacher: true },
  });
}

export async function listTeachersForClass(sectionId: string) {
  return prisma.teacherSubject.findMany({
    where: { classId: sectionId },
    include: { teacher: true, subject: true },
  });
}
