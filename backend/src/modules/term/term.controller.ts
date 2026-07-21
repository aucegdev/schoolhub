import { Response, NextFunction } from "express";
import { AuthRequest } from "../../middleware/auth";
import * as termService from "./term.service";

export async function list(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const academicYearId = req.query.academicYearId as string | undefined;
    const terms = await termService.listTerms(academicYearId);
    res.json({ success: true, data: terms });
  } catch (error) {
    next(error);
  }
}

export async function getById(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const term = await termService.getTerm(req.params.id as string);
    res.json({ success: true, data: term });
  } catch (error) {
    next(error);
  }
}

export async function create(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const term = await termService.createTerm(req.body);
    res.status(201).json({ success: true, data: term });
  } catch (error) {
    next(error);
  }
}

export async function update(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const term = await termService.updateTerm(req.params.id as string, req.body);
    res.json({ success: true, data: term });
  } catch (error) {
    next(error);
  }
}
