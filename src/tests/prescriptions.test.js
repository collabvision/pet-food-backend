import test from "node:test";
import assert from "node:assert/strict";

test("Prescriptions module - all cases", async () => {
    const validationModule = await import(
        "../modules/prescriptions/prescriptions.validation.js"
    );

    const routeModule = await import(
        "../modules/prescriptions/prescriptions.routes.js"
    );

    const serviceModule = await import(
        "../modules/prescriptions/prescriptions.service.js"
    );

    const {
        createPrescriptionSchema,
        reviewPrescriptionSchema
    } = validationModule;

    const { default: router } = routeModule;

    const {
        uploadPrescription,
        getMyPrescriptions,
        getPrescriptionById,
        getAllPrescriptions,
        reviewPrescription
    } = serviceModule;

    const productId =
        "507f1f77bcf86cd799439011";

    const orderId =
        "507f1f77bcf86cd799439012";

    assert.equal(
        createPrescriptionSchema.safeParse({
            productId
        }).success,
        true
    );

    assert.equal(
        createPrescriptionSchema.safeParse({
            productId,
            orderId
        }).success,
        true
    );

    assert.equal(
        createPrescriptionSchema.safeParse({
            productId: "invalid"
        }).success,
        false
    );

    assert.equal(
        createPrescriptionSchema.safeParse({
            productId,
            orderId: "invalid"
        }).success,
        false
    );

    assert.equal(
        reviewPrescriptionSchema.safeParse({
            status: "APPROVED"
        }).success,
        true
    );

    assert.equal(
        reviewPrescriptionSchema.safeParse({
            status: "REJECTED",
            adminNote: "Prescription is not valid"
        }).success,
        true
    );

    assert.equal(
        reviewPrescriptionSchema.safeParse({
            status: "PENDING"
        }).success,
        false
    );

    assert.equal(
        typeof uploadPrescription,
        "function"
    );

    assert.equal(
        typeof getMyPrescriptions,
        "function"
    );

    assert.equal(
        typeof getPrescriptionById,
        "function"
    );

    assert.equal(
        typeof getAllPrescriptions,
        "function"
    );

    assert.equal(
        typeof reviewPrescription,
        "function"
    );

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
                route.path === "/upload"
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
                route.path === "/admin/all"
        )
    );

    assert.ok(
        routeList.some(
            (route) =>
                route.methods.patch &&
                route.path ===
                    "/admin/:prescriptionId/review"
        )
    );

    assert.ok(
        routeList.some(
            (route) =>
                route.methods.get &&
                route.path ===
                    "/:prescriptionId"
        )
    );
});