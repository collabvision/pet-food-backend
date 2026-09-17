// src/modules/shipping/shipment.model.js

import mongoose from "mongoose";

const shipmentStatusHistorySchema = new mongoose.Schema(
    {
        status: {
            type: String,
            required: true
        },
        note: {
            type: String,
            default: ""
        },
        changedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null
        },
        changedAt: {
            type: Date,
            default: Date.now
        }
    },
    {
        _id: false
    }
);

const shipmentSchema = new mongoose.Schema(
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
            default: "manual",
            trim: true
        },

        trackingNumber: {
            type: String,
            default: null,
            index: true
        },

        status: {
            type: String,
            enum: [
                "PENDING",
                "READY_TO_SHIP",
                "SHIPPED",
                "IN_TRANSIT",
                "OUT_FOR_DELIVERY",
                "DELIVERED",
                "CANCELLED",
                "RETURNED"
            ],
            default: "PENDING",
            index: true
        },

        courierName: {
            type: String,
            default: null,
            trim: true
        },

        estimatedDeliveryDate: {
            type: Date,
            default: null
        },

        shippedAt: {
            type: Date,
            default: null
        },

        deliveredAt: {
            type: Date,
            default: null
        },

        statusHistory: {
            type: [shipmentStatusHistorySchema],
            default: []
        }
    },
    {
        timestamps: true
    }
);

shipmentSchema.index({
    userId: 1,
    createdAt: -1
});

export const Shipment = mongoose.model(
    "Shipment",
    shipmentSchema
);