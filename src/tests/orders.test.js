// src/tests/orders.test.js

import test from "node:test";
import assert from "node:assert/strict";

test("Orders module - all cases", async () => {
    const validationModule = await import(
        "../modules/orders/orders.validation.js"
    );

    const routeModule = await import(
        "../modules/orders/orders.routes.js"
    );

    const serviceModule = await import(
        "../modules/orders/orders.service.js"
    );

    const {
        createOrderSchema,
        updateOrderStatusSchema
    } = validationModule;

    const { default: router } = routeModule;

    const {
        createUserOrder,
        getUserOrder,
        getUserOrders,
        getOrderByNumber,
        getAdminOrders,
        updateOrderStatus,
        cancelUserOrder
    } = serviceModule;

    // =========================
    // CREATE ORDER VALIDATION
    // =========================

    const validOrder = {
        shippingAddress: {
            name: "Test User",
            phone: "9876543210",
            addressLine1: "123 Main Street",
            addressLine2: "",
            city: "Kolhapur",
            state: "Maharashtra",
            pincode: "416001",
            country: "India"
        },
        shippingCharge: 50,
        discount: 10
    };

    assert.equal(
        createOrderSchema.safeParse(validOrder).success,
        true
    );

    assert.equal(
        createOrderSchema.safeParse({
            ...validOrder,
            shippingAddress: {
                ...validOrder.shippingAddress,
                phone: "12345"
            }
        }).success,
        false
    );

    assert.equal(
        createOrderSchema.safeParse({
            ...validOrder,
            shippingAddress: {
                ...validOrder.shippingAddress,
                pincode: "123"
            }
        }).success,
        false
    );

    assert.equal(
        createOrderSchema.safeParse({
            ...validOrder,
            shippingCharge: -10
        }).success,
        false
    );

    assert.equal(
        createOrderSchema.safeParse({
            ...validOrder,
            discount: -10
        }).success,
        false
    );

    // =========================
    // STATUS VALIDATION
    // =========================

    const validStatuses = [
        "PENDING",
        "CONFIRMED",
        "PROCESSING",
        "SHIPPED",
        "DELIVERED",
        "CANCELLED",
        "RETURN_REQUESTED",
        "RETURNED"
    ];

    for (const status of validStatuses) {
        assert.equal(
            updateOrderStatusSchema.safeParse({
                status
            }).success,
            true
        );
    }

    assert.equal(
        updateOrderStatusSchema.safeParse({
            status: "INVALID_STATUS"
        }).success,
        false
    );

    assert.equal(
        updateOrderStatusSchema.safeParse({
            status: "SHIPPED",
            note: "Package shipped"
        }).success,
        true
    );

    // =========================
    // SERVICE FUNCTIONS
    // =========================

    assert.equal(
        typeof createUserOrder,
        "function"
    );

    assert.equal(
        typeof getUserOrder,
        "function"
    );

    assert.equal(
        typeof getUserOrders,
        "function"
    );

    assert.equal(
        typeof getOrderByNumber,
        "function"
    );

    assert.equal(
        typeof getAdminOrders,
        "function"
    );

    assert.equal(
        typeof updateOrderStatus,
        "function"
    );

    assert.equal(
        typeof cancelUserOrder,
        "function"
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
                route.path === "/"
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
                route.path === "/number/:orderNumber"
        )
    );

    assert.ok(
        routeList.some(
            (route) =>
                route.methods.get &&
                route.path === "/:orderId"
        )
    );

    assert.ok(
        routeList.some(
            (route) =>
                route.methods.patch &&
                route.path === "/:orderId/cancel"
        )
    );

    assert.ok(
        routeList.some(
            (route) =>
                route.methods.get &&
                route.path === "/admin/all"
        )
    );

    assert.ok(
        routeList.some(
            (route) =>
                route.methods.patch &&
                route.path === "/admin/:orderId/status"
        )
    );
});