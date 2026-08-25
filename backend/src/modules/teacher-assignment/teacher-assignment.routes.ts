import { Router } from "express";
import { authenticate } from "../../middleware/auth";
import { adminOnly } from "../../middleware/adminOnly";
import * as controller from "./teacher-assignment.controller";

const router = Router();

router.get("/teachers/:id/subjects", authenticate, controller.getTeacherSubjects);
router.post("/teachers/:id/subjects", authenticate, adminOnly, controller.assignSubject);
router.delete("/teachers/:id/subjects/:subjectId", authenticate, adminOnly, controller.removeSubjectAssignment);

router.get("/classes/:sectionId/class-teacher", authenticate, controller.getClassTeacher);
router.put("/classes/:sectionId/class-teacher", authenticate, adminOnly, controller.setClassTeacher);

router.get("/subjects/:subjectId/teachers", authenticate, controller.listTeachersForSubject);
router.get("/sections/:sectionId/teachers", authenticate, controller.listTeachersForClass);

export default router;
