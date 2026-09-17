// src/providers/payment/PaymentProvider.js

export class PaymentProvider {
    async createOrder() {
        throw new Error("createOrder() must be implemented");
    }

    verifyPaymentSignature() {
        throw new Error(
            "verifyPaymentSignature() must be implemented"
        );
    }

    verifyWebhookSignature() {
        throw new Error(
            "verifyWebhookSignature() must be implemented"
        );
    }
}