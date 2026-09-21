import { Router } from "express";
import * as controller from "./audit-log.controller";
import { authenticate } from "../../middleware/auth";
import { adminOnly } from "../../middleware/adminOnly";

const router = Router();

router.use(authenticate);

router.get("/", controller.listAuditLogs);
router.get("/:id", controller.getAuditLog);
router.post("/", authenticate, adminOnly, controller.createAuditLog);

export default router;