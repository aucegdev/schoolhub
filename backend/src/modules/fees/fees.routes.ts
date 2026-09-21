import { Router } from "express";
import * as controller from "./fees.controller";
import { authenticate } from "../../middleware/auth";

const router = Router();

router.use(authenticate);

router.get("/structures", controller.listStructures);
router.post("/structures", controller.createStructure);
router.get("/payments", controller.listPayments);
router.post("/payments", controller.recordPayment);
router.get("/dues/student/:studentId", controller.getStudentDues);
router.get("/dues/class/:classId", controller.getClassDuesSummary);

export default router;
