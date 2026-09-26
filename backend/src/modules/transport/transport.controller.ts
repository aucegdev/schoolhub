import { Request, Response, NextFunction } from "express";
import * as transportService from "./transport.service";

const q = (v: unknown): string | undefined => (typeof v === "string" ? v : undefined);

export async function listVehicles(req: Request, res: Response, next: NextFunction) {
  try { res.json({ success: true, data: await transportService.listVehicles({ status: q(req.query.status) }) }); } catch (e) { next(e); }
}
export async function getVehicle(req: Request, res: Response, next: NextFunction) {
  try { res.json({ success: true, data: await transportService.getVehicle(String(req.params.id)) }); } catch (e) { next(e); }
}
export async function createVehicle(req: Request, res: Response, next: NextFunction) {
  try { res.status(201).json({ success: true, data: await transportService.createVehicle(req.body) }); } catch (e) { next(e); }
}
export async function updateVehicle(req: Request, res: Response, next: NextFunction) {
  try { res.json({ success: true, data: await transportService.updateVehicle(String(req.params.id), req.body) }); } catch (e) { next(e); }
}
export async function deleteVehicle(req: Request, res: Response, next: NextFunction) {
  try { res.json({ success: true, message: "Vehicle deleted" }); await transportService.deleteVehicle(String(req.params.id)); } catch (e) { next(e); }
}

export async function listDrivers(req: Request, res: Response, next: NextFunction) {
  try { res.json({ success: true, data: await transportService.listDrivers() }); } catch (e) { next(e); }
}
export async function getDriver(req: Request, res: Response, next: NextFunction) {
  try { res.json({ success: true, data: await transportService.getDriver(String(req.params.id)) }); } catch (e) { next(e); }
}
export async function createDriver(req: Request, res: Response, next: NextFunction) {
  try { res.status(201).json({ success: true, data: await transportService.createDriver(req.body) }); } catch (e) { next(e); }
}
export async function updateDriver(req: Request, res: Response, next: NextFunction) {
  try { res.json({ success: true, data: await transportService.updateDriver(String(req.params.id), req.body) }); } catch (e) { next(e); }
}
export async function deleteDriver(req: Request, res: Response, next: NextFunction) {
  try { res.json({ success: true, message: "Driver deleted" }); await transportService.deleteDriver(String(req.params.id)); } catch (e) { next(e); }
}

export async function listRoutes(req: Request, res: Response, next: NextFunction) {
  try { res.json({ success: true, data: await transportService.listRoutes() }); } catch (e) { next(e); }
}
export async function getRoute(req: Request, res: Response, next: NextFunction) {
  try { res.json({ success: true, data: await transportService.getRoute(String(req.params.id)) }); } catch (e) { next(e); }
}
export async function createRoute(req: Request, res: Response, next: NextFunction) {
  try { res.status(201).json({ success: true, data: await transportService.createRoute(req.body) }); } catch (e) { next(e); }
}
export async function updateRoute(req: Request, res: Response, next: NextFunction) {
  try { res.json({ success: true, data: await transportService.updateRoute(String(req.params.id), req.body) }); } catch (e) { next(e); }
}
export async function deleteRoute(req: Request, res: Response, next: NextFunction) {
  try { res.json({ success: true, message: "Route deleted" }); await transportService.deleteRoute(String(req.params.id)); } catch (e) { next(e); }
}

export async function listAllocations(req: Request, res: Response, next: NextFunction) {
  try { res.json({ success: true, data: await transportService.listAllocations({ studentId: q(req.query.studentId), routeId: q(req.query.routeId), status: q(req.query.status) }) }); } catch (e) { next(e); }
}
export async function createAllocation(req: Request, res: Response, next: NextFunction) {
  try { res.status(201).json({ success: true, data: await transportService.createAllocation(req.body) }); } catch (e) { next(e); }
}
export async function deleteAllocation(req: Request, res: Response, next: NextFunction) {
  try { res.json({ success: true, message: "Allocation removed" }); await transportService.deleteAllocation(String(req.params.id)); } catch (e) { next(e); }
}
