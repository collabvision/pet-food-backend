// src/providers/payment/index.js

import { RazorpayProvider } from "./RazorpayProvider.js";

let paymentProvider;

switch (process.env.PAYMENT_PROVIDER || "razorpay") {
    case "razorpay":
        paymentProvider = new RazorpayProvider();
        break;

    default:
        throw new Error(
            "Invalid PAYMENT_PROVIDER. Use razorpay."
        );
}

export { paymentProvider };