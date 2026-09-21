import { Router } from "express";
import * as controller from "./messaging.controller";
import { authenticate } from "../../middleware/auth";

const router = Router();
router.use(authenticate);
router.get("/", controller.listMessages);
router.get("/:id", controller.getMessage);
router.post("/", controller.createMessage);
router.patch("/:id/read", controller.markAsRead);
router.delete("/:id", controller.deleteMessage);
export default router;