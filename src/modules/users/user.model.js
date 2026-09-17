import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
            minlength: 2,
            maxlength: 100
        },

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            index: true
        },

        passwordHash: {
            type: String,
            required: true,
            select: false
        },

        role: {
            type: String,
            enum: ["USER", "ADMIN"],
            default: "USER"
        },

        isEmailVerified: {
            type: Boolean,
            default: false
        },

        emailVerificationTokenHash: {
            type: String,
            default: null,
            select: false
        },

        emailVerificationExpires: {
            type: Date,
            default: null,
            select: false
        },

        passwordResetTokenHash: {
            type: String,
            default: null,
            select: false
        },

        passwordResetExpires: {
            type: Date,
            default: null,
            select: false
        },

        refreshTokenHash: {
            type: String,
            default: null,
            select: false
        },

        isActive: {
            type: Boolean,
            default: true
        }
    },
    {
        timestamps: true
    }
);

// userSchema.index({ email: 1 }, { unique: true });

export const User = mongoose.model("User", userSchema);