import prisma from "../../config/database";
import { AppError, NotFoundError } from "../../utils/errors";

interface LeaveInput {
  teacherId: string;
  type: string;
  startDate: string;
  endDate: string;
  reason: string;
}

interface LeaveFilters {
  status?: string;
  teacherId?: string;
  page?: number;
  limit?: number;
}

export async function listLeaves(filters: LeaveFilters = {}) {
  const page = filters.page || 1;
  const limit = filters.limit || 20;
  const skip = (page - 1) * limit;

  const where: Record<string, unknown> = {};
  if (filters.status) where.status = filters.status;
  if (filters.teacherId) where.teacherId = filters.teacherId;

  const [leaves, total] = await Promise.all([
    prisma.leaveRequest.findMany({
      where: where as any,
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
      include: {
        teacher: {
          select: { id: true, firstName: true, lastName: true, employeeId: true, designation: true },
        },
      },
    }),
    prisma.leaveRequest.count({ where: where as any }),
  ]);

  return { leaves, total, page, limit, totalPages: Math.ceil(total / limit) };
}

export async function getLeaveById(id: string) {
  const leave = await prisma.leaveRequest.findUnique({
    where: { id },
    include: {
      teacher: {
        select: { id: true, firstName: true, lastName: true, employeeId: true, designation: true },
      },
    },
  });
  if (!leave) throw new NotFoundError("Leave request");
  return leave;
}

export async function createLeave(data: LeaveInput) {
  const teacher = await prisma.teacher.findUnique({ where: { id: data.teacherId } });
  if (!teacher) throw new NotFoundError("Teacher");

  if (new Date(data.startDate) > new Date(data.endDate)) {
    throw new AppError("Start date cannot be after end date", 400);
  }

  return prisma.leaveRequest.create({
    data: {
      teacherId: data.teacherId,
      type: data.type,
      startDate: new Date(data.startDate),
      endDate: new Date(data.endDate),
      reason: data.reason,
    },
    include: {
      teacher: {
        select: { id: true, firstName: true, lastName: true, employeeId: true },
      },
    },
  });
}

export async function updateLeaveStatus(id: string, status: string, approvedBy: string, remarks?: string) {
  const existing = await prisma.leaveRequest.findUnique({ where: { id } });
  if (!existing) throw new NotFoundError("Leave request");

  const validStatus = ["PENDING", "APPROVED", "REJECTED"];
  if (!validStatus.includes(status)) {
    throw new AppError("Invalid status. Must be APPROVED or REJECTED", 400);
  }

  const updated = await prisma.leaveRequest.update({
    where: { id },
    data: {
      status: status as any,
      approvedBy,
      remarks,
    },
    include: {
      teacher: {
        select: { id: true, firstName: true, lastName: true, employeeId: true },
      },
    },
  });

  // Real-time Notification
  try {
    const { createNotification } = await import("../notification/notification.service");
    await createNotification({
      title: `Leave Request ${status}`,
      message: `Leave request for ${updated.teacher?.firstName} ${updated.teacher?.lastName} was ${status.toLowerCase()}.`,
      type: "LEAVE_STATUS",
      role: "ALL",
      link: "/admin/leave",
    });
  } catch {}

  return updated;
}

export async function deleteLeave(id: string) {
  const existing = await prisma.leaveRequest.findUnique({ where: { id } });
  if (!existing) throw new NotFoundError("Leave request");
  return prisma.leaveRequest.delete({ where: { id } });
}