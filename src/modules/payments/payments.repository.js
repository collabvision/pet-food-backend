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

export async function findByRazorpayOrderId(razorpayOrderId) {
  return Payment.findOne({
    razorpayOrderId,
  });
}

export async function updatePayment(paymentId, data) {
  return Payment.findByIdAndUpdate(paymentId, data, {
    returnDocument: "after",
    runValidators: true,
  });
}

export async function findUserPayments(userId) {
  return Payment.find({ userId }).sort({ createdAt: -1 }).populate("orderId");
}

export async function findAllPayments({ page = 1, limit = 20, search = "" } = {}) {
    const query = {};
    if (search) {
        query.$or = [
            { razorpayOrderId: { $regex: search, $options: "i" } },
            { razorpayPaymentId: { $regex: search, $options: "i" } }
        ];
    }
    const skip = (page - 1) * limit;
    const [payments, total] = await Promise.all([
        Payment.find(query)
            .populate("orderId", "orderNumber totalAmount")
            .populate("userId", "name email")
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .lean(),
        Payment.countDocuments(query),
    ]);
    return { payments, total, page, limit };
}
