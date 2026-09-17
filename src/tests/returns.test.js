import test from "node:test";
import assert from "node:assert/strict";

test("Returns module - all cases", async () => {
    const validationModule = await import(
        "../modules/returns/returns.validation.js"
    );

    const routeModule = await import(
        "../modules/returns/returns.routes.js"
    );

    const serviceModule = await import(
        "../modules/returns/returns.service.js"
    );

    const {
        createReturnSchema,
        updateReturnStatusSchema
    } = validationModule;

    const { default: router } = routeModule;

    const {
        requestReturn,
        getMyReturns,
        getReturnById,
        getReturnByNumber,
        getAllReturns,
        updateReturnStatus
    } = serviceModule;

    const validOrderId =
        "507f1f77bcf86cd799439011";

    const validProductId =
        "507f1f77bcf86cd799439012";

    const validData = {
        orderId: validOrderId,
        items: [
            {
                productId: validProductId,
                quantity: 1,
                reason: "Product arrived defective"
            }
        ],
        reason: "DEFECTIVE_PRODUCT",
        description: "The product does not work after delivery"
    };

    assert.equal(
        createReturnSchema.safeParse(validData).success,
        true
    );

    assert.equal(
        createReturnSchema.safeParse({
            ...validData,
            orderId: "invalid"
        }).success,
        false
    );

    assert.equal(
        createReturnSchema.safeParse({
            ...validData,
            reason: "WRONG_REASON"
        }).success,
        false
    );

    assert.equal(
        createReturnSchema.safeParse({
            ...validData,
            items: []
        }).success,
        false
    );

    assert.equal(
        createReturnSchema.safeParse({
            ...validData,
            items: [
                {
                    productId: validProductId,
                    quantity: 0,
                    reason: "Defective"
                }
            ]
        }).success,
        false
    );

    assert.equal(
        updateReturnStatusSchema.safeParse({
            status: "APPROVED"
        }).success,
        true
    );

    assert.equal(
        updateReturnStatusSchema.safeParse({
            status: "REJECTED",
            adminNote: "Defect confirmed"
        }).success,
        true
    );

    assert.equal(
        updateReturnStatusSchema.safeParse({
            status: "INVALID"
        }).success,
        false
    );

    assert.equal(
        updateReturnStatusSchema.safeParse({
            status: "REFUNDED",
            refundAmount: -100
        }).success,
        false
    );

    assert.equal(typeof requestReturn, "function");
    assert.equal(typeof getMyReturns, "function");
    assert.equal(typeof getReturnById, "function");
    assert.equal(typeof getReturnByNumber, "function");
    assert.equal(typeof getAllReturns, "function");
    assert.equal(typeof updateReturnStatus, "function");

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
                route.path === "/number/:returnNumber"
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
                route.path === "/admin/:returnId/status"
        )
    );

    assert.ok(
        routeList.some(
            (route) =>
                route.methods.get &&
                route.path === "/:returnId"
        )
    );
});