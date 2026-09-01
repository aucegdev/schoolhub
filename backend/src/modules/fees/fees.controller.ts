import { Request, Response, NextFunction } from "express";
import * as feeService from "./fees.service";

export async function listStructures(req: Request, res: Response, next: NextFunction) {
  try {
    const data = await feeService.listFeeStructures(req.query.classId as string);
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
}

export async function createStructure(req: Request, res: Response, next: NextFunction) {
  try {
    const data = await feeService.createFeeStructure(req.body);
    res.status(201).json({ success: true, data });
  } catch (error) {
    next(error);
  }
}

export async function recordPayment(req: Request, res: Response, next: NextFunction) {
  try {
    const data = await feeService.recordPayment(req.body);
    res.status(201).json({ success: true, data });
  } catch (error) {
    next(error);
  }
}

export async function listPayments(req: Request, res: Response, next: NextFunction) {
  try {
    const data = await feeService.listPayments(
      req.query.studentId as string,
      req.query.feeStructureId as string
    );
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
}
