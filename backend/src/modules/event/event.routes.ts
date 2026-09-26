import { Router } from "express";
import * as controller from "./event.controller";
import { authenticate } from "../../middleware/auth";
import { adminOnly } from "../../middleware/adminOnly";

const router = Router();
router.use(authenticate);
router.get("/", controller.listEvents);
router.get("/:id", controller.getEvent);
router.post("/", adminOnly, controller.createEvent);
router.put("/:id", adminOnly, controller.updateEvent);
router.delete("/:id", adminOnly, controller.deleteEvent);
export default router;