import { z } from "zod";

const objectIdSchema = z
    .string()
    .regex(
        /^[0-9a-fA-F]{24}$/,
        "Invalid ID"
    );

export const createPrescriptionSchema = z.object({
    productId: objectIdSchema,

    orderId: objectIdSchema.optional()
});

export const reviewPrescriptionSchema = z.object({
    status: z.enum([
        "APPROVED",
        "REJECTED"
    ]),

    adminNote: z
        .string()
        .trim()
        .max(2000)
        .optional()
});