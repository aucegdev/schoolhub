import { Request, Response, NextFunction } from "express";
import * as studentService from "./student.service";

export async function listStudents(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await studentService.listStudents({
      search: req.query.search as string,
      classId: req.query.classId as string,
      sectionId: req.query.sectionId as string,
      status: req.query.status as string,
      page: req.query.page ? parseInt(req.query.page as string, 10) : undefined,
      limit: req.query.limit ? parseInt(req.query.limit as string, 10) : undefined,
    });
    res.json({ success: true, ...result });
  } catch (error) {
    next(error);
  }
}

export async function getStudent(req: Request, res: Response, next: NextFunction) {
  try {
    const data = await studentService.getStudentById(req.params.id as string);
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
}

export async function createStudent(req: Request, res: Response, next: NextFunction) {
  try {
    const data = await studentService.createStudent(req.body);
    res.status(201).json({ success: true, data });
  } catch (error) {
    next(error);
  }
}

export async function updateStudent(req: Request, res: Response, next: NextFunction) {
  try {
    const data = await studentService.updateStudent(req.params.id as string, req.body);
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
}

export async function deleteStudent(req: Request, res: Response, next: NextFunction) {
  try {
    await studentService.deleteStudent(req.params.id as string);
    res.json({ success: true, message: "Student deleted successfully" });
  } catch (error) {
    next(error);
  }
}
