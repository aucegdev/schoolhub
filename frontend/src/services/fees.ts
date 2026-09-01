import api from "./api";

export interface FeeStructure {
  id: string;
  title: string;
  classId: string;
  amount: number;
  dueDate: string;
  description?: string;
  payments?: FeePayment[];
}

export interface FeePayment {
  id: string;
  feeStructureId: string;
  studentId: string;
  amountPaid: number;
  paymentDate: string;
  paymentMode: string;
  transactionId?: string;
  status: string;
  feeStructure?: FeeStructure;
  student?: { id: string; firstName: string; lastName: string };
}

export async function listFeeStructures(classId?: string): Promise<FeeStructure[]> {
  const { data } = await api.get("/fees/structures", { params: { classId } });
  return data.data;
}

export async function createFeeStructure(structure: Partial<FeeStructure>): Promise<FeeStructure> {
  const { data } = await api.post("/fees/structures", structure);
  return data.data;
}

export async function listFeePayments(studentId?: string, feeStructureId?: string): Promise<FeePayment[]> {
  const { data } = await api.get("/fees/payments", { params: { studentId, feeStructureId } });
  return data.data;
}

export async function recordFeePayment(payment: Partial<FeePayment>): Promise<FeePayment> {
  const { data } = await api.post("/fees/payments", payment);
  return data.data;
}
