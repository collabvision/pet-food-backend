import { Router } from "express";

import {
    sendOrderStatusNotificationController,
    getMyNotificationsController,
    getNotificationByIdController,
    getOrderNotificationsController,
    getAllNotificationsController
} from "./notifications.controller.js";

import {
    orderStatusNotificationSchema
} from "./notifications.validation.js";

import { validate } from "../../middleware/validate.middleware.js";
import { authenticate } from "../../middleware/auth.middleware.js";
import { authorize } from "../../middleware/role.middleware.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

const router = Router();

router.use(authenticate);

router.post(
    "/order-status",
    validate(
        orderStatusNotificationSchema
    ),
    asyncHandler(
        sendOrderStatusNotificationController
    )
);

router.get(
    "/",
    asyncHandler(
        getMyNotificationsController
    )
);

router.get(
    "/order/:orderId",
    asyncHandler(
        getOrderNotificationsController
    )
);

router.get(
    "/admin/all",
    authorize("ADMIN"),
    asyncHandler(
        getAllNotificationsController
    )
);

router.get(
    "/:notificationId",
    asyncHandler(
        getNotificationByIdController
    )
);

export default router;