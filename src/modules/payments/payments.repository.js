// src/modules/payments/payments.repository.js

import { Payment } from "./payment.model.js";

export async function createPayment(data) {
    return Payment.create(data);
}

export async function findById(paymentId) {
    return Payment.findById(paymentId)
        .populate("orderId")
        .populate("userId", "name email");
}

export async function findByOrderId(orderId) {
    return Payment.findOne({ orderId });
}

export async function findByRazorpayOrderId(
    razorpayOrderId
) {
    return Payment.findOne({
        razorpayOrderId
    });
}

export async function updatePayment(
    paymentId,
    data
) {
    return Payment.findByIdAndUpdate(
        paymentId,
        data,
        {
            new: true,
            runValidators: true
        }
    );
}

export async function findUserPayments(userId) {
    return Payment.find({ userId })
        .sort({ createdAt: -1 })
        .populate("orderId");
}