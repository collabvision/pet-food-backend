import crypto from "crypto";
import jwt from "jsonwebtoken";
import { env } from "../../config/env.js";

export function generateAccessToken(user) {
    return jwt.sign(
        {
            userId: user._id.toString(),
            role: user.role
        },
        env.jwt.accessSecret,
        {
            expiresIn: env.jwt.accessExpires
        }
    );
}

export function generateRefreshToken(user) {
    return jwt.sign(
        {
            userId: user._id.toString(),
            role: user.role
        },
        env.jwt.refreshSecret,
        {
            expiresIn: env.jwt.refreshExpires
        }
    );
}

export function verifyAccessToken(token) {
    return jwt.verify(token, env.jwt.accessSecret);
}

export function verifyRefreshToken(token) {
    return jwt.verify(token, env.jwt.refreshSecret);
}

export function generateRandomToken() {
    return crypto.randomBytes(32).toString("hex");
}

export function generateVerificationCode() {
    return crypto
        .randomInt(100000, 1000000)
        .toString();
}

export function hashToken(token) {
    return crypto
        .createHash("sha256")
        .update(token)
        .digest("hex");
}