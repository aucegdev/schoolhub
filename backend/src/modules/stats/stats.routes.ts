import { Router } from "express";
import { authenticate } from "../../middleware/auth";
import * as controller from "./stats.controller";

const router = Router();

router.get("/", authenticate, controller.getStats);

export default router;