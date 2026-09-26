// src/modules/cart/cart.service.js

import { ApiError } from "../../utils/ApiError.js";
import {
    findOrCreateCart,
    saveCart,
    deleteCartByUserId
} from "./cart.repository.js";

import { Product } from "../products/product.model.js";

async function getProduct(productId) {
    const product = await Product.findById(productId);

    if (!product) {
        throw new ApiError(404, "Product not found");
    }

    if (product.isActive === false) {
        throw new ApiError(400, "Product is not available");
    }

    return product;
}

function formatCart(cart) {
    const items = cart.items.map(item => {
        const product = item.productId;
        const quantity = item.quantity;
        const price = product ? (product.price || 0) : 0;
        return {
            product,
            quantity,
            price
        };
    });

    const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);
    const totalAmount = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);

    return {
        _id: cart._id,
        userId: cart.userId,
        items,
        totalItems,
        totalAmount
    };
}

export async function getCart(userId) {
    const cart = await findOrCreateCart(userId);

    await cart.populate({
        path: "items.productId"
    });

    return formatCart(cart);
}

export async function addToCart(userId, productId, quantity) {
    const product = await getProduct(productId);

    if (
        product.stock !== undefined &&
        product.stock < quantity
    ) {
        throw new ApiError(400, "Insufficient stock");
    }

    const cart = await findOrCreateCart(userId);

    const existingItem = cart.items.find(
        (item) => item.productId.toString() === productId
    );

    if (existingItem) {
        const newQuantity = existingItem.quantity + quantity;

        if (
            product.stock !== undefined &&
            product.stock < newQuantity
        ) {
            throw new ApiError(400, "Insufficient stock");
        }

        existingItem.quantity = newQuantity;
    } else {
        cart.items.push({
            productId,
            quantity
        });
    }

    await saveCart(cart);

    await cart.populate({
        path: "items.productId"
    });

    return formatCart(cart);
}

export async function updateCartItem(
    userId,
    productId,
    quantity
) {
    const product = await getProduct(productId);

    if (
        product.stock !== undefined &&
        product.stock < quantity
    ) {
        throw new ApiError(400, "Insufficient stock");
    }

    const cart = await findOrCreateCart(userId);

    const item = cart.items.find(
        (cartItem) =>
            cartItem.productId.toString() === productId
    );

    if (!item) {
        throw new ApiError(404, "Product not found in cart");
    }

    item.quantity = quantity;

    await saveCart(cart);

    await cart.populate({
        path: "items.productId"
    });

    return formatCart(cart);
}

export async function removeCartItem(userId, productId) {
    const cart = await findOrCreateCart(userId);

    const initialLength = cart.items.length;

    cart.items = cart.items.filter(
        (item) => item.productId.toString() !== productId
    );

    if (cart.items.length === initialLength) {
        throw new ApiError(404, "Product not found in cart");
    }

    await saveCart(cart);

    await cart.populate({
        path: "items.productId"
    });

    return formatCart(cart);
}

export async function clearCart(userId) {
    const cart = await findOrCreateCart(userId);

    cart.items = [];

    await saveCart(cart);

    return formatCart(cart);
}