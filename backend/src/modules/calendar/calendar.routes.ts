import { Router } from "express";
import { authenticate } from "../../middleware/auth";
import { adminOnly } from "../../middleware/adminOnly";
import * as controller from "./calendar.controller";

const router = Router();

router.get("/", authenticate, controller.getCalendar);
router.get("/holidays", authenticate, controller.listHolidays);
router.post("/holidays", authenticate, adminOnly, controller.addHoliday);
router.delete("/holidays/:id", authenticate, adminOnly, controller.removeHoliday);

export default router;
