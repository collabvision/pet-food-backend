// src/modules/payments/payments.routes.js

import { Router } from "express";

import {
    createPaymentOrderController,
    verifyPaymentController,
    getPaymentController,
    getOrderPaymentController,
    getUserPaymentsController
} from "./payments.controller.js";

import { authenticate } from "../../middleware/auth.middleware.js";
import { validate } from "../../middleware/validate.middleware.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

import {
    createPaymentOrderSchema,
    verifyPaymentSchema
} from "./payments.validation.js";

const router = Router();

router.use(authenticate);

router.post(
    "/create-order",
    validate(createPaymentOrderSchema),
    asyncHandler(createPaymentOrderController)
);

router.post(
    "/verify",
    validate(verifyPaymentSchema),
    asyncHandler(verifyPaymentController)
);

router.get(
    "/",
    asyncHandler(getUserPaymentsController)
);

router.get(
    "/order/:orderId",
    asyncHandler(getOrderPaymentController)
);

router.get(
    "/:paymentId",
    asyncHandler(getPaymentController)
);

export default router;