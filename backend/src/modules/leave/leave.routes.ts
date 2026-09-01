import { Router } from "express";
import { authenticate } from "../../middleware/auth";
import { adminOnly } from "../../middleware/adminOnly";
import * as controller from "./leave.controller";

const router = Router();

router.get("/", authenticate, controller.list);
router.get("/:id", authenticate, controller.getById);
router.post("/", authenticate, controller.create);
router.put("/:id/status", authenticate, adminOnly, controller.updateStatus);
router.delete("/:id", authenticate, adminOnly, controller.remove);

export default router;