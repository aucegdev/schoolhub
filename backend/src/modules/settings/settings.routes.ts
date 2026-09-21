import { Router } from "express";
import * as controller from "./settings.controller";
import { authenticate } from "../../middleware/auth";
import { adminOnly } from "../../middleware/adminOnly";

const router = Router();

router.use(authenticate);

router.get("/", controller.listSettings);
router.get("/:key", controller.getSetting);
router.post("/", authenticate, adminOnly, controller.setSetting);
router.put("/:key", authenticate, adminOnly, controller.updateSetting);
router.delete("/:key", authenticate, adminOnly, controller.deleteSetting);
router.post("/seed", authenticate, adminOnly, controller.seedSettings);

export default router;