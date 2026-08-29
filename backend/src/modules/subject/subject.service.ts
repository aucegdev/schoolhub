import prisma from "../../config/database";
import { NotFoundError } from "../../utils/errors";

interface SubjectInput {
  name: string;
  code?: string;
  type?: string;
}

interface SubjectFilters {
  search?: string;
  type?: string;
  page?: number;
  limit?: number;
}

export async function listSubjects(filters: SubjectFilters = {}) {
  const page = filters.page || 1;
  const limit = filters.limit || 50;
  const skip = (page - 1) * limit;

  const where: Record<string, unknown> = {};

  if (filters.search) {
    where.OR = [
      { name: { contains: filters.search, mode: "insensitive" } },
      { code: { contains: filters.search, mode: "insensitive" } },
    ];
  }

  if (filters.type) where.type = filters.type;

  const [subjects, total] = await Promise.all([
    prisma.subject.findMany({
      where: where as any,
      skip,
      take: limit,
      orderBy: { name: "asc" },
      include: {
        _count: {
          select: { teachers: true },
        },
      },
    }),
    prisma.subject.count({ where: where as any }),
  ]);

  return { subjects, total, page, limit, totalPages: Math.ceil(total / limit) };
}

export async function getSubjectById(id: string) {
  const subject = await prisma.subject.findUnique({
    where: { id },
    include: {
      teachers: {
        include: {
          teacher: {
            select: { id: true, firstName: true, lastName: true, employeeId: true },
          },
          class: {
            select: { id: true, name: true },
          },
        },
      },
    },
  });
  if (!subject) throw new NotFoundError("Subject");
  return subject;
}

export async function createSubject(data: SubjectInput) {
  return prisma.subject.create({
    data: {
      name: data.name,
      code: data.code,
      type: data.type || "CORE",
    },
  });
}

export async function updateSubject(id: string, data: Partial<SubjectInput>) {
  const existing = await prisma.subject.findUnique({ where: { id } });
  if (!existing) throw new NotFoundError("Subject");

  const updateData: Record<string, unknown> = {};
  if (data.name !== undefined) updateData.name = data.name;
  if (data.code !== undefined) updateData.code = data.code;
  if (data.type !== undefined) updateData.type = data.type;

  return prisma.subject.update({ where: { id }, data: updateData as any });
}

export async function deleteSubject(id: string) {
  const existing = await prisma.subject.findUnique({ where: { id } });
  if (!existing) throw new NotFoundError("Subject");
  return prisma.subject.delete({ where: { id } });
}
