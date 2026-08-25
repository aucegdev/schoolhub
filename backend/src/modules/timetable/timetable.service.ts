import prisma from "../../config/database";
import { AppError, NotFoundError } from "../../utils/errors";

interface TimetableInput {
  classId: string;
  sectionId: string;
  subjectId: string;
  teacherId: string;
  day: string;
  startTime: string;
  endTime: string;
  room?: string;
}

interface TimetableFilters {
  classId?: string;
  sectionId?: string;
  day?: string;
}

export async function listEntries(filters: TimetableFilters = {}) {
  const where: Record<string, unknown> = {};

  if (filters.classId) where.classId = filters.classId;
  if (filters.sectionId) where.sectionId = filters.sectionId;
  if (filters.day) where.day = filters.day;

  return prisma.timetableEntry.findMany({
    where: where as any,
    include: {
      class: true,
      section: true,
      subject: true,
      teacher: {
        select: { id: true, firstName: true, lastName: true, employeeId: true },
      },
    },
    orderBy: [{ day: "asc" }, { startTime: "asc" }],
  });
}

export async function getEntryById(id: string) {
  const entry = await prisma.timetableEntry.findUnique({
    where: { id },
    include: { class: true, section: true, subject: true, teacher: true },
  });
  if (!entry) throw new NotFoundError("Timetable entry");
  return entry;
}

async function checkConflict(data: TimetableInput, excludeId?: string) {
  const where: Record<string, unknown> = {
    day: data.day,
    startTime: data.startTime,
  };

  // Check teacher conflict
  const teacherConflict = await prisma.timetableEntry.findFirst({
    where: { ...where, teacherId: data.teacherId, ...(excludeId ? { id: { not: excludeId } } : {}) } as any,
  });
  if (teacherConflict) throw new AppError("Teacher is already assigned to another class at this time", 409);

  // Check class/section conflict
  const classConflict = await prisma.timetableEntry.findFirst({
    where: { ...where, classId: data.classId, sectionId: data.sectionId, ...(excludeId ? { id: { not: excludeId } } : {}) } as any,
  });
  if (classConflict) throw new AppError("This class section already has a class at this time", 409);

  // Check room conflict (if room specified)
  if (data.room) {
    const roomConflict = await prisma.timetableEntry.findFirst({
      where: { ...where, room: data.room, ...(excludeId ? { id: { not: excludeId } } : {}) } as any,
    });
    if (roomConflict) throw new AppError("Room is already booked at this time", 409);
  }
}

export async function createEntry(data: TimetableInput) {
  await checkConflict(data);
  return prisma.timetableEntry.create({
    data: {
      classId: data.classId,
      sectionId: data.sectionId,
      subjectId: data.subjectId,
      teacherId: data.teacherId,
      day: data.day,
      startTime: data.startTime,
      endTime: data.endTime,
      room: data.room,
    },
    include: { class: true, section: true, subject: true, teacher: true },
  });
}

export async function updateEntry(id: string, data: Partial<TimetableInput>) {
  const existing = await prisma.timetableEntry.findUnique({ where: { id } });
  if (!existing) throw new NotFoundError("Timetable entry");

  const merged = { ...existing, ...data };
  await checkConflict(merged as TimetableInput, id);

  const updateData: Record<string, unknown> = {};
  const fields: (keyof TimetableInput)[] = ["classId", "sectionId", "subjectId", "teacherId", "day", "startTime", "endTime", "room"];
  for (const field of fields) {
    if (data[field] !== undefined) updateData[field] = data[field];
  }

  return prisma.timetableEntry.update({
    where: { id },
    data: updateData as any,
    include: { class: true, section: true, subject: true, teacher: true },
  });
}

export async function deleteEntry(id: string) {
  const existing = await prisma.timetableEntry.findUnique({ where: { id } });
  if (!existing) throw new NotFoundError("Timetable entry");
  return prisma.timetableEntry.delete({ where: { id } });
}
