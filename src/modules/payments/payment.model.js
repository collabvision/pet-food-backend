// src/modules/payments/payment.model.js

import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
    {
        orderId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Order",
            required: true,
            unique: true,
            index: true
        },

        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true
        },

        provider: {
            type: String,
            enum: ["razorpay"],
            default: "razorpay",
            required: true
        },

        razorpayOrderId: {
            type: String,
            required: true,
            unique: true,
            index: true
        },

        razorpayPaymentId: {
            type: String,
            default: null,
            index: true
        },

        amount: {
            type: Number,
            required: true,
            min: 0
        },

        currency: {
            type: String,
            default: "INR",
            uppercase: true
        },

        status: {
            type: String,
            enum: [
                "CREATED",
                "AUTHORIZED",
                "CAPTURED",
                "FAILED",
                "REFUNDED"
            ],
            default: "CREATED",
            index: true
        },

        signatureVerified: {
            type: Boolean,
            default: false
        },

        failureReason: {
            type: String,
            default: null
        },

        paidAt: {
            type: Date,
            default: null
        }
    },
    {
        timestamps: true
    }
);

paymentSchema.index({
    userId: 1,
    createdAt: -1
});

export const Payment = mongoose.model(
    "Payment",
    paymentSchema
);