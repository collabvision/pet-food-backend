// src/modules/payments/payments.controller.js

import {
    createPaymentOrder,
    verifyPayment,
    getPayment,
    getOrderPayment,
    getUserPayments
} from "./payments.service.js";

export async function createPaymentOrderController(
    req,
    res
) {
    const result = await createPaymentOrder(
        req.user.id,
        req.body.orderId
    );

    res.status(201).json({
        success: true,
        message: "Payment order created",
        data: result
    });
}

export async function verifyPaymentController(
    req,
    res
) {
    const result = await verifyPayment(
        req.user.id,
        req.body.razorpayOrderId,
        req.body.razorpayPaymentId,
        req.body.razorpaySignature
    );

    res.status(200).json({
        success: true,
        message: "Payment verified successfully",
        data: result
    });
}

export async function getPaymentController(
    req,
    res
) {
    const payment = await getPayment(
        req.user.id,
        req.params.paymentId
    );

    res.status(200).json({
        success: true,
        data: payment
    });
}

export async function getOrderPaymentController(
    req,
    res
) {
    const payment = await getOrderPayment(
        req.user.id,
        req.params.orderId
    );

    res.status(200).json({
        success: true,
        data: payment
    });
}

export async function getUserPaymentsController(
    req,
    res
) {
    const payments = await getUserPayments(
        req.user.id
    );

    res.status(200).json({
        success: true,
        data: payments
    });
}