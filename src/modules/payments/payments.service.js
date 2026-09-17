// src/modules/payments/payments.service.js

import { ApiError } from "../../utils/ApiError.js";

import {
    createPayment,
    findById,
    findByOrderId,
    findByRazorpayOrderId,
    updatePayment,
    findUserPayments
} from "./payments.repository.js";

import { paymentProvider } from "../../providers/payment/index.js";

import {
    findById as findOrderById,
    saveOrder
} from "../orders/orders.repository.js";

export async function createPaymentOrder(
    userId,
    orderId
) {
    const order = await findOrderById(orderId);

    if (!order) {
        throw new ApiError(404, "Order not found");
    }

    if (order.userId.toString() !== userId) {
        throw new ApiError(403, "Access denied");
    }

    if (order.paymentStatus === "PAID") {
        throw new ApiError(
            400,
            "Order is already paid"
        );
    }

    if (order.orderStatus === "CANCELLED") {
        throw new ApiError(
            400,
            "Cancelled order cannot be paid"
        );
    }

    const existingPayment =
        await findByOrderId(orderId);

    if (
        existingPayment &&
        existingPayment.status === "CREATED"
    ) {
        return {
            payment: existingPayment,
            razorpayOrderId:
                existingPayment.razorpayOrderId,
            keyId: process.env.RAZORPAY_KEY_ID,
            amount: existingPayment.amount,
            currency: existingPayment.currency
        };
    }

    const amount = Math.round(
        Number(order.totalAmount) * 100
    );

    if (!Number.isInteger(amount) || amount <= 0) {
        throw new ApiError(
            400,
            "Invalid order amount"
        );
    }

    const razorpayOrder =
        await paymentProvider.createOrder({
            amount,
            currency: "INR",
            receipt: order.orderNumber,
            notes: {
                orderId: order._id.toString(),
                userId
            }
        });

    const payment = await createPayment({
        orderId: order._id,
        userId,
        provider: "razorpay",
        razorpayOrderId: razorpayOrder.id,
        amount,
        currency: "INR",
        status: "CREATED"
    });

    return {
        payment,
        razorpayOrderId: razorpayOrder.id,
        keyId: process.env.RAZORPAY_KEY_ID,
        amount,
        currency: "INR"
    };
}

export async function verifyPayment(
    userId,
    razorpayOrderId,
    razorpayPaymentId,
    razorpaySignature
) {
    const payment =
        await findByRazorpayOrderId(
            razorpayOrderId
        );

    if (!payment) {
        throw new ApiError(
            404,
            "Payment record not found"
        );
    }

    if (payment.userId.toString() !== userId) {
        throw new ApiError(403, "Access denied");
    }

    const order = await findOrderById(
        payment.orderId
    );

    if (!order) {
        throw new ApiError(
            404,
            "Order not found"
        );
    }

    if (
        payment.razorpayOrderId !==
        razorpayOrderId
    ) {
        throw new ApiError(
            400,
            "Razorpay order mismatch"
        );
    }

    const isValid =
        paymentProvider.verifyPaymentSignature({
            orderId: razorpayOrderId,
            paymentId: razorpayPaymentId,
            signature: razorpaySignature
        });

    if (!isValid) {
        throw new ApiError(
            400,
            "Invalid payment signature"
        );
    }

    await updatePayment(payment._id, {
        razorpayPaymentId,
        signatureVerified: true,
        status: "AUTHORIZED"
    });

    order.paymentId = payment._id;
    order.paymentStatus = "AUTHORIZED";

    await saveOrder(order);

    return {
        verified: true,
        paymentId: payment._id,
        razorpayPaymentId,
        razorpayOrderId
    };
}

export async function getPayment(
    userId,
    paymentId
) {
    const payment = await findById(paymentId);

    if (!payment) {
        throw new ApiError(
            404,
            "Payment not found"
        );
    }

    if (payment.userId._id.toString() !== userId) {
        throw new ApiError(403, "Access denied");
    }

    return payment;
}

export async function getOrderPayment(
    userId,
    orderId
) {
    const order = await findOrderById(orderId);

    if (!order) {
        throw new ApiError(404, "Order not found");
    }

    if (order.userId.toString() !== userId) {
        throw new ApiError(403, "Access denied");
    }

    const payment =
        await findByOrderId(orderId);

    if (!payment) {
        throw new ApiError(
            404,
            "Payment not found"
        );
    }

    return payment;
}

export async function getUserPayments(userId) {
    return findUserPayments(userId);
}