import { Router } from "express";
import * as controller from "./attendance.controller";
import { authenticate } from "../../middleware/auth";

const router = Router();

router.use(authenticate);

router.post("/mark", controller.markAttendance);
router.get("/", controller.getAttendance);
router.get("/summary", controller.getSummary);

export default router;
