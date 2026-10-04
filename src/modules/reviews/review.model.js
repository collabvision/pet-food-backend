// src/modules/reviews/review.model.js

import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true
        },
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
            required: true,
            index: true
        },
        orderId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Order",
            required: true
        },
        rating: {
            type: Number,
            required: true,
            min: 1,
            max: 5
        },
        title: {
            type: String,
            trim: true,
            maxlength: 150,
            default: ""
        },
        body: {
            type: String,
            trim: true,
            maxlength: 1000,
            default: ""
        },
        isVerifiedPurchase: {
            type: Boolean,
            default: true
        }
    },
    {
        timestamps: true
    }
);

// One review per user per product per order
reviewSchema.index({ userId: 1, productId: 1, orderId: 1 }, { unique: true });

export const Review = mongoose.model("Review", reviewSchema);
