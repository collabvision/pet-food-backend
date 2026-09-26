import { z } from "zod";

const objectIdSchema = z
    .string()
    .regex(/^[0-9a-fA-F]{24}$/, "Invalid ID");

const imageSchema = z.object({
    url: z.string().trim().min(1),
    publicId: z.string().trim().nullable().optional()
});

export const createProductSchema = z.object({
    name: z
        .string()
        .trim()
        .min(2)
        .max(200),

    slug: z
        .string()
        .trim()
        .min(2)
        .max(200)
        .regex(
            /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
            "Slug must contain only lowercase letters, numbers and hyphens"
        )
        .optional(),

    description: z
        .string()
        .trim()
        .min(1)
        .max(5000),

    category: objectIdSchema,

    price: z.coerce
        .number()
        .min(0),

    compareAtPrice: z.coerce
        .number()
        .min(0)
        .nullable()
        .optional(),

    sku: z
        .string()
        .trim()
        .min(1)
        .max(100),

    barcode: z
        .string()
        .trim()
        .max(100)
        .nullable()
        .optional(),

    images: z
        .array(imageSchema)
        .optional()
        .default([]),

    isMedical: z.coerce
        .boolean()
        .optional()
        .default(false),

    requiresPrescription: z.coerce
        .boolean()
        .optional()
        .default(false),

    brand: z
        .string()
        .trim()
        .max(100)
        .optional()
        .default(""),

    unit: z
        .string()
        .trim()
        .max(50)
        .optional()
        .default(""),

    isActive: z.coerce
        .boolean()
        .optional()
        .default(true)
});

export const updateProductSchema = z
    .object({
        name: z
            .string()
            .trim()
            .min(2)
            .max(200)
            .optional(),

        slug: z
            .string()
            .trim()
            .min(2)
            .max(200)
            .regex(
                /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
                "Slug must contain only lowercase letters, numbers and hyphens"
            )
            .optional(),

        description: z
            .string()
            .trim()
            .min(1)
            .max(5000)
            .optional(),

        category: objectIdSchema.optional(),

        price: z.coerce
            .number()
            .min(0)
            .optional(),

        compareAtPrice: z.coerce
            .number()
            .min(0)
            .nullable()
            .optional(),

        sku: z
            .string()
            .trim()
            .min(1)
            .max(100)
            .optional(),

        barcode: z
            .string()
            .trim()
            .max(100)
            .nullable()
            .optional(),

        images: z
            .array(imageSchema)
            .optional(),

        isMedical: z.coerce
            .boolean()
            .optional(),

        requiresPrescription: z.coerce
            .boolean()
            .optional(),

        brand: z
            .string()
            .trim()
            .max(100)
            .optional(),

        unit: z
            .string()
            .trim()
            .max(50)
            .optional(),

        isActive: z.coerce
            .boolean()
            .optional()
    })
    .refine(
        (data) => Object.keys(data).length > 0,
        {
            message: "At least one field is required"
        }
    );

export const productIdSchema = z.object({
    productId: objectIdSchema
});