// src/modules/reviews/reviews.routes.js

import { Router } from "express";
import {
    createReviewController,
    getProductReviewsController,
    getMyReviewsController,
    checkCanReviewController
} from "./reviews.controller.js";
import { authenticate } from "../../middleware/auth.middleware.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

const router = Router();

// Public – get reviews for a product
router.get(
    "/product/:productId",
    asyncHandler(getProductReviewsController)
);

// Protected routes
router.use(authenticate);

// Submit a review
router.post(
    "/",
    asyncHandler(createReviewController)
);

// Get my reviews
router.get(
    "/my",
    asyncHandler(getMyReviewsController)
);

// Check if user can review a product for a given order
router.get(
    "/can-review/:productId/:orderId",
    asyncHandler(checkCanReviewController)
);

export default router;
