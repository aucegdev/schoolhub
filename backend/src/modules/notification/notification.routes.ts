import { Router } from "express";
import * as controller from "./notification.controller";
import { authenticate } from "../../middleware/auth";

const router = Router();

router.use(authenticate);

router.get("/", controller.listNotifications);
router.post("/", controller.createNotification);
router.patch("/read-all", controller.markAllAsRead);
router.patch("/:id/read", controller.markAsRead);

export default router;
