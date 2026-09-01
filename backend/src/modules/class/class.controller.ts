import { Response, NextFunction } from "express";
import { AuthRequest } from "../../middleware/auth";
import * as classService from "./class.service";

export async function list(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const classes = await classService.listClasses();
    res.json({ success: true, data: classes });
  } catch (error) {
    next(error);
  }
}

export async function getById(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const cls = await classService.getClassById(req.params.id as string);
    res.json({ success: true, data: cls });
  } catch (error) {
    next(error);
  }
}

export async function create(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const cls = await classService.createClass(req.body);
    res.status(201).json({ success: true, data: cls });
  } catch (error) {
    next(error);
  }
}

export async function update(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const cls = await classService.updateClass(req.params.id as string, req.body);
    res.json({ success: true, data: cls });
  } catch (error) {
    next(error);
  }
}

export async function remove(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    await classService.deleteClass(req.params.id as string);
    res.json({ success: true, message: "Class deleted" });
  } catch (error) {
    next(error);
  }
}

export async function addSection(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const section = await classService.addSection(req.params.id as string, req.body);
    res.status(201).json({ success: true, data: section });
  } catch (error) {
    next(error);
  }
}

export async function updateSection(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const section = await classService.updateSection(req.params.sectionId as string, req.body);
    res.json({ success: true, data: section });
  } catch (error) {
    next(error);
  }
}

export async function removeSection(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    await classService.deleteSection(req.params.sectionId as string);
    res.json({ success: true, message: "Section deleted" });
  } catch (error) {
    next(error);
  }
}
