// src/modules/orders/orders.validation.js

import { z } from "zod";

const objectIdSchema = z
    .string()
    .regex(/^[0-9a-fA-F]{24}$/, "Invalid ID");

const addressSchema = z.object({
    name: z.string().trim().min(2).max(100),
    phone: z.string().trim().regex(
        /^[6-9]\d{9}$/,
        "Invalid Indian phone number"
    ),
    addressLine1: z.string().trim().min(3).max(200),
    addressLine2: z.string().trim().max(200).optional().default(""),
    city: z.string().trim().min(2).max(100),
    state: z.string().trim().min(2).max(100),
    pincode: z.string().trim().regex(
        /^\d{6}$/,
        "Invalid pincode"
    ),
    country: z.string().trim().min(2).max(100).default("India")
});

export const createOrderSchema = z.object({
    shippingAddress: addressSchema,
    shippingCharge: z.number().min(0).default(0),
    discount: z.number().min(0).default(0)
});

export const updateOrderStatusSchema = z.object({
    status: z.enum([
        "PENDING",
        "CONFIRMED",
        "PROCESSING",
        "SHIPPED",
        "DELIVERED",
        "CANCELLED",
        "RETURN_REQUESTED",
        "RETURNED"
    ]),
    note: z.string().trim().max(500).optional().default("")
});

export const orderIdSchema = z.object({
    orderId: objectIdSchema
});