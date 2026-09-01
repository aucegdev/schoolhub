import prisma from "../../config/database";
import { NotFoundError } from "../../utils/errors";

export interface StudentListQuery {
  search?: string;
  classId?: string;
  sectionId?: string;
  status?: string;
  page?: number;
  limit?: number;
}

export async function listStudents(query: StudentListQuery) {
  const page = Math.max(1, query.page || 1);
  const limit = Math.max(1, Math.min(100, query.limit || 20));
  const skip = (page - 1) * limit;

  const where: any = {};

  if (query.search) {
    where.OR = [
      { firstName: { contains: query.search, mode: "insensitive" } },
      { lastName: { contains: query.search, mode: "insensitive" } },
      { admissionNo: { contains: query.search, mode: "insensitive" } },
      { rollNumber: { contains: query.search, mode: "insensitive" } },
    ];
  }

  if (query.classId) where.classId = query.classId;
  if (query.sectionId) where.sectionId = query.sectionId;
  if (query.status) where.status = query.status as any;

  const [students, total] = await Promise.all([
    prisma.student.findMany({
      where,
      skip,
      take: limit,
      include: {
        class: true,
        section: true,
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.student.count({ where }),
  ]);

  return {
    students,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
}

export async function getStudentById(id: string) {
  const student = await prisma.student.findUnique({
    where: { id },
    include: {
      class: true,
      section: true,
      attendances: { take: 10, orderBy: { date: "desc" } },
      examMarks: { include: { exam: { include: { subject: true } } } },
      feePayments: { include: { feeStructure: true } },
    },
  });

  if (!student) {
    throw new NotFoundError("Student");
  }

  return student;
}

export async function createStudent(data: {
  admissionNo: string;
  rollNumber?: string;
  firstName: string;
  lastName: string;
  dateOfBirth?: string;
  gender?: string;
  email?: string;
  phone?: string;
  address?: string;
  guardianName?: string;
  guardianPhone?: string;
  guardianEmail?: string;
  classId?: string;
  sectionId?: string;
  status?: string;
}) {
  return prisma.student.create({
    data: {
      admissionNo: data.admissionNo,
      rollNumber: data.rollNumber,
      firstName: data.firstName,
      lastName: data.lastName,
      dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : undefined,
      gender: data.gender,
      email: data.email,
      phone: data.phone,
      address: data.address,
      guardianName: data.guardianName,
      guardianPhone: data.guardianPhone,
      guardianEmail: data.guardianEmail,
      classId: data.classId,
      sectionId: data.sectionId,
      status: (data.status as any) || "ACTIVE",
    },
    include: {
      class: true,
      section: true,
    },
  });
}

export async function updateStudent(
  id: string,
  data: Partial<{
    admissionNo: string;
    rollNumber: string;
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    gender: string;
    email: string;
    phone: string;
    address: string;
    guardianName: string;
    guardianPhone: string;
    guardianEmail: string;
    classId: string;
    sectionId: string;
    status: string;
  }>
) {
  const existing = await prisma.student.findUnique({ where: { id } });
  if (!existing) throw new NotFoundError("Student");

  const updateData: any = { ...data };
  if (data.dateOfBirth) {
    updateData.dateOfBirth = new Date(data.dateOfBirth);
  }

  return prisma.student.update({
    where: { id },
    data: updateData,
    include: {
      class: true,
      section: true,
    },
  });
}

export async function deleteStudent(id: string) {
  const existing = await prisma.student.findUnique({ where: { id } });
  if (!existing) throw new NotFoundError("Student");

  return prisma.student.delete({ where: { id } });
}
