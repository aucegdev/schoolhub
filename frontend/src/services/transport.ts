import api from "./api";

export interface Vehicle {
  id: string;
  vehicleNumber: string;
  model?: string;
  capacity: number;
  status: string;
  driverId?: string;
  driver?: { id: string; firstName: string; lastName: string; phone: string };
  routeId?: string;
  route?: { id: string; routeName: string };
}

export interface Driver {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  licenseNumber: string;
  experience?: number;
  address?: string;
}

export interface TransportRoute {
  id: string;
  routeName: string;
  startPoint: string;
  endPoint: string;
  stops?: string;
  pickupTime: string;
  dropTime: string;
  fareMonthly: number;
}

export interface StudentTransport {
  id: string;
  studentId: string;
  student: { id: string; firstName: string; lastName: string; admissionNo: string };
  route: { id: string; routeName: string };
  vehicle: { id: string; vehicleNumber: string };
  startDate: string;
  endDate?: string;
  status: string;
}

export async function listVehicles(status?: string) {
  const { data } = await api.get("/transport/vehicles", status ? { params: { status } } : undefined);
  return data.data as Vehicle[];
}
export async function createVehicle(v: Partial<Vehicle>) { const { data } = await api.post("/transport/vehicles", v); return data.data; }
export async function updateVehicle(id: string, v: Partial<Vehicle>) { const { data } = await api.put(`/transport/vehicles/${id}`, v); return data.data; }
export async function deleteVehicle(id: string) { await api.delete(`/transport/vehicles/${id}`); }

export async function listDrivers() { const { data } = await api.get("/transport/drivers"); return data.data as Driver[]; }
export async function createDriver(d: Partial<Driver>) { const { data } = await api.post("/transport/drivers", d); return data.data; }
export async function updateDriver(id: string, d: Partial<Driver>) { const { data } = await api.put(`/transport/drivers/${id}`, d); return data.data; }
export async function deleteDriver(id: string) { await api.delete(`/transport/drivers/${id}`); }

export async function listRoutes() { const { data } = await api.get("/transport/routes"); return data.data as TransportRoute[]; }
export async function createRoute(r: Partial<TransportRoute>) { const { data } = await api.post("/transport/routes", r); return data.data; }
export async function updateRoute(id: string, r: Partial<TransportRoute>) { const { data } = await api.put(`/transport/routes/${id}`, r); return data.data; }
export async function deleteRoute(id: string) { await api.delete(`/transport/routes/${id}`); }

export async function listAllocations(filters?: { studentId?: string; routeId?: string }) {
  const { data } = await api.get("/transport/allocations", { params: filters });
  return data.data as StudentTransport[];
}
export async function createAllocation(a: { studentId: string; routeId: string; vehicleId: string; startDate?: string; endDate?: string; status?: string }) {
  const { data } = await api.post("/transport/allocations", a); return data.data;
}
export async function deleteAllocation(id: string) { await api.delete(`/transport/allocations/${id}`); }