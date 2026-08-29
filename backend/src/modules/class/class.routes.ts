import { Router } from "express";
import { authenticate } from "../../middleware/auth";
import { adminOnly } from "../../middleware/adminOnly";
import * as controller from "./class.controller";

const router = Router();

router.get("/", authenticate, controller.list);
router.get("/:id", authenticate, controller.getById);
router.post("/", authenticate, adminOnly, controller.create);
router.put("/:id", authenticate, adminOnly, controller.update);
router.delete("/:id", authenticate, adminOnly, controller.remove);

router.post("/:id/sections", authenticate, adminOnly, controller.addSection);
router.put("/:classId/sections/:sectionId", authenticate, adminOnly, controller.updateSection);
router.delete("/:classId/sections/:sectionId", authenticate, adminOnly, controller.removeSection);

export default router;
