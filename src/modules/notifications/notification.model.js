import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        type: {
            type: String,
            required: true
        },
        channel: {
            type: String,
            enum: ["email", "whatsapp"],
            required: true
        },
        recipient: {
            type: String,
            required: true
        },
        subject: {
            type: String
        },
        message: {
            type: String,
            required: true
        },
        status: {
            type: String,
            enum: ["PENDING", "SENT", "FAILED"],
            default: "PENDING"
        },
        referenceType: {
            type: String
        },
        referenceId: {
            type: String
        },
        sentAt: {
            type: Date
        },
        failureReason: {
            type: String
        }
    },
    {
        timestamps: true
    }
);

export const Notification = mongoose.model(
    "Notification",
    notificationSchema
);
