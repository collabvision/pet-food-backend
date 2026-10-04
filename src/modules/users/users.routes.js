import { Router } from "express";
import {
    getAllUsersController,
    getUserByIdController,
    updateUserController,
} from "./users.controller.js";
import { authenticate } from "../../middleware/auth.middleware.js";
import { authorize } from "../../middleware/role.middleware.js";
import { validate } from "../../middleware/validate.middleware.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { updateUserSchema } from "./users.validation.js";

const router = Router();

router.use(authenticate, authorize("ADMIN"));

router.get("/", asyncHandler(getAllUsersController));

router.get("/:id", asyncHandler(getUserByIdController));

router.patch(
    "/:id",
    validate(updateUserSchema),
    asyncHandler(updateUserController)
);

export default router;
