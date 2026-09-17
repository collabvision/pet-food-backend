// src/modules/shipping/shipping.validation.js

import { z } from "zod";

const objectIdSchema = z
    .string()
    .regex(
        /^[0-9a-fA-F]{24}$/,
        "Invalid ID"
    );

export const createShipmentSchema = z.object({
    orderId: objectIdSchema,

    provider: z
        .string()
        .trim()
        .min(2)
        .max(50)
        .default("manual"),

    courierName: z
        .string()
        .trim()
        .min(2)
        .max(100)
        .optional(),

    trackingNumber: z
        .string()
        .trim()
        .min(2)
        .max(100)
        .optional(),

    estimatedDeliveryDate: z
        .string()
        .datetime()
        .optional()
});

export const updateShipmentStatusSchema = z.object({
    status: z.enum([
        "PENDING",
        "READY_TO_SHIP",
        "SHIPPED",
        "IN_TRANSIT",
        "OUT_FOR_DELIVERY",
        "DELIVERED",
        "CANCELLED",
        "RETURNED"
    ]),

    note: z
        .string()
        .trim()
        .max(500)
        .optional()
        .default("")
});

export const trackingNumberSchema = z.object({
    trackingNumber: z
        .string()
        .trim()
        .min(2)
        .max(100)
});