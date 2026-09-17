import { z } from "zod";

const objectIdSchema = z
    .string()
    .regex(/^[0-9a-fA-F]{24}$/, "Invalid category ID");

export const createCategorySchema = z.object({
    name: z
        .string()
        .trim()
        .min(2)
        .max(100),

    slug: z
        .string()
        .trim()
        .min(2)
        .max(100)
        .regex(
            /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
            "Slug must contain only lowercase letters, numbers and hyphens"
        ),

    description: z
        .string()
        .trim()
        .max(500)
        .optional()
        .default(""),

    isActive: z
        .boolean()
        .optional()
        .default(true)
});

export const updateCategorySchema = z
    .object({
        name: z
            .string()
            .trim()
            .min(2)
            .max(100)
            .optional(),

        slug: z
            .string()
            .trim()
            .min(2)
            .max(100)
            .regex(
                /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
                "Slug must contain only lowercase letters, numbers and hyphens"
            )
            .optional(),

        description: z
            .string()
            .trim()
            .max(500)
            .optional(),

        isActive: z
            .boolean()
            .optional()
    })
    .refine(
        (data) => Object.keys(data).length > 0,
        {
            message: "At least one field is required"
        }
    );

export const categoryIdSchema = z.object({
    categoryId: objectIdSchema
});