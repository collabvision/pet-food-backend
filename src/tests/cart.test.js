import test from "node:test";
import assert from "node:assert/strict";

test("Cart module - all cases", async () => {
    const validationModule = await import(
        "../modules/cart/cart.validation.js"
    );

    const routeModule = await import(
        "../modules/cart/cart.routes.js"
    );

    const serviceModule = await import(
        "../modules/cart/cart.service.js"
    );

    const {
        addToCartSchema,
        updateCartItemSchema
    } = validationModule;

    const { default: router } = routeModule;

    const {
        getCart,
        addToCart,
        updateCartItem,
        removeCartItem,
        clearCart
    } = serviceModule;

    const validProductId = "507f1f77bcf86cd799439011";

    // =========================
    // ADD TO CART VALIDATION
    // =========================

    assert.equal(
        addToCartSchema.safeParse({
            productId: validProductId,
            quantity: 1
        }).success,
        true
    );

    assert.equal(
        addToCartSchema.safeParse({
            productId: validProductId,
            quantity: 100
        }).success,
        true
    );

    assert.equal(
        addToCartSchema.safeParse({
            productId: "invalid-id",
            quantity: 1
        }).success,
        false
    );

    assert.equal(
        addToCartSchema.safeParse({
            productId: validProductId,
            quantity: 0
        }).success,
        false
    );

    assert.equal(
        addToCartSchema.safeParse({
            productId: validProductId,
            quantity: 101
        }).success,
        false
    );

    assert.equal(
        addToCartSchema.safeParse({
            productId: validProductId,
            quantity: 1.5
        }).success,
        false
    );

    assert.equal(
        addToCartSchema.safeParse({
            productId: validProductId,
            quantity: "2"
        }).success,
        false
    );

    // =========================
    // UPDATE CART VALIDATION
    // =========================

    assert.equal(
        updateCartItemSchema.safeParse({
            quantity: 1
        }).success,
        true
    );

    assert.equal(
        updateCartItemSchema.safeParse({
            quantity: 100
        }).success,
        true
    );

    assert.equal(
        updateCartItemSchema.safeParse({
            quantity: 0
        }).success,
        false
    );

    assert.equal(
        updateCartItemSchema.safeParse({
            quantity: 101
        }).success,
        false
    );

    assert.equal(
        updateCartItemSchema.safeParse({
            quantity: 1.5
        }).success,
        false
    );

    assert.equal(
        updateCartItemSchema.safeParse({
            quantity: "5"
        }).success,
        false
    );

    // =========================
    // SERVICE FUNCTIONS
    // =========================

    assert.equal(typeof getCart, "function");
    assert.equal(typeof addToCart, "function");
    assert.equal(typeof updateCartItem, "function");
    assert.equal(typeof removeCartItem, "function");
    assert.equal(typeof clearCart, "function");

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

    // GET /
    assert.ok(
        routeList.some(
            (route) =>
                route.methods.get &&
                route.path === "/"
        )
    );

    // POST /items
    assert.ok(
        routeList.some(
            (route) =>
                route.methods.post &&
                route.path === "/items"
        )
    );

    // PATCH /items/:productId
    assert.ok(
        routeList.some(
            (route) =>
                route.methods.patch &&
                route.path === "/items/:productId"
        )
    );

    // DELETE /items/:productId
    assert.ok(
        routeList.some(
            (route) =>
                route.methods.delete &&
                route.path === "/items/:productId"
        )
    );

    // DELETE /
    assert.ok(
        routeList.some(
            (route) =>
                route.methods.delete &&
                route.path === "/"
        )
    );
});