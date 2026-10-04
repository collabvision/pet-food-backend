// src/modules/reviews/reviews.service.js

import { ApiError } from "../../utils/ApiError.js";
import {
    createReview,
    findReviewByUserProductOrder,
    findReviewsByProduct,
    findReviewsByUser,
    getProductRatingStats
} from "./reviews.repository.js";
import { Order } from "../orders/order.model.js";
import { Product } from "../products/product.model.js";
import mongoose from "mongoose";

export async function createReviewService(userId, { productId, orderId, rating, title, body }) {
    // Validate the order belongs to the user and is delivered
    const order = await Order.findOne({
        _id: orderId,
        userId,
        orderStatus: "DELIVERED"
    });

    if (!order) {
        throw new ApiError(403, "You can only review products from delivered orders");
    }

    // Check the product was part of this order
    const orderItem = order.items.find(i => i.productId.toString() === productId);
    if (!orderItem) {
        throw new ApiError(400, "This product was not part of the specified order");
    }

    // Check if already reviewed
    const existing = await findReviewByUserProductOrder(userId, productId, orderId);
    if (existing) {
        throw new ApiError(409, "You have already reviewed this product for this order");
    }

    const review = await createReview({
        userId,
        productId,
        orderId,
        rating,
        title: title || "",
        body: body || "",
        isVerifiedPurchase: true
    });

    // Update product's aggregated rating
    await updateProductRating(productId);

    return review;
}

export async function getProductReviewsService(productId) {
    const reviews = await findReviewsByProduct(productId);
    const stats = await getProductRatingStats(productId);
    return { reviews, stats };
}

export async function getMyReviewsService(userId) {
    return findReviewsByUser(userId);
}

export async function checkCanReviewService(userId, productId, orderId) {
    // Check if order is delivered and contains the product
    const order = await Order.findOne({
        _id: orderId,
        userId,
        orderStatus: "DELIVERED"
    });

    if (!order) return { canReview: false, reason: "Order not delivered" };

    const hasProduct = order.items.some(i => i.productId.toString() === productId);
    if (!hasProduct) return { canReview: false, reason: "Product not in order" };

    const existing = await findReviewByUserProductOrder(userId, productId, orderId);
    if (existing) return { canReview: false, reason: "Already reviewed", existing };

    return { canReview: true };
}

async function updateProductRating(productId) {
    const stats = await getProductRatingStats(productId);
    await Product.findByIdAndUpdate(productId, {
        rating: stats.averageRating ? Math.round(stats.averageRating * 10) / 10 : null,
        reviewCount: stats.reviewCount || 0
    });
}
