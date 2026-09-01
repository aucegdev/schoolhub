import { Router } from "express";
import * as controller from "./student.controller";
import { authenticate } from "../../middleware/auth";

const router = Router();

router.use(authenticate);

router.get("/", controller.listStudents);
router.get("/:id", controller.getStudent);
router.post("/", controller.createStudent);
router.put("/:id", controller.updateStudent);
router.delete("/:id", controller.deleteStudent);

export default router;
