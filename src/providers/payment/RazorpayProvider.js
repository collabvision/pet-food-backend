// src/providers/payment/RazorpayProvider.js

import crypto from "crypto";
import Razorpay from "razorpay";

import { PaymentProvider } from "./PaymentProvider.js";
import { env } from "../../config/env.js";

export class RazorpayProvider extends PaymentProvider {
    constructor() {
        super();

        if (!env.razorpay.keyId) {
            throw new Error("RAZORPAY_KEY_ID is missing");
        }

        if (!env.razorpay.keySecret) {
            throw new Error("RAZORPAY_KEY_SECRET is missing");
        }

        this.client = new Razorpay({
            key_id: env.razorpay.keyId,
            key_secret: env.razorpay.keySecret
        });
    }

    async createOrder({
        amount,
        currency = "INR",
        receipt,
        notes = {}
    }) {
        return this.client.orders.create({
            amount,
            currency,
            receipt,
            notes
        });
    }

    async refundPayment(paymentId, amount, notes = {}) {
        const payload = {};
        if (amount) {
            payload.amount = Math.round(Number(amount) * 100);
        }
        if (Object.keys(notes).length > 0) {
            payload.notes = notes;
        }
        return this.client.payments.refund(paymentId, payload);
    }

    verifyPaymentSignature({
        orderId,
        paymentId,
        signature
    }) {
        const generatedSignature = crypto
            .createHmac(
                "sha256",
                env.razorpay.keySecret
            )
            .update(`${orderId}|${paymentId}`)
            .digest("hex");

        return crypto.timingSafeEqual(
            Buffer.from(generatedSignature),
            Buffer.from(signature)
        );
    }

    verifyWebhookSignature({
        payload,
        signature
    }) {
        if (!env.razorpay.webhookSecret) {
            throw new Error(
                "RAZORPAY_WEBHOOK_SECRET is missing"
            );
        }

        const generatedSignature = crypto
            .createHmac(
                "sha256",
                env.razorpay.webhookSecret
            )
            .update(payload)
            .digest("hex");

        return crypto.timingSafeEqual(
            Buffer.from(generatedSignature),
            Buffer.from(signature)
        );
    }
}