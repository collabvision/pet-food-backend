// src/tests/shipping.test.js

import test from "node:test";
import assert from "node:assert/strict";

test("Shipping module - all cases", async () => {
    const validationModule = await import(
        "../modules/shipping/shipping.validation.js"
    );

    const routeModule = await import(
        "../modules/shipping/shipping.routes.js"
    );

    const serviceModule = await import(
        "../modules/shipping/shipping.service.js"
    );

    const providerModule = await import(
        "../providers/shipping/ShippingProvider.js"
    );

    const {
        createShipmentSchema,
        updateShipmentStatusSchema
    } = validationModule;

    const { default: router } = routeModule;

    const {
        createOrderShipment,
        getUserShipment,
        getUserShipments,
        getShipmentByTrackingNumber,
        updateShipmentStatus,
        getAdminShipments
    } = serviceModule;

    const {
        ShippingProvider
    } = providerModule;

    const validOrderId =
        "507f1f77bcf86cd799439011";

    // =========================
    // CREATE SHIPMENT
    // =========================

    const validShipment = {
        orderId: validOrderId,
        provider: "manual",
        courierName: "Test Courier",
        trackingNumber: "TRACK12345",
        estimatedDeliveryDate:
            "2026-10-01T10:00:00.000Z"
    };

    assert.equal(
        createShipmentSchema.safeParse(
            validShipment
        ).success,
        true
    );

    assert.equal(
        createShipmentSchema.safeParse({
            ...validShipment,
            orderId: "invalid"
        }).success,
        false
    );

    assert.equal(
        createShipmentSchema.safeParse({
            ...validShipment,
            provider: ""
        }).success,
        false
    );

    assert.equal(
        createShipmentSchema.safeParse({
            ...validShipment,
            trackingNumber: "A"
        }).success,
        false
    );

    // =========================
    // STATUS VALIDATION
    // =========================

    const statuses = [
        "PENDING",
        "READY_TO_SHIP",
        "SHIPPED",
        "IN_TRANSIT",
        "OUT_FOR_DELIVERY",
        "DELIVERED",
        "CANCELLED",
        "RETURNED"
    ];

    for (const status of statuses) {
        assert.equal(
            updateShipmentStatusSchema.safeParse({
                status
            }).success,
            true
        );
    }

    assert.equal(
        updateShipmentStatusSchema.safeParse({
            status: "INVALID"
        }).success,
        false
    );

    // =========================
    // SERVICE FUNCTIONS
    // =========================

    assert.equal(
        typeof createOrderShipment,
        "function"
    );

    assert.equal(
        typeof getUserShipment,
        "function"
    );

    assert.equal(
        typeof getUserShipments,
        "function"
    );

    assert.equal(
        typeof getShipmentByTrackingNumber,
        "function"
    );

    assert.equal(
        typeof updateShipmentStatus,
        "function"
    );

    assert.equal(
        typeof getAdminShipments,
        "function"
    );

    // =========================
    // PROVIDER
    // =========================

    assert.equal(
        typeof ShippingProvider,
        "function"
    );

    assert.equal(
        typeof ShippingProvider.prototype
            .createShipment,
        "function"
    );

    assert.equal(
        typeof ShippingProvider.prototype
            .getShipmentStatus,
        "function"
    );

    assert.equal(
        typeof ShippingProvider.prototype
            .cancelShipment,
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
                route.methods.get &&
                route.path === "/"
        )
    );

    assert.ok(
        routeList.some(
            (route) =>
                route.methods.get &&
                route.path ===
                    "/tracking/:trackingNumber"
        )
    );

    assert.ok(
        routeList.some(
            (route) =>
                route.methods.get &&
                route.path ===
                    "/:shipmentId"
        )
    );

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
                route.methods.patch &&
                route.path ===
                    "/:shipmentId/status"
        )
    );

    assert.ok(
        routeList.some(
            (route) =>
                route.methods.get &&
                route.path === "/admin/all"
        )
    );
});


