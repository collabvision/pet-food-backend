// src/modules/orders/orders.routes.js

import { Router } from "express";

import {
    createOrderController,
    getOrdersController,
    getOrderController,
    getOrderByNumberController,
    cancelOrderController,
    getAdminOrdersController,
    updateOrderStatusController
} from "./orders.controller.js";

import { authenticate } from "../../middleware/auth.middleware.js";
import { authorize } from "../../middleware/role.middleware.js";
import { validate } from "../../middleware/validate.middleware.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

import {
    createOrderSchema,
    updateOrderStatusSchema
} from "./orders.validation.js";

const router = Router();

router.use(authenticate);

router.post(
    "/",
    validate(createOrderSchema),
    asyncHandler(createOrderController)
);

router.get(
    "/",
    asyncHandler(getOrdersController)
);

router.get(
    "/number/:orderNumber",
    asyncHandler(getOrderByNumberController)
);

router.get(
    "/:orderId",
    asyncHandler(getOrderController)
);

router.patch(
    "/:orderId/cancel",
    asyncHandler(cancelOrderController)
);

router.get(
    "/admin/all",
    authorize("ADMIN"),
    asyncHandler(getAdminOrdersController)
);

router.patch(
    "/admin/:orderId/status",
    authorize("ADMIN"),
    validate(updateOrderStatusSchema),
    asyncHandler(updateOrderStatusController)
);

export default router;