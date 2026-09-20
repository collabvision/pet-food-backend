import bcrypt from "bcryptjs";

import {
    createUser,
    findByEmail,
    findById,
    findByIdWithSensitiveFields,
    updateById,
    saveUser
} from "./auth.repository.js";

import {
    generateAccessToken,
    generateRefreshToken,
    generateVerificationCode,
    generateRandomToken,
    hashToken,
    verifyRefreshToken
} from "./auth.tokens.js";

import {
    createPendingRegistration,
    findPendingByEmail,
    deletePendingByEmail,
    updatePendingByEmail
} from "./pendingRegistration.repository.js";

import { ApiError } from "../../utils/ApiError.js";
import { emailProvider } from "../../providers/email/index.js";

const SALT_ROUNDS = 12;

const VERIFICATION_CODE_EXPIRY =
    10 * 60 * 1000;

const PASSWORD_RESET_EXPIRY =
    15 * 60 * 1000;

export async function register({
    name,
    email,
    password
}) {
    const existingUser =
        await findByEmail(email);

    if (existingUser) {
        throw new ApiError(
            409,
            "Email is already registered"
        );
    }

    const passwordHash =
        await bcrypt.hash(
            password,
            SALT_ROUNDS
        );

    const verificationCode =
        generateVerificationCode();

    // const verificationCode = "123456"; // for ddevelopment only

    const verificationCodeHash =
        hashToken(verificationCode);

    const verificationCodeExpires =
        new Date(
            Date.now() +
            VERIFICATION_CODE_EXPIRY
        );

    const existingPending =
        await findPendingByEmail(email);

    if (existingPending) {
        await updatePendingByEmail(email, {
            name,
            passwordHash,
            verificationCodeHash,
            verificationCodeExpires
        });
    } else {
        await createPendingRegistration({
            name,
            email,
            passwordHash,
            verificationCodeHash,
            verificationCodeExpires
        });
    }

    try {
        await sendVerificationEmail(
            email,
            name,
            verificationCode
        );
    } catch (error) {
        await deletePendingByEmail(email);
        throw error;
    }

    return {
        email,
        verificationRequired: true
    };
}

export async function verifyEmail(
    email,
    code
) {
    const pending =
        await findPendingByEmail(email);

    if (!pending) {
        throw new ApiError(
            400,
            "Invalid or expired verification code"
        );
    }

    if (
        pending.verificationCodeExpires <
        new Date()
    ) {
        await deletePendingByEmail(email);

        throw new ApiError(
            400,
            "Invalid or expired verification code"
        );
    }

    const codeHash =
        hashToken(code);

    if (
        codeHash !==
        pending.verificationCodeHash
    ) {
        throw new ApiError(
            400,
            "Invalid verification code"
        );
    }

    const existingUser =
        await findByEmail(email);

    if (existingUser) {
        await deletePendingByEmail(email);

        throw new ApiError(
            409,
            "Email is already registered"
        );
    }

    const user = await createUser({
        name: pending.name,
        email: pending.email,
        passwordHash: pending.passwordHash,
        role: "USER",
        isEmailVerified: true
    });

    await deletePendingByEmail(email);

    return sanitizeUser(user);
}

async function sendVerificationEmail(
    email,
    name,
    code
) {
    await emailProvider.sendEmail({
        to: email,
        subject: "Verify your email - My Store",

        text:
            `Hello ${name},\n\n` +
            `Your verification code is: ${code}\n\n` +
            `This code expires in 10 minutes.\n\n` +
            `If you did not create this account, ignore this email.`,

        html: `
            <div style="
                font-family:Arial,sans-serif;
                max-width:600px;
                margin:auto;
                padding:30px;
            ">

                <h2>Verify your email</h2>

                <p>Hello ${name},</p>

                <p>
                    Use the following verification code
                    to verify your email address:
                </p>

                <div style="
                    font-size:32px;
                    font-weight:bold;
                    letter-spacing:8px;
                    margin:30px 0;
                ">
                    ${code}
                </div>

                <p>
                    This code expires in
                    <strong>10 minutes</strong>.
                </p>

                <p>
                    If you did not create this account,
                    you can ignore this email.
                </p>

            </div>
        `
    });
}

export async function resendVerificationEmail(
    email
) {
    const existingUser =
        await findByEmail(email);

    if (existingUser) {
        if (existingUser.isEmailVerified) {
            throw new ApiError(
                400,
                "Email is already verified"
            );
        }

        return;
    }

    const pending =
        await findPendingByEmail(email);

    if (!pending) {
        return;
    }

    const verificationCode =
        generateVerificationCode();

    const verificationCodeHash =
        hashToken(verificationCode);

    const verificationCodeExpires =
        new Date(
            Date.now() +
            VERIFICATION_CODE_EXPIRY
        );

    await updatePendingByEmail(email, {
        verificationCodeHash,
        verificationCodeExpires
    });

    await sendVerificationEmail(
        pending.email,
        pending.name,
        verificationCode
    );
}

