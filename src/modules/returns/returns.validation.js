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
                    .min(3)
                    .max(1000)
            })
        )
        .min(1),

    reason: z.literal("DEFECTIVE_PRODUCT"),

    description: z
        .string()
        .trim()
        .min(3)
        .max(2000)
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