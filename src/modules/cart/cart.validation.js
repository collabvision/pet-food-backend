// src/modules/cart/cart.validation.js

import { z } from "zod";

const objectIdSchema = z
    .string()
    .regex(/^[0-9a-fA-F]{24}$/, "Invalid product ID");

export const addToCartSchema = z.object({
    productId: objectIdSchema,
    quantity: z.number().int().min(1).max(100)
});

export const updateCartItemSchema = z.object({
    quantity: z.number().int().min(1).max(100)
});

export const removeCartItemSchema = z.object({
    productId: objectIdSchema
});