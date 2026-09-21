import { Router } from "express";
import * as controller from "./transport.controller";
import { authenticate } from "../../middleware/auth";
import { adminOnly } from "../../middleware/adminOnly";

const router = Router();

router.use(authenticate);

// Vehicles
router.get("/vehicles", controller.listVehicles);
router.post("/vehicles", authenticate, adminOnly, controller.createVehicle);
router.get("/vehicles/:id", controller.getVehicle);
router.put("/vehicles/:id", authenticate, adminOnly, controller.updateVehicle);
router.delete("/vehicles/:id", authenticate, adminOnly, controller.deleteVehicle);

// Drivers
router.get("/drivers", controller.listDrivers);
router.post("/drivers", authenticate, adminOnly, controller.createDriver);
router.get("/drivers/:id", controller.getDriver);
router.put("/drivers/:id", authenticate, adminOnly, controller.updateDriver);
router.delete("/drivers/:id", authenticate, adminOnly, controller.deleteDriver);

// Routes
router.get("/routes", controller.listRoutes);
router.post("/routes", authenticate, adminOnly, controller.createRoute);
router.get("/routes/:id", controller.getRoute);
router.put("/routes/:id", authenticate, adminOnly, controller.updateRoute);
router.delete("/routes/:id", authenticate, adminOnly, controller.deleteRoute);

// Allocations
router.get("/allocations", controller.listAllocations);
router.post("/allocations", authenticate, adminOnly, controller.createAllocation);
router.delete("/allocations/:id", authenticate, adminOnly, controller.deleteAllocation);

export default router;