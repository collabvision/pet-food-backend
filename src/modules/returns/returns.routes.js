import { Router } from "express";

import {
    requestReturnController,
    getMyReturnsController,
    getReturnByIdController,
    getReturnByNumberController,
    getAllReturnsController,
    updateReturnStatusController
} from "./returns.controller.js";

import {
    createReturnSchema,
    updateReturnStatusSchema
} from "./returns.validation.js";

import { validate } from "../../middleware/validate.middleware.js";
import { authenticate } from "../../middleware/auth.middleware.js";
import { authorize } from "../../middleware/role.middleware.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

const router = Router();

router.use(authenticate);

router.post(
    "/",
    validate(createReturnSchema),
    asyncHandler(requestReturnController)
);

router.get(
    "/",
    asyncHandler(getMyReturnsController)
);

router.get(
    "/number/:returnNumber",
    asyncHandler(getReturnByNumberController)
);

router.get(
    "/admin/all",
    authorize("ADMIN"),
    asyncHandler(getAllReturnsController)
);

router.patch(
    "/admin/:returnId/status",
    authorize("ADMIN"),
    validate(updateReturnStatusSchema),
    asyncHandler(updateReturnStatusController)
);

router.get(
    "/:returnId",
    asyncHandler(getReturnByIdController)
);

export default router;