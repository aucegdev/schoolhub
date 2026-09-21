import prisma from "../../config/database";
import { NotFoundError } from "../../utils/errors";

// --- Vehicles ---

export async function listVehicles(filters: { status?: string } = {}) {
  const where: Record<string, unknown> = {};
  if (filters.status) where.status = filters.status;
  return prisma.vehicle.findMany({ where, include: { driver: true, route: true }, orderBy: { createdAt: "desc" } });
}

export async function getVehicle(id: string) {
  const vehicle = await prisma.vehicle.findUnique({ where: { id }, include: { driver: true, route: true } });
  if (!vehicle) throw new NotFoundError("Vehicle");
  return vehicle;
}

export async function createVehicle(data: {
  vehicleNumber: string;
  model?: string;
  capacity: number;
  status?: string;
  driverId?: string;
  routeId?: string;
}) {
  return prisma.vehicle.create({
    data: {
      vehicleNumber: data.vehicleNumber,
      model: data.model,
      capacity: Number(data.capacity),
      status: (data.status as any) || "ACTIVE",
      driverId: data.driverId,
      routeId: data.routeId,
    },
    include: { driver: true, route: true },
  });
}

export async function updateVehicle(id: string, data: Partial<{ vehicleNumber: string; model: string; capacity: number; status: string; driverId: string; routeId: string }>) {
  await getVehicle(id);
  const updateData: Record<string, unknown> = {};
  const fields: string[] = ["vehicleNumber", "model", "capacity", "status", "driverId", "routeId"];
  for (const f of fields) {
    if (data[f as keyof typeof data] !== undefined) {
      updateData[f] = data[f as keyof typeof data];
      if (f === "capacity") updateData[f] = Number(data[f as keyof typeof data]);
    }
  }
  return prisma.vehicle.update({ where: { id }, data: updateData, include: { driver: true, route: true } });
}

export async function deleteVehicle(id: string) {
  await getVehicle(id);
  return prisma.vehicle.delete({ where: { id } });
}

// --- Drivers ---

export async function listDrivers() {
  return prisma.driver.findMany({ include: { vehicles: true }, orderBy: { createdAt: "desc" } });
}

export async function getDriver(id: string) {
  const driver = await prisma.driver.findUnique({ where: { id }, include: { vehicles: true } });
  if (!driver) throw new NotFoundError("Driver");
  return driver;
}

export async function createDriver(data: { firstName: string; lastName: string; phone: string; licenseNumber: string; experience?: number; address?: string }) {
  return prisma.driver.create({
    data: {
      firstName: data.firstName,
      lastName: data.lastName,
      phone: data.phone,
      licenseNumber: data.licenseNumber,
      experience: data.experience ? Number(data.experience) : undefined,
      address: data.address,
    },
    include: { vehicles: true },
  });
}

export async function updateDriver(id: string, data: Partial<{ firstName: string; lastName: string; phone: string; licenseNumber: string; experience: number; address: string }>) {
  await getDriver(id);
  const updateData: Record<string, unknown> = {};
  const fields: string[] = ["firstName", "lastName", "phone", "licenseNumber", "experience", "address"];
  for (const f of fields) {
    if (data[f as keyof typeof data] !== undefined) {
      updateData[f] = data[f as keyof typeof data];
      if (f === "experience") updateData[f] = Number(data[f as keyof typeof data]);
    }
  }
  return prisma.driver.update({ where: { id }, data: updateData, include: { vehicles: true } });
}

export async function deleteDriver(id: string) {
  await getDriver(id);
  return prisma.driver.delete({ where: { id } });
}

// --- Routes ---

export async function listRoutes() {
  return prisma.transportRoute.findMany({ include: { vehicles: { include: { driver: true } } }, orderBy: { createdAt: "desc" } });
}

export async function getRoute(id: string) {
  const route = await prisma.transportRoute.findUnique({ where: { id }, include: { vehicles: { include: { driver: true } } } });
  if (!route) throw new NotFoundError("Transport Route");
  return route;
}

export async function createRoute(data: { routeName: string; startPoint: string; endPoint: string; stops?: string; pickupTime: string; dropTime: string; fareMonthly: number }) {
  return prisma.transportRoute.create({
    data: {
      routeName: data.routeName,
      startPoint: data.startPoint,
      endPoint: data.endPoint,
      stops: data.stops,
      pickupTime: data.pickupTime,
      dropTime: data.dropTime,
      fareMonthly: Number(data.fareMonthly),
    },
    include: { vehicles: { include: { driver: true } } },
  });
}

export async function updateRoute(id: string, data: Partial<{ routeName: string; startPoint: string; endPoint: string; stops: string; pickupTime: string; dropTime: string; fareMonthly: number }>) {
  await getRoute(id);
  const updateData: Record<string, unknown> = {};
  const fields: string[] = ["routeName", "startPoint", "endPoint", "stops", "pickupTime", "dropTime", "fareMonthly"];
  for (const f of fields) {
    if (data[f as keyof typeof data] !== undefined) {
      updateData[f] = data[f as keyof typeof data];
      if (f === "fareMonthly") updateData[f] = Number(data[f as keyof typeof data]);
    }
  }
  return prisma.transportRoute.update({ where: { id }, data: updateData, include: { vehicles: { include: { driver: true } } } });
}

export async function deleteRoute(id: string) {
  await getRoute(id);
  return prisma.transportRoute.delete({ where: { id } });
}

// --- Student Transport Allocation ---

export async function listAllocations(filters: { studentId?: string; routeId?: string; status?: string } = {}) {
  const where: Record<string, unknown> = {};
  if (filters.studentId) where.studentId = filters.studentId;
  if (filters.routeId) where.routeId = filters.routeId;
  if (filters.status) where.status = filters.status;
  return prisma.studentTransport.findMany({
    where,
    include: { student: true, route: true, vehicle: { include: { driver: true } } },
    orderBy: { createdAt: "desc" },
  });
}

export async function createAllocation(data: { studentId: string; routeId: string; vehicleId: string; startDate?: string; endDate?: string; status?: string }) {
  return prisma.studentTransport.create({
    data: {
      studentId: data.studentId,
      routeId: data.routeId,
      vehicleId: data.vehicleId,
      startDate: data.startDate ? new Date(data.startDate) : undefined,
      endDate: data.endDate ? new Date(data.endDate) : undefined,
      status: data.status || "ACTIVE",
    },
    include: { student: true, route: true, vehicle: { include: { driver: true } } },
  });
}

export async function deleteAllocation(id: string) {
  return prisma.studentTransport.delete({ where: { id } });
}