import prisma from "../../config/database";
import { NotFoundError } from "../../utils/errors";

interface TermInput {
  name: string;
  academicYearId: string;
  startDate: string;
  endDate: string;
  isActive?: boolean;
}

export async function listTerms(academicYearId?: string) {
  const where = academicYearId ? { academicYearId } : {};
  return prisma.term.findMany({
    where,
    orderBy: { startDate: "asc" },
    include: { academicYear: { select: { name: true } } },
  });
}

export async function getTerm(id: string) {
  const term = await prisma.term.findUnique({ where: { id } });
  if (!term) throw new NotFoundError("Term");
  return term;
}

export async function createTerm(data: TermInput) {
  const year = await prisma.academicYear.findUnique({ where: { id: data.academicYearId } });
  if (!year) throw new NotFoundError("Academic year");

  return prisma.term.create({
    data: {
      name: data.name,
      academicYearId: data.academicYearId,
      startDate: new Date(data.startDate),
      endDate: new Date(data.endDate),
      isActive: data.isActive ?? true,
    },
    include: { academicYear: { select: { name: true } } },
  });
}

export async function updateTerm(id: string, data: Partial<TermInput>) {
  const existing = await prisma.term.findUnique({ where: { id } });
  if (!existing) throw new NotFoundError("Term");

  return prisma.term.update({
    where: { id },
    data: {
      ...(data.name && { name: data.name }),
      ...(data.startDate && { startDate: new Date(data.startDate) }),
      ...(data.endDate && { endDate: new Date(data.endDate) }),
      ...(data.isActive !== undefined && { isActive: data.isActive }),
    },
    include: { academicYear: { select: { name: true } } },
  });
}
