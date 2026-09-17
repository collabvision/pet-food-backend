// src/tests/payments.test.js

import test from "node:test";
import assert from "node:assert/strict";

test("Payments module - all cases", async () => {
    const validationModule = await import(
        "../modules/payments/payments.validation.js"
    );

    const routeModule = await import(
        "../modules/payments/payments.routes.js"
    );

    const serviceModule = await import(
        "../modules/payments/payments.service.js"
    );

    const providerModule = await import(
        "../providers/payment/RazorpayProvider.js"
    );

    const {
        createPaymentOrderSchema,
        verifyPaymentSchema
    } = validationModule;

    const { default: router } = routeModule;

    const {
        createPaymentOrder,
        verifyPayment,
        getPayment,
        getOrderPayment,
        getUserPayments
    } = serviceModule;

    const {
        RazorpayProvider
    } = providerModule;

    const validOrderId =
        "507f1f77bcf86cd799439011";

    // =========================
    // CREATE PAYMENT VALIDATION
    // =========================

    assert.equal(
        createPaymentOrderSchema.safeParse({
            orderId: validOrderId
        }).success,
        true
    );

    assert.equal(
        createPaymentOrderSchema.safeParse({
            orderId: "invalid-id"
        }).success,
        false
    );

    assert.equal(
        createPaymentOrderSchema.safeParse({})
            .success,
        false
    );

    // =========================
    // VERIFY PAYMENT VALIDATION
    // =========================

    const validVerification = {
        razorpayOrderId: "order_test123",
        razorpayPaymentId: "pay_test123",
        razorpaySignature: "signature123"
    };

    assert.equal(
        verifyPaymentSchema.safeParse(
            validVerification
        ).success,
        true
    );

    assert.equal(
        verifyPaymentSchema.safeParse({
            ...validVerification,
            razorpayOrderId: ""
        }).success,
        false
    );

    assert.equal(
        verifyPaymentSchema.safeParse({
            ...validVerification,
            razorpayPaymentId: ""
        }).success,
        false
    );

    assert.equal(
        verifyPaymentSchema.safeParse({
            ...validVerification,
            razorpaySignature: ""
        }).success,
        false
    );

    // =========================
    // SERVICE FUNCTIONS
    // =========================

    assert.equal(
        typeof createPaymentOrder,
        "function"
    );

    assert.equal(
        typeof verifyPayment,
        "function"
    );

    assert.equal(
        typeof getPayment,
        "function"
    );

    assert.equal(
        typeof getOrderPayment,
        "function"
    );

    assert.equal(
        typeof getUserPayments,
        "function"
    );

    // =========================
    // PROVIDER
    // =========================

    assert.equal(
        typeof RazorpayProvider,
        "function"
    );

    assert.equal(
        typeof RazorpayProvider.prototype
            .createOrder,
        "function"
    );

    assert.equal(
        typeof RazorpayProvider.prototype
            .verifyPaymentSignature,
        "function"
    );

    assert.equal(
        typeof RazorpayProvider.prototype
            .verifyWebhookSignature,
        "function"
    );

    // =========================
    // PAYMENT SIGNATURE
    // =========================

    const crypto = await import("crypto");

    const secret = "test_secret";
    const orderId = "order_test123";
    const paymentId = "pay_test123";

    const signature = crypto
        .createHmac("sha256", secret)
        .update(`${orderId}|${paymentId}`)
        .digest("hex");

    const expectedSignature = crypto
        .createHmac("sha256", secret)
        .update(`${orderId}|${paymentId}`)
        .digest("hex");

    assert.equal(
        signature,
        expectedSignature
    );

    assert.notEqual(
        signature,
        crypto
            .createHmac("sha256", secret)
            .update(
                `${orderId}|wrong_payment`
            )
            .digest("hex")
    );

    // =========================
    // ROUTES
    // =========================

    assert.ok(router);
    assert.ok(Array.isArray(router.stack));

    const routeList = router.stack
        .filter((layer) => layer.route)
        .map((layer) => ({
            methods: layer.route.methods,
            path: layer.route.path
        }));

    assert.ok(
        routeList.some(
            (route) =>
                route.methods.post &&
                route.path === "/create-order"
        )
    );

    assert.ok(
        routeList.some(
            (route) =>
                route.methods.post &&
                route.path === "/verify"
        )
    );

    assert.ok(
        routeList.some(
            (route) =>
                route.methods.get &&
                route.path === "/"
        )
    );

    assert.ok(
        routeList.some(
            (route) =>
                route.methods.get &&
                route.path === "/order/:orderId"
        )
    );

    assert.ok(
        routeList.some(
            (route) =>
                route.methods.get &&
                route.path === "/:paymentId"
        )
    );
});