// src/modules/shipping/shipping.routes.js

import { Router } from "express";

import {
    createShipmentController,
    getShipmentsController,
    getShipmentController,
    getTrackingController,
    updateShipmentStatusController,
    getAdminShipmentsController
} from "./shipping.controller.js";

import { authenticate } from "../../middleware/auth.middleware.js";
import { authorize } from "../../middleware/role.middleware.js";
import { validate } from "../../middleware/validate.middleware.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

import {
    createShipmentSchema,
    updateShipmentStatusSchema
} from "./shipping.validation.js";

const router = Router();

router.use(authenticate);

router.get(
    "/",
    asyncHandler(getShipmentsController)
);

router.get(
    "/tracking/:trackingNumber",
    asyncHandler(getTrackingController)
);

router.get(
    "/:shipmentId",
    asyncHandler(getShipmentController)
);

router.post(
    "/",
    authorize("ADMIN"),
    validate(createShipmentSchema),
    asyncHandler(createShipmentController)
);

router.patch(
    "/:shipmentId/status",
    authorize("ADMIN"),
    validate(updateShipmentStatusSchema),
    asyncHandler(updateShipmentStatusController)
);

router.get(
    "/admin/all",
    authorize("ADMIN"),
    asyncHandler(getAdminShipmentsController)
);

export default router;