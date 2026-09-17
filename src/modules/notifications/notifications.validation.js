import { z } from "zod";

const objectIdSchema = z
    .string()
    .regex(
        /^[0-9a-fA-F]{24}$/,
        "Invalid ID"
    );

export const orderStatusNotificationSchema =
    z.object({
        orderId: objectIdSchema,

        userId: objectIdSchema,

        orderStatus: z.enum([
            "PENDING",
            "CONFIRMED",
            "PROCESSING",
            "SHIPPED",
            "DELIVERED",
            "CANCELLED",
            "RETURN_REQUESTED",
            "RETURNED"
        ]),

        email: z
            .string()
            .email(),

        phone: z
            .string()
            .min(5)
            .max(20),

        orderNumber: z
            .string()
            .min(1)
            .max(100)
    });