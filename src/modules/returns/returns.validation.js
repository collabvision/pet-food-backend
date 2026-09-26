import { z } from "zod";

const objectIdSchema = z
    .string()
    .regex(/^[0-9a-fA-F]{24}$/, "Invalid ID");

export const createReturnSchema = z.object({
    orderId: objectIdSchema,

    items: z
        .array(
            z.object({
                productId: objectIdSchema,
                quantity: z
                    .number()
                    .int()
                    .min(1)
                    .max(100),
                reason: z
                    .string()
                    .trim()
                    .min(1)
                    .max(1000)
                    .optional()
                    .default("Return requested")
            })
        )
        .min(1),

    reason: z.enum([
        "DEFECTIVE_PRODUCT",
        "WRONG_ITEM",
        "NOT_AS_DESCRIBED",
        "QUALITY_ISSUE",
        "SIZE_FIT_ISSUE",
        "OTHER"
    ]).default("DEFECTIVE_PRODUCT"),

    description: z
        .string()
        .trim()
        .max(2000)
        .optional()
        .default("")
});

export const updateReturnStatusSchema = z.object({
    status: z.enum([
        "APPROVED",
        "REJECTED",
        "PICKUP_PENDING",
        "PICKED_UP",
        "REFUNDED",
        "CANCELLED"
    ]),

    adminNote: z
        .string()
        .trim()
        .max(2000)
        .optional(),

    refundAmount: z
        .number()
        .min(0)
        .optional(),

    refundPaymentId: z
        .string()
        .trim()
        .max(200)
        .optional()
});