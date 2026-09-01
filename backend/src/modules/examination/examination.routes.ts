import { Router } from "express";
import * as controller from "./examination.controller";
import { authenticate } from "../../middleware/auth";

const router = Router();

router.use(authenticate);

router.get("/", controller.listExams);
router.get("/:id", controller.getExam);
router.post("/", controller.createExam);
router.post("/:id/marks", controller.enterMarks);

export default router;
