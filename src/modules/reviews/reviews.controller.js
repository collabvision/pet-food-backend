// src/modules/reviews/reviews.controller.js

import {
    createReviewService,
    getProductReviewsService,
    getMyReviewsService,
    checkCanReviewService
} from "./reviews.service.js";

export async function createReviewController(req, res) {
    const { productId, orderId, rating, title, body } = req.body;

    const review = await createReviewService(req.user.id, {
        productId,
        orderId,
        rating,
        title,
        body
    });

    res.status(201).json({
        success: true,
        message: "Review submitted successfully",
        data: review
    });
}

export async function getProductReviewsController(req, res) {
    const result = await getProductReviewsService(req.params.productId);

    res.status(200).json({
        success: true,
        data: result
    });
}

export async function getMyReviewsController(req, res) {
    const reviews = await getMyReviewsService(req.user.id);

    res.status(200).json({
        success: true,
        data: reviews
    });
}

export async function checkCanReviewController(req, res) {
    const { productId, orderId } = req.params;
    const result = await checkCanReviewService(req.user.id, productId, orderId);

    res.status(200).json({
        success: true,
        data: result
    });
}
