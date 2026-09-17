import mongoose from "mongoose";

const returnItemSchema = new mongoose.Schema(
    {
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
            required: true
        },
        quantity: {
            type: Number,
            required: true,
            min: 1
        },
        reason: {
            type: String,
            required: true,
            trim: true,
            maxlength: 1000
        }
    },
    { _id: false }
);

const returnSchema = new mongoose.Schema(
    {
        returnNumber: {
            type: String,
            required: true,
            unique: true,
            index: true
        },

        orderId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Order",
            required: true,
            index: true
        },

        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true
        },

        items: {
            type: [returnItemSchema],
            required: true,
            validate: {
                validator: (items) => items.length > 0,
                message: "At least one return item is required"
            }
        },

        reason: {
            type: String,
            required: true,
            enum: ["DEFECTIVE_PRODUCT"]
        },

        description: {
            type: String,
            required: true,
            trim: true,
            maxlength: 2000
        },

        status: {
            type: String,
            enum: [
                "REQUESTED",
                "APPROVED",
                "REJECTED",
                "PICKUP_PENDING",
                "PICKED_UP",
                "REFUNDED",
                "CANCELLED"
            ],
            default: "REQUESTED",
            index: true
        },

        adminNote: {
            type: String,
            default: null,
            trim: true,
            maxlength: 2000
        },

        refundAmount: {
            type: Number,
            default: 0,
            min: 0
        },

        refundPaymentId: {
            type: String,
            default: null,
            trim: true
        },

        statusHistory: [
            {
                status: {
                    type: String,
                    required: true
                },
                note: {
                    type: String,
                    default: null
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
            }
        ]
    },
    {
        timestamps: true
    }
);

export const Return = mongoose.model("Return", returnSchema);