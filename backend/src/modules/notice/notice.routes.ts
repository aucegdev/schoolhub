import { Router } from "express";
import * as controller from "./notice.controller";
import { authenticate } from "../../middleware/auth";
import { adminOnly } from "../../middleware/adminOnly";

const router = Router();
router.use(authenticate);
router.get("/", controller.listNotices);
router.get("/:id", controller.getNotice);
router.post("/", adminOnly, controller.createNotice);
router.put("/:id", adminOnly, controller.updateNotice);
router.delete("/:id", adminOnly, controller.deleteNotice);
export default router;