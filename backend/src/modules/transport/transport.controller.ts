import { Request, Response, NextFunction } from "express";
import * as transportService from "./transport.service";

export async function listVehicles(req: Request, res: Response, next: NextFunction) {
  try { res.json({ success: true, data: await transportService.listVehicles({ status: req.query.status as string }) }); } catch (e) { next(e); }
}
export async function getVehicle(req: Request, res: Response, next: NextFunction) {
  try { res.json({ success: true, data: await transportService.getVehicle(req.params.id) }); } catch (e) { next(e); }
}
export async function createVehicle(req: Request, res: Response, next: NextFunction) {
  try { res.status(201).json({ success: true, data: await transportService.createVehicle(req.body) }); } catch (e) { next(e); }
}
export async function updateVehicle(req: Request, res: Response, next: NextFunction) {
  try { res.json({ success: true, data: await transportService.updateVehicle(req.params.id, req.body) }); } catch (e) { next(e); }
}
export async function deleteVehicle(req: Request, res: Response, next: NextFunction) {
  try { res.json({ success: true, message: "Vehicle deleted" }); await transportService.deleteVehicle(req.params.id); } catch (e) { next(e); }
}

export async function listDrivers(req: Request, res: Response, next: NextFunction) {
  try { res.json({ success: true, data: await transportService.listDrivers() }); } catch (e) { next(e); }
}
export async function getDriver(req: Request, res: Response, next: NextFunction) {
  try { res.json({ success: true, data: await transportService.getDriver(req.params.id) }); } catch (e) { next(e); }
}
export async function createDriver(req: Request, res: Response, next: NextFunction) {
  try { res.status(201).json({ success: true, data: await transportService.createDriver(req.body) }); } catch (e) { next(e); }
}
export async function updateDriver(req: Request, res: Response, next: NextFunction) {
  try { res.json({ success: true, data: await transportService.updateDriver(req.params.id, req.body) }); } catch (e) { next(e); }
}
export async function deleteDriver(req: Request, res: Response, next: NextFunction) {
  try { res.json({ success: true, message: "Driver deleted" }); await transportService.deleteDriver(req.params.id); } catch (e) { next(e); }
}

export async function listRoutes(req: Request, res: Response, next: NextFunction) {
  try { res.json({ success: true, data: await transportService.listRoutes() }); } catch (e) { next(e); }
}
export async function getRoute(req: Request, res: Response, next: NextFunction) {
  try { res.json({ success: true, data: await transportService.getRoute(req.params.id) }); } catch (e) { next(e); }
}
export async function createRoute(req: Request, res: Response, next: NextFunction) {
  try { res.status(201).json({ success: true, data: await transportService.createRoute(req.body) }); } catch (e) { next(e); }
}
export async function updateRoute(req: Request, res: Response, next: NextFunction) {
  try { res.json({ success: true, data: await transportService.updateRoute(req.params.id, req.body) }); } catch (e) { next(e); }
}
export async function deleteRoute(req: Request, res: Response, next: NextFunction) {
  try { res.json({ success: true, message: "Route deleted" }); await transportService.deleteRoute(req.params.id); } catch (e) { next(e); }
}

export async function listAllocations(req: Request, res: Response, next: NextFunction) {
  try { res.json({ success: true, data: await transportService.listAllocations({ studentId: req.query.studentId as string, routeId: req.query.routeId as string, status: req.query.status as string }) }); } catch (e) { next(e); }
}
export async function createAllocation(req: Request, res: Response, next: NextFunction) {
  try { res.status(201).json({ success: true, data: await transportService.createAllocation(req.body) }); } catch (e) { next(e); }
}
export async function deleteAllocation(req: Request, res: Response, next: NextFunction) {
  try { res.json({ success: true, message: "Allocation removed" }); await transportService.deleteAllocation(req.params.id); } catch (e) { next(e); }
}