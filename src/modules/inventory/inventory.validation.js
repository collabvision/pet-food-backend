import { z } from "zod";

const objectIdSchema = z
    .string()
    .regex(
        /^[0-9a-fA-F]{24}$/,
        "Invalid product ID"
    );


export const createInventorySchema = z.object({
    product: objectIdSchema,

    quantity: z
        .number()
        .int()
        .min(0),

    reservedQuantity: z
        .number()
        .int()
        .min(0)
        .optional()
        .default(0),

    lowStockThreshold: z
        .number()
        .int()
        .min(0)
        .optional()
        .default(10)
});


export const updateInventorySchema = z
    .object({
        quantity: z
            .number()
            .int()
            .min(0)
            .optional(),

        reservedQuantity: z
            .number()
            .int()
            .min(0)
            .optional(),

        lowStockThreshold: z
            .number()
            .int()
            .min(0)
            .optional()
    })
    .refine(
        (data) => Object.keys(data).length > 0,
        {
            message:
                "At least one field is required"
        }
    );


export const inventoryProductIdSchema = z.object({
    productId: objectIdSchema
});


export const inventoryQuantitySchema = z.object({
    quantity: z
        .number()
        .int()
        .positive()
});