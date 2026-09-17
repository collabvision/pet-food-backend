import { Router } from "express";

import {
    registerController,
    verifyEmailController,
    resendVerificationController,
    loginController,
    refreshController,
    logoutController,
    forgotPasswordController,
    resetPasswordController,
    changePasswordController,
    meController
} from "./auth.controller.js";

import {
    registerSchema,
    loginSchema,
    verifyEmailSchema,
    resendVerificationSchema,
    forgotPasswordSchema,
    resetPasswordSchema,
    changePasswordSchema
} from "./auth.validation.js";

import {
    validate
} from "../../middleware/validate.middleware.js";

import {
    authenticate
} from "../../middleware/auth.middleware.js";

import {
    asyncHandler
} from "../../utils/asyncHandler.js";

const router = Router();

router.post(
    "/register",
    validate(registerSchema),
    asyncHandler(registerController)
);

router.post(
    "/verify-email",
    validate(verifyEmailSchema),
    asyncHandler(verifyEmailController)
);

router.post(
    "/resend-verification",
    validate(resendVerificationSchema),
    asyncHandler(resendVerificationController)
);

router.post(
    "/login",
    validate(loginSchema),
    asyncHandler(loginController)
);

router.post(
    "/refresh",
    asyncHandler(refreshController)
);

router.post(
    "/logout",
    authenticate,
    asyncHandler(logoutController)
);

router.post(
    "/forgot-password",
    validate(forgotPasswordSchema),
    asyncHandler(forgotPasswordController)
);

router.post(
    "/reset-password",
    validate(resetPasswordSchema),
    asyncHandler(resetPasswordController)
);

router.patch(
    "/change-password",
    authenticate,
    validate(changePasswordSchema),
    asyncHandler(changePasswordController)
);

router.get(
    "/me",
    authenticate,
    asyncHandler(meController)
);

export default router;