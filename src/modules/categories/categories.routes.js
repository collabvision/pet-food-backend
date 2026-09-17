import { Router } from "express";

import {
    createCategoryController,
    getCategoriesController,
    getCategoryByIdController,
    updateCategoryController,
    deleteCategoryController
} from "./categories.controller.js";

import {
    createCategorySchema,
    updateCategorySchema
} from "./categories.validation.js";

import { validate } from "../../middleware/validate.middleware.js";
import { authenticate } from "../../middleware/auth.middleware.js";
import { authorize } from "../../middleware/role.middleware.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

const router = Router();

// Public
router.get(
    "/",
    asyncHandler(getCategoriesController)
);

router.get(
    "/:categoryId",
    asyncHandler(getCategoryByIdController)
);

// Admin
router.post(
    "/",
    authenticate,
    authorize("ADMIN"),
    validate(createCategorySchema),
    asyncHandler(createCategoryController)
);

router.patch(
    "/:categoryId",
    authenticate,
    authorize("ADMIN"),
    validate(updateCategorySchema),
    asyncHandler(updateCategoryController)
);

router.delete(
    "/:categoryId",
    authenticate,
    authorize("ADMIN"),
    asyncHandler(deleteCategoryController)
);

export default router;