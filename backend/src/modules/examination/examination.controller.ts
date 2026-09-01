import { Request, Response, NextFunction } from "express";
import * as examService from "./examination.service";

export async function listExams(req: Request, res: Response, next: NextFunction) {
  try {
    const data = await examService.listExams({
      classId: req.query.classId as string,
      subjectId: req.query.subjectId as string,
      examType: req.query.examType as string,
    });
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
}

export async function getExam(req: Request, res: Response, next: NextFunction) {
  try {
    const data = await examService.getExamById(req.params.id as string);
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
}

export async function createExam(req: Request, res: Response, next: NextFunction) {
  try {
    const data = await examService.createExam(req.body);
    res.status(201).json({ success: true, data });
  } catch (error) {
    next(error);
  }
}

export async function enterMarks(req: Request, res: Response, next: NextFunction) {
  try {
    const data = await examService.enterMarks(req.params.id as string, req.body.marks);
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
}
