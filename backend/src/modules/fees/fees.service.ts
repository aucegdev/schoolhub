import prisma from "../../config/database";

export async function listFeeStructures(classId?: string) {
  const where: any = {};
  if (classId) where.classId = classId;

  return prisma.feeStructure.findMany({
    where,
    include: {
      payments: { include: { student: true } },
    },
    orderBy: { dueDate: "asc" },
  });
}

export async function createFeeStructure(data: {
  title: string;
  classId: string;
  amount: number;
  dueDate: string;
  description?: string;
}) {
  return prisma.feeStructure.create({
    data: {
      title: data.title,
      classId: data.classId,
      amount: Number(data.amount),
      dueDate: new Date(data.dueDate),
      description: data.description,
    },
  });
}

export async function recordPayment(data: {
  feeStructureId: string;
  studentId: string;
  amountPaid: number;
  paymentMode: string;
  transactionId?: string;
}) {
  return prisma.feePayment.create({
    data: {
      feeStructureId: data.feeStructureId,
      studentId: data.studentId,
      amountPaid: Number(data.amountPaid),
      paymentMode: data.paymentMode,
      transactionId: data.transactionId,
      status: "PAID",
    },
    include: {
      feeStructure: true,
      student: true,
    },
  });
}

export async function listPayments(studentId?: string, feeStructureId?: string) {
  const where: any = {};
  if (studentId) where.studentId = studentId;
  if (feeStructureId) where.feeStructureId = feeStructureId;

  return prisma.feePayment.findMany({
    where,
    include: {
      feeStructure: true,
      student: true,
    },
    orderBy: { paymentDate: "desc" },
  });
}
