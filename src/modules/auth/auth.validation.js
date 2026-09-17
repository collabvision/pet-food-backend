import { z } from "zod";

const emailSchema = z
    .string()
    .trim()
    .email()
    .transform((value) => value.toLowerCase());

export const registerSchema = z.object({
    name: z.string().trim().min(2).max(100),
    email: emailSchema,
    password: z.string().min(8).max(128)
});

export const verifyEmailSchema = z.object({
    email: emailSchema,
    code: z.string().regex(/^\d{6}$/, "Verification code must be 6 digits")
});

export const resendVerificationSchema = z.object({
    email: emailSchema
});

export const loginSchema = z.object({
    email: emailSchema,
    password: z.string().min(1).max(128)
});

export const forgotPasswordSchema = z.object({
    email: emailSchema
});

export const resetPasswordSchema = z.object({
    token: z.string().min(1),
    password: z.string().min(8).max(128)
});

export const changePasswordSchema = z.object({
    currentPassword: z.string().min(1),
    newPassword: z.string().min(8).max(128)
});