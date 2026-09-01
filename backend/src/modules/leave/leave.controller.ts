import { Response, NextFunction } from "express";
import { AuthRequest } from "../../middleware/auth";
import * as leaveService from "./leave.service";

export async function list(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { status, teacherId, page, limit } = req.query;
    const result = await leaveService.listLeaves({
      status: status as string,
      teacherId: teacherId as string,
      page: page ? parseInt(page as string) : undefined,
      limit: limit ? parseInt(limit as string) : undefined,
    });
    res.json({ success: true, ...result });
  } catch (error) {
    next(error);
  }
}

export async function getById(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const leave = await leaveService.getLeaveById(req.params.id as string);
    res.json({ success: true, data: leave });
  } catch (error) {
    next(error);
  }
}

export async function create(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const leave = await leaveService.createLeave(req.body);
    res.status(201).json({ success: true, data: leave });
  } catch (error) {
    next(error);
  }
}

export async function updateStatus(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { status, remarks } = req.body;
    const approvedBy = (req as any).user?.id || "ADMIN";
    const leave = await leaveService.updateLeaveStatus(req.params.id as string, status, approvedBy, remarks);
    res.json({ success: true, data: leave });
  } catch (error) {
    next(error);
  }
}

export async function remove(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    await leaveService.deleteLeave(req.params.id as string);
    res.json({ success: true, message: "Leave request deleted" });
  } catch (error) {
    next(error);
  }
}