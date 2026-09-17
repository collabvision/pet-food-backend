import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true
        },

        orderId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Order",
            default: null,
            index: true
        },

        channel: {
            type: String,
            enum: ["EMAIL", "WHATSAPP"],
            required: true
        },

        type: {
            type: String,
            enum: [
                "ORDER_STATUS",
                "PAYMENT_STATUS",
                "RETURN_STATUS",
                "REFUND_STATUS"
            ],
            required: true
        },

        status: {
            type: String,
            enum: [
                "PENDING",
                "SENT",
                "FAILED"
            ],
            default: "PENDING"
        },

        recipient: {
            type: String,
            required: true,
            trim: true
        },

        subject: {
            type: String,
            default: null,
            trim: true
        },

        message: {
            type: String,
            required: true
        },

        provider: {
            type: String,
            default: "console"
        },

        errorMessage: {
            type: String,
            default: null
        },

        sentAt: {
            type: Date,
            default: null
        }
    },
    {
        timestamps: true
    }
);

export const Notification =
    mongoose.model(
        "Notification",
        notificationSchema
    );