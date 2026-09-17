// src/modules/cart/cart.controller.js

import {
    getCart,
    addToCart,
    updateCartItem,
    removeCartItem,
    clearCart
} from "./cart.service.js";

export async function getCartController(req, res) {
    const cart = await getCart(req.user.id);

    res.status(200).json({
        success: true,
        data: cart
    });
}

export async function addToCartController(req, res) {
    const cart = await addToCart(
        req.user.id,
        req.body.productId,
        req.body.quantity
    );

    res.status(200).json({
        success: true,
        message: "Product added to cart",
        data: cart
    });
}

export async function updateCartItemController(req, res) {
    const cart = await updateCartItem(
        req.user.id,
        req.params.productId,
        req.body.quantity
    );

    res.status(200).json({
        success: true,
        message: "Cart item updated",
        data: cart
    });
}

export async function removeCartItemController(req, res) {
    const cart = await removeCartItem(
        req.user.id,
        req.params.productId
    );

    res.status(200).json({
        success: true,
        message: "Product removed from cart",
        data: cart
    });
}

export async function clearCartController(req, res) {
    const cart = await clearCart(req.user.id);

    res.status(200).json({
        success: true,
        message: "Cart cleared",
        data: cart
    });
}