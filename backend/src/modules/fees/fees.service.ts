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

// --- Reports & Dues ---

export async function getStudentDues(studentId: string) {
  const student = await prisma.student.findUnique({
    where: { id: studentId },
    include: {
      class: { include: { sections: { include: { students: true } } } },
      feePayments: { include: { feeStructure: true } },
    },
  });
  if (!student) return null;

  // Get fee structures applicable to the student's classId (or classId of sections they belong to)
  const classIds = new Set<string>();
  if (student.classId) classIds.add(student.classId);
  student.class?.sections?.forEach(s => { if (s.classId) classIds.add(s.classId); });

  const structures = await prisma.feeStructure.findMany({ where: { classId: { in: Array.from(classIds) } }, orderBy: { dueDate: "asc" } });

  const dues = structures.map(structure => {
    const paidRecord = student.feePayments.find(p => p.feeStructureId === structure.id);
    const paid = paidRecord?.amountPaid || 0;
    return {
      feeStructure: structure,
      paid,
      outstanding: Math.max(0, structure.amount - paid),
      status: paid >= structure.amount ? "PAID" : paid > 0 ? "PARTIAL" : "PENDING",
    };
  });

  const totalDue = dues.reduce((s, d) => s + d.outstanding, 0);
  const totalPaid = dues.reduce((s, d) => s + d.paid, 0);
  const totalAmount = dues.reduce((s, d) => s + (d.feeStructure.amount || 0), 0);

  return { student: { id: student.id, firstName: student.firstName, lastName: student.lastName, admissionNo: student.admissionNo }, dues, totalDue, totalPaid, totalAmount };
}

export async function getClassDuesSummary(classId: string) {
  const structures = await prisma.feeStructure.findMany({ where: { classId } });
  const students = await prisma.student.findMany({ where: { classId, status: "ACTIVE" } });

  const summary = students.map(s => {
    const payments = s.feePayments || [];
    const totalPaid = payments.reduce((sum: number, p: any) => sum + p.amountPaid, 0);
    const totalDue = structures.reduce((sum, st) => sum + st.amount, 0);
    const outstanding = Math.max(0, totalDue - totalPaid);
    return { studentId: s.id, studentName: `${s.firstName} ${s.lastName}`, admissionNo: s.admissionNo, totalDue, totalPaid, outstanding, status: outstanding === 0 ? "PAID" : totalPaid > 0 ? "PARTIAL" : "PENDING" };
  });

  const totalCollected = summary.reduce((s, x) => s + x.totalPaid, 0);
  const totalOutstanding = summary.reduce((s, x) => s + x.outstanding, 0);
  const totalExpected = summary.reduce((s, x) => s + x.totalDue, 0);
  return { students: summary, totalCollected, totalOutstanding, totalExpected };
}
