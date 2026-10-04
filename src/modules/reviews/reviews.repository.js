// src/modules/reviews/reviews.repository.js

import { Review } from "./review.model.js";

export function createReview(data) {
    return Review.create(data);
}

export function findReviewByUserProductOrder(userId, productId, orderId) {
    return Review.findOne({ userId, productId, orderId });
}

export function findReviewsByProduct(productId) {
    return Review.find({ productId })
        .populate("userId", "name")
        .sort({ createdAt: -1 });
}

export function findReviewsByUser(userId) {
    return Review.find({ userId })
        .populate("productId", "name images")
        .sort({ createdAt: -1 });
}

export function findReviewById(reviewId) {
    return Review.findById(reviewId).populate("userId", "name");
}

export async function getProductRatingStats(productId) {
    const result = await Review.aggregate([
        { $match: { productId: new (await import("mongoose")).default.Types.ObjectId(productId) } },
        {
            $group: {
                _id: "$productId",
                averageRating: { $avg: "$rating" },
                reviewCount: { $sum: 1 },
                ratingDistribution: {
                    $push: "$rating"
                }
            }
        }
    ]);
    return result[0] || { averageRating: 0, reviewCount: 0 };
}
