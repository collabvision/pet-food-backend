import { Router } from "express";
import { getMetricsController, exportDataController } from "./system.controller.js";
import { authenticate } from "../../middleware/auth.middleware.js";
import { authorize } from "../../middleware/role.middleware.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

const router = Router();

router.use(authenticate, authorize("ADMIN"));

router.get("/metrics", asyncHandler(getMetricsController));
router.get("/export", asyncHandler(exportDataController));

export default router;
