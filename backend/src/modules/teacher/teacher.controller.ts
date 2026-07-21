import { Response, NextFunction } from "express";
import { AuthRequest } from "../../middleware/auth";
import * as teacherService from "./teacher.service";

export async function list(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { search, status, department, page, limit } = req.query;
    const result = await teacherService.listTeachers({
      search: search as string,
      status: status as string,
      department: department as string,
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
    const teacher = await teacherService.getTeacher(req.params.id as string);
    res.json({ success: true, data: teacher });
  } catch (error) {
    next(error);
  }
}

export async function create(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const teacher = await teacherService.createTeacher(req.body);
    res.status(201).json({ success: true, data: teacher });
  } catch (error) {
    next(error);
  }
}

export async function update(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const teacher = await teacherService.updateTeacher(req.params.id as string, req.body);
    res.json({ success: true, data: teacher });
  } catch (error) {
    next(error);
  }
}

export async function remove(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    await teacherService.deleteTeacher(req.params.id as string);
    res.json({ success: true, message: "Teacher deactivated" });
  } catch (error) {
    next(error);
  }
}
