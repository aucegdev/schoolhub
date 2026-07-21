import prisma from "../../config/database";
import { NotFoundError } from "../../utils/errors";

interface TeacherInput {
  firstName: string;
  lastName: string;
  dateOfBirth?: string;
  gender?: string;
  qualification?: string;
  specialization?: string;
  experience?: number;
  department?: string;
  designation?: string;
  dateOfJoining?: string;
  email?: string;
  phone?: string;
  address?: string;
  salary?: number;
  bankAccount?: string;
  ifscCode?: string;
  status?: string;
}

interface TeacherFilters {
  search?: string;
  status?: string;
  department?: string;
  page?: number;
  limit?: number;
}

async function generateEmployeeId(): Promise<string> {
  const year = new Date().getFullYear();
  const lastTeacher = await prisma.teacher.findFirst({
    where: { employeeId: { startsWith: `TCH-${year}-` } },
    orderBy: { employeeId: "desc" },
  });

  let sequence = 1;
  if (lastTeacher) {
    const parts = lastTeacher.employeeId.split("-");
    sequence = parseInt(parts[2]) + 1;
  }

  return `TCH-${year}-${String(sequence).padStart(4, "0")}`;
}

export async function listTeachers(filters: TeacherFilters = {}) {
  const page = filters.page || 1;
  const limit = filters.limit || 20;
  const skip = (page - 1) * limit;

  const where: Record<string, unknown> = {};

  if (filters.search) {
    where.OR = [
      { firstName: { contains: filters.search, mode: "insensitive" } },
      { lastName: { contains: filters.search, mode: "insensitive" } },
      { employeeId: { contains: filters.search, mode: "insensitive" } },
      { email: { contains: filters.search, mode: "insensitive" } },
    ];
  }

  if (filters.status) where.status = filters.status;
  if (filters.department) where.department = filters.department;

  const [teachers, total] = await Promise.all([
    prisma.teacher.findMany({
      where: where as any,
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
    }),
    prisma.teacher.count({ where: where as any }),
  ]);

  return { teachers, total, page, limit, totalPages: Math.ceil(total / limit) };
}

export async function getTeacher(id: string) {
  const teacher = await prisma.teacher.findUnique({ where: { id } });
  if (!teacher) throw new NotFoundError("Teacher");
  return teacher;
}

export async function createTeacher(data: TeacherInput) {
  const employeeId = await generateEmployeeId();

  return prisma.teacher.create({
    data: {
      employeeId,
      firstName: data.firstName,
      lastName: data.lastName,
      dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : undefined,
      gender: data.gender,
      qualification: data.qualification,
      specialization: data.specialization,
      experience: data.experience,
      department: data.department,
      designation: data.designation,
      dateOfJoining: data.dateOfJoining ? new Date(data.dateOfJoining) : undefined,
      email: data.email,
      phone: data.phone,
      address: data.address,
      salary: data.salary,
      bankAccount: data.bankAccount,
      ifscCode: data.ifscCode,
      status: (data.status as any) || "ACTIVE",
    },
  });
}

export async function updateTeacher(id: string, data: Partial<TeacherInput>) {
  const existing = await prisma.teacher.findUnique({ where: { id } });
  if (!existing) throw new NotFoundError("Teacher");

  const updateData: Record<string, unknown> = {};
  const fields: (keyof TeacherInput)[] = [
    "firstName", "lastName", "gender", "qualification", "specialization",
    "experience", "department", "designation", "email", "phone", "address",
    "salary", "bankAccount", "ifscCode", "status",
  ];

  for (const field of fields) {
    if (data[field] !== undefined) updateData[field] = data[field];
  }

  if (data.dateOfBirth) updateData.dateOfBirth = new Date(data.dateOfBirth);
  if (data.dateOfJoining) updateData.dateOfJoining = new Date(data.dateOfJoining);

  return prisma.teacher.update({ where: { id }, data: updateData as any });
}

export async function deleteTeacher(id: string) {
  const existing = await prisma.teacher.findUnique({ where: { id } });
  if (!existing) throw new NotFoundError("Teacher");

  return prisma.teacher.update({
    where: { id },
    data: { status: "RESIGNED" as any },
  });
}
