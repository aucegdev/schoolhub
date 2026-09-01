import { Router } from "express";
import { authenticate } from "../../middleware/auth";
import { adminOnly } from "../../middleware/adminOnly";
import * as controller from "./timetable.controller";

const router = Router();

router.get("/", authenticate, controller.list);
router.get("/:id", authenticate, controller.getById);
router.post("/", authenticate, adminOnly, controller.create);
router.put("/:id", authenticate, adminOnly, controller.update);
router.delete("/:id", authenticate, adminOnly, controller.remove);

export default router;