export async function login(
    email,
    password
) {
    const user =
        await findByEmail(
            email,
            true
        );

    if (!user) {
        throw new ApiError(
            401,
            "Invalid email or password"
        );
    }

    if (!user.isActive) {
        throw new ApiError(
            403,
            "Account is inactive"
        );
    }

    const passwordMatch =
        await bcrypt.compare(
            password,
            user.passwordHash
        );

    if (!passwordMatch) {
        throw new ApiError(
            401,
            "Invalid email or password"
        );
    }

    if (!user.isEmailVerified) {
        throw new ApiError(
            403,
            "Please verify your email before logging in"
        );
    }

    const accessToken =
        generateAccessToken(user);

    const refreshToken =
        generateRefreshToken(user);

    user.refreshTokenHash =
        hashToken(refreshToken);

    await saveUser(user);

    return {
        user: sanitizeUser(user),
        accessToken,
        refreshToken
    };
}

export async function refreshAccessToken(refreshToken) {
  let payload;

  try {
    payload = verifyRefreshToken(refreshToken);
    console.log("REFRESH JWT VALID:", payload);
  } catch (error) {
    console.log("JWT VERIFY FAILED:", error.message);
    throw new ApiError(401, "Invalid refresh token");
  }

  const user = await findByIdWithSensitiveFields(payload.userId);

  console.log("USER FOUND:", !!user);
  console.log("REFRESH HASH EXISTS:", !!user?.refreshTokenHash);

  if (!user) {
    throw new ApiError(401, "Invalid refresh token");
  }

  const receivedHash = hashToken(refreshToken);

  console.log("STORED HASH EXISTS:", !!user.refreshTokenHash);
  console.log("HASH MATCH:", user.refreshTokenHash === receivedHash);

  if (
    !user.refreshTokenHash ||
    user.refreshTokenHash !== receivedHash
  ) {
    throw new ApiError(401, "Invalid refresh token");
  }

  const newAccessToken = generateAccessToken(user);
  const newRefreshToken = generateRefreshToken(user);

  user.refreshTokenHash = hashToken(newRefreshToken);

  await saveUser(user);

  return {
    accessToken: newAccessToken,
    refreshToken: newRefreshToken,
  };
}

export async function logout(userId) {
    await updateById(userId, {
        refreshTokenHash: null
    });
}

export async function forgotPassword(email) {
    const user =
        await findByEmail(email);

    if (!user || !user.isActive) {
        return;
    }

    const resetToken =
        generateRandomToken();

    const resetTokenHash =
        hashToken(resetToken);

    const resetExpires =
        new Date(
            Date.now() +
            PASSWORD_RESET_EXPIRY
        );

    await updateById(user._id, {
        passwordResetTokenHash:
            resetTokenHash,

        passwordResetExpires:
            resetExpires
    });

    const resetUrl =
        `${process.env.CLIENT_URL}/reset-password?token=${resetToken}`;

    await emailProvider.sendEmail({
        to: user.email,
        subject: "Reset your password - My Store",

        text:
            `Hello ${user.name},\n\n` +
            `Reset your password using this link:\n\n` +
            `${resetUrl}\n\n` +
            `This link expires in 15 minutes.`,

        html: `
            <div style="
                font-family:Arial,sans-serif;
                max-width:600px;
                margin:auto;
                padding:30px;
            ">

                <h2>Password Reset</h2>

                <p>Hello ${user.name},</p>

                <p>
                    We received a request to reset your password.
                </p>

                <p>
                    Reset your password using the link below:
                </p>

                <a
                    href="${resetUrl}"
                    style="
                        display:inline-block;
                        padding:12px 24px;
                        background:#111827;
                        color:white;
                        text-decoration:none;
                        border-radius:6px;
                    "
                >
                    Reset Password
                </a>

                <p>
                    This link expires in 15 minutes.
                </p>

            </div>
        `
    });
}

export async function resetPassword(
    token,
    newPassword
) {
    const tokenHash =
        hashToken(token);

    const user =
        await findUserWithPasswordResetToken(
            tokenHash
        );

    if (!user) {
        throw new ApiError(
            400,
            "Invalid or expired password reset token"
        );
    }

    user.passwordHash =
        await bcrypt.hash(
            newPassword,
            SALT_ROUNDS
        );

    user.passwordResetTokenHash = null;
    user.passwordResetExpires = null;
    user.refreshTokenHash = null;

    await saveUser(user);
}

async function findUserWithPasswordResetToken(
    tokenHash
) {
    const { User } =
        await import("../users/user.model.js");

    return User.findOne({
        passwordResetTokenHash:
            tokenHash,

        passwordResetExpires: {
            $gt: new Date()
        }
    }).select("+passwordHash");
}

export async function changePassword(
    userId,
    currentPassword,
    newPassword
) {
    const user =
        await findByIdWithSensitiveFields(
            userId
        );

    if (!user) {
        throw new ApiError(
            404,
            "User not found"
        );
    }

    const valid =
        await bcrypt.compare(
            currentPassword,
            user.passwordHash
        );

    if (!valid) {
        throw new ApiError(
            400,
            "Current password is incorrect"
        );
    }

    user.passwordHash =
        await bcrypt.hash(
            newPassword,
            SALT_ROUNDS
        );

    user.refreshTokenHash = null;

    await saveUser(user);
}

export async function getCurrentUser(userId) {
    const user =
        await findById(userId);

    if (!user) {
        throw new ApiError(
            404,
            "User not found"
        );
    }

    return sanitizeUser(user);
}

function sanitizeUser(user) {
    return {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isEmailVerified:
            user.isEmailVerified,
        isActive: user.isActive,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
    };
}