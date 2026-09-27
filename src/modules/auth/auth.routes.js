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
    meController,
updateProfileController,
    // Address
    getAddressesController,
    addAddressController,
    updateAddressController,
    deleteAddressController,
    setDefaultAddressController,

    // Pets
    getPetsController,
    addPetController,
    updatePetController,
    deletePetController

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

router.patch(
    "/profile",
    authenticate,
    asyncHandler(updateProfileController)
);

// ─────────────────────────────────────────────
// ADDRESSES
// ─────────────────────────────────────────────

router.get(
    "/addresses",
    authenticate,
    asyncHandler(getAddressesController)
);

router.post(
    "/addresses",
    authenticate,
    asyncHandler(addAddressController)
);

router.patch(
    "/addresses/:addressId",
    authenticate,
    asyncHandler(updateAddressController)
);

router.delete(
    "/addresses/:addressId",
    authenticate,
    asyncHandler(deleteAddressController)
);

router.patch(
    "/addresses/:addressId/default",
    authenticate,
    asyncHandler(setDefaultAddressController)
);


// ─────────────────────────────────────────────
// PETS
// ─────────────────────────────────────────────

router.get(
    "/pets",
    authenticate,
    asyncHandler(getPetsController)
);

router.post(
    "/pets",
    authenticate,
    asyncHandler(addPetController)
);

router.patch(
    "/pets/:petId",
    authenticate,
    asyncHandler(updatePetController)
);

router.delete(
    "/pets/:petId",
    authenticate,
    asyncHandler(deletePetController)
);

export default router;