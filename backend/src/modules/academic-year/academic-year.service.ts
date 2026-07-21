import prisma from "../../config/database";
import { NotFoundError } from "../../utils/errors";

interface AcademicYearInput {
  name: string;
  startDate: string;
  endDate: string;
  isActive?: boolean;
}

export async function listAcademicYears() {
  return prisma.academicYear.findMany({
    orderBy: { startDate: "desc" },
    include: { _count: { select: { terms: true } } },
  });
}

export async function getAcademicYear(id: string) {
  const year = await prisma.academicYear.findUnique({
    where: { id },
    include: { terms: { orderBy: { startDate: "asc" } } },
  });
  if (!year) throw new NotFoundError("Academic year");
  return year;
}

export async function createAcademicYear(data: AcademicYearInput) {
  if (data.isActive) {
    await prisma.academicYear.updateMany({ where: { isActive: true }, data: { isActive: false } });
  }

  return prisma.academicYear.create({
    data: {
      name: data.name,
      startDate: new Date(data.startDate),
      endDate: new Date(data.endDate),
      isActive: data.isActive ?? true,
    },
  });
}

export async function updateAcademicYear(id: string, data: Partial<AcademicYearInput>) {
  const existing = await prisma.academicYear.findUnique({ where: { id } });
  if (!existing) throw new NotFoundError("Academic year");

  if (data.isActive) {
    await prisma.academicYear.updateMany({ where: { isActive: true, id: { not: id } }, data: { isActive: false } });
  }

  return prisma.academicYear.update({
    where: { id },
    data: {
      ...(data.name && { name: data.name }),
      ...(data.startDate && { startDate: new Date(data.startDate) }),
      ...(data.endDate && { endDate: new Date(data.endDate) }),
      ...(data.isActive !== undefined && { isActive: data.isActive }),
    },
  });
}
