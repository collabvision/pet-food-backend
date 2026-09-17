// src/modules/cart/cart.repository.js

import { Cart } from "./cart.model.js";

export async function findByUserId(userId) {
    return Cart.findOne({ userId });
}

export async function createCart(userId) {
    return Cart.create({
        userId,
        items: []
    });
}

export async function findOrCreateCart(userId) {
    let cart = await findByUserId(userId);

    if (!cart) {
        cart = await createCart(userId);
    }

    return cart;
}

export async function saveCart(cart) {
    return cart.save();
}

export async function deleteCartByUserId(userId) {
    return Cart.deleteOne({ userId });
}