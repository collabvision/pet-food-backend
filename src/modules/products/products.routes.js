import { Router } from "express";

import {
    createProductController,
    getProductsController,
    getProductByIdController,
    getProductBySlugController,
    updateProductController,
    deleteProductController
} from "./products.controller.js";

import {
    createProductSchema,
    updateProductSchema
} from "./products.validation.js";

import { validate } from "../../middleware/validate.middleware.js";
import { authenticate } from "../../middleware/auth.middleware.js";
import { authorize } from "../../middleware/role.middleware.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { upload } from "../../middleware/upload.middleware.js";

const router = Router();

// Public
router.get(
    "/",
    asyncHandler(getProductsController)
);

router.get(
    "/slug/:slug",
    asyncHandler(getProductBySlugController)
);

router.get(
    "/:productId",
    asyncHandler(getProductByIdController)
);

// Admin
router.post(
    "/",
    authenticate,
    authorize("ADMIN"),
    upload.single("image"),
    validate(createProductSchema),
    asyncHandler(createProductController)
);

router.patch(
    "/:productId",
    authenticate,
    authorize("ADMIN"),
    upload.single("image"),
    validate(updateProductSchema),
    asyncHandler(updateProductController)
);

router.delete(
    "/:productId",
    authenticate,
    authorize("ADMIN"),
    asyncHandler(deleteProductController)
);

export default router;