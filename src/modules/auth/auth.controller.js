import {
    register,
    verifyEmail,
    resendVerificationEmail,
    login,
    refreshAccessToken,
    logout,
    forgotPassword,
    resetPassword,
    changePassword,
    getCurrentUser
} from "./auth.service.js";

import { ApiError } from "../../utils/ApiError.js";

export async function registerController(req, res) {
    const result = await register(req.body);

    res.status(201).json({
        success: true,
        message:
            "Registration successful. Check your email for the 6-digit verification code.",
        data: result
    });
}

export async function verifyEmailController(req, res) {
    const user = await verifyEmail(
        req.body.email,
        req.body.code
    );

    res.status(200).json({
        success: true,
        message: "Email verified successfully",
        data: user
    });
}

export async function resendVerificationController(
    req,
    res
) {
    await resendVerificationEmail(
        req.body.email
    );

    res.status(200).json({
        success: true,
        message:
            "If registration is pending, a new verification code has been sent."
    });
}

export async function loginController(req, res) {
    const result = await login(
        req.body.email,
        req.body.password
    );

    console.log("LOGIN RESULT:");
    console.log("user:", result.user);
    console.log("refresh token exists:", !!result.refreshToken);

    res.cookie("refreshToken", result.refreshToken, {
        httpOnly: true,
        secure: false, // TEMPORARY
        sameSite: "lax",
        maxAge: 30 * 24 * 60 * 60 * 1000,
        path: "/"
    });

    console.log(
        "SET-COOKIE:",
        res.getHeader("Set-Cookie")
    );

    res.status(200).json({
        success: true,
        message: "Login successful",
        data: {
            user: result.user,
            accessToken: result.accessToken
        }
    });
}
export async function refreshController(req, res) {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
        throw new ApiError(
            401,
            "Refresh token is required"
        );
    }

    const result =
        await refreshAccessToken(refreshToken);

    res.cookie("refreshToken", result.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 30 * 24 * 60 * 60 * 1000,
        path: "/"
    });

    res.status(200).json({
        success: true,
        message: "Access token refreshed",
        data: {
            accessToken: result.accessToken
        }
    });
}

export async function logoutController(req, res) {
    await logout(req.user.id);

    res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/api/v1/auth"
    });

    res.status(200).json({
        success: true,
        message: "Logout successful"
    });
}


export async function forgotPasswordController(
    req,
    res
) {
    await forgotPassword(req.body.email);

    res.status(200).json({
        success: true,
        message:
            "If the email exists, a password reset email has been sent."
    });
}

export async function resetPasswordController(
    req,
    res
) {
    await resetPassword(
        req.body.token,
        req.body.password
    );

    res.status(200).json({
        success: true,
        message: "Password reset successfully"
    });
}

export async function changePasswordController(
    req,
    res
) {
    await changePassword(
        req.user.id,
        req.body.currentPassword,
        req.body.newPassword
    );

    res.status(200).json({
        success: true,
        message:
            "Password changed successfully. Please login again."
    });
}

export async function meController(req, res) {
    const user =
        await getCurrentUser(req.user.id);

    res.status(200).json({
        success: true,
        data: user
    });
}