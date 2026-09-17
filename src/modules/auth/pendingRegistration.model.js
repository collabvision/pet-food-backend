import mongoose from "mongoose";

const pendingRegistrationSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
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
            required: true
        },

        verificationCodeHash: {
            type: String,
            required: true
        },

        verificationCodeExpires: {
            type: Date,
            required: true
        }
    },
    {
        timestamps: true
    }
);

pendingRegistrationSchema.index(
    { verificationCodeExpires: 1 },
    { expireAfterSeconds: 0 }
);

export const PendingRegistration =
    mongoose.model(
        "PendingRegistration",
        pendingRegistrationSchema
    );