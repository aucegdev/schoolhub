import { Response, NextFunction } from "express";
import { AuthRequest } from "../../middleware/auth";
import * as service from "./teacher-assignment.service";

export async function getTeacherSubjects(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const data = await service.getTeacherSubjects(req.params.id as string);
    res.json({ success: true, data });
  } catch (error) { next(error); }
}

export async function assignSubject(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { subjectId, classId } = req.body;
    const data = await service.assignSubject(req.params.id as string, subjectId, classId);
    res.status(201).json({ success: true, data });
  } catch (error) { next(error); }
}

export async function removeSubjectAssignment(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    await service.removeSubjectAssignment(req.params.id as string, req.params.subjectId as string);
    res.json({ success: true, message: "Assignment removed" });
  } catch (error) { next(error); }
}

export async function getClassTeacher(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const data = await service.getClassTeacher(req.params.sectionId as string);
    res.json({ success: true, data });
  } catch (error) { next(error); }
}

export async function setClassTeacher(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { teacherId } = req.body;
    const data = await service.setClassTeacher(teacherId, req.params.sectionId as string);
    res.json({ success: true, data });
  } catch (error) { next(error); }
}

export async function listTeachersForSubject(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const data = await service.listTeachersForSubject(req.params.subjectId as string);
    res.json({ success: true, data });
  } catch (error) { next(error); }
}

export async function listTeachersForClass(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const data = await service.listTeachersForClass(req.params.sectionId as string);
    res.json({ success: true, data });
  } catch (error) { next(error); }
}
