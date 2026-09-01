import { Router } from "express";
import * as controller from "./fees.controller";
import { authenticate } from "../../middleware/auth";

const router = Router();

router.use(authenticate);

router.get("/structures", controller.listStructures);
router.post("/structures", controller.createStructure);
router.get("/payments", controller.listPayments);
router.post("/payments", controller.recordPayment);

export default router;
