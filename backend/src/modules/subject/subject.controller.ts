import { Response, NextFunction } from "express";
import { AuthRequest } from "../../middleware/auth";
import * as subjectService from "./subject.service";

export async function list(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { search, type, page, limit } = req.query;
    const result = await subjectService.listSubjects({
      search: search as string,
      type: type as string,
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
    const subject = await subjectService.getSubjectById(req.params.id as string);
    res.json({ success: true, data: subject });
  } catch (error) {
    next(error);
  }
}

export async function create(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const subject = await subjectService.createSubject(req.body);
    res.status(201).json({ success: true, data: subject });
  } catch (error) {
    next(error);
  }
}

export async function update(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const subject = await subjectService.updateSubject(req.params.id as string, req.body);
    res.json({ success: true, data: subject });
  } catch (error) {
    next(error);
  }
}

export async function remove(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    await subjectService.deleteSubject(req.params.id as string);
    res.json({ success: true, message: "Subject deleted" });
  } catch (error) {
    next(error);
  }
}
