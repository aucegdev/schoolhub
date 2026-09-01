import prisma from "../../config/database";
import { NotFoundError } from "../../utils/errors";

interface ClassInput {
  name: string;
}

interface SectionInput {
  name: string;
  capacity?: number;
  roomNumber?: string;
}

export async function listClasses() {
  return prisma.class.findMany({
    include: {
      sections: {
        include: {
          classTeacher: {
            include: { teacher: true },
          },
        },
      },
      _count: {
        select: { sections: true },
      },
    },
    orderBy: { name: "asc" },
  });
}

export async function getClassById(id: string) {
  const cls = await prisma.class.findUnique({
    where: { id },
    include: {
      sections: {
        include: {
          classTeacher: {
            include: { teacher: true },
          },
        },
        orderBy: { name: "asc" },
      },
    },
  });
  if (!cls) throw new NotFoundError("Class");
  return cls;
}

export async function createClass(data: ClassInput) {
  return prisma.class.create({ data: { name: data.name } });
}

export async function updateClass(id: string, data: Partial<ClassInput>) {
  const existing = await prisma.class.findUnique({ where: { id } });
  if (!existing) throw new NotFoundError("Class");
  return prisma.class.update({ where: { id }, data: { name: data.name } });
}

export async function deleteClass(id: string) {
  const existing = await prisma.class.findUnique({ where: { id } });
  if (!existing) throw new NotFoundError("Class");
  return prisma.class.delete({ where: { id } });
}

export async function addSection(classId: string, data: SectionInput) {
  const cls = await prisma.class.findUnique({ where: { id: classId } });
  if (!cls) throw new NotFoundError("Class");
  return prisma.section.create({
    data: {
      name: data.name,
      classId,
    },
    include: { classTeacher: { include: { teacher: true } } },
  });
}

export async function updateSection(id: string, data: Partial<SectionInput>) {
  const existing = await prisma.section.findUnique({ where: { id } });
  if (!existing) throw new NotFoundError("Section");
  return prisma.section.update({ where: { id }, data: { name: data.name } });
}

export async function deleteSection(id: string) {
  const existing = await prisma.section.findUnique({ where: { id } });
  if (!existing) throw new NotFoundError("Section");
  return prisma.section.delete({ where: { id } });
}
