import Joi from "joi";

export const updateUserSchema = Joi.object({
    isActive: Joi.boolean(),
    role: Joi.string().valid("USER", "ADMIN"),
}).min(1);
