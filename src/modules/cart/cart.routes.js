// src/modules/cart/cart.routes.js

import { Router } from "express";

import {
    getCartController,
    addToCartController,
    updateCartItemController,
    removeCartItemController,
    clearCartController
} from "./cart.controller.js";

import { authenticate } from "../../middleware/auth.middleware.js";
import { validate } from "../../middleware/validate.middleware.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

import {
    addToCartSchema,
    updateCartItemSchema
} from "./cart.validation.js";

const router = Router();

router.use(authenticate);

router.get(
    "/",
    asyncHandler(getCartController)
);

router.post(
    "/items",
    validate(addToCartSchema),
    asyncHandler(addToCartController)
);

router.patch(
    "/items/:productId",
    validate(updateCartItemSchema),
    asyncHandler(updateCartItemController)
);

router.delete(
    "/items/:productId",
    asyncHandler(removeCartItemController)
);

router.delete(
    "/",
    asyncHandler(clearCartController)
);

export default router;