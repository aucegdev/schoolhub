import api from "./api";

export interface LeaveRequest {
  id: string;
  teacherId: string;
  type: string;
  startDate: string;
  endDate: string;
  reason: string;
  status: string;
  approvedBy: string | null;
  remarks: string | null;
  createdAt: string;
  teacher: {
    id: string;
    firstName: string;
    lastName: string;
    employeeId: string;
    designation: string | null;
  };
}

export async function listLeaves(params?: { status?: string; teacherId?: string }): Promise<{ leaves: LeaveRequest[]; total: number }> {
  const res = await api.get("/leaves", { params });
  return { leaves: res.data.leaves, total: res.data.total };
}

export async function createLeave(data: { teacherId: string; type: string; startDate: string; endDate: string; reason: string }): Promise<LeaveRequest> {
  const res = await api.post("/leaves", data);
  return res.data.data;
}

export async function updateLeaveStatus(id: string, status: string, remarks?: string): Promise<LeaveRequest> {
  const res = await api.put(`/leaves/${id}/status`, { status, remarks });
  return res.data.data;
}