// src/modules/orders/orders.service.js

import crypto from "crypto";

import { ApiError } from "../../utils/ApiError.js";

import {
    createOrder,
    findById,
    findByOrderNumber,
    findByUserId,
    findAllOrders,
    updateOrder,
    saveOrder
} from "./orders.repository.js";

import { Cart } from "../cart/cart.model.js";
import { Product } from "../products/product.model.js";

function generateOrderNumber() {
    const timestamp = Date.now().toString(36).toUpperCase();

    const random = crypto
        .randomBytes(4)
        .toString("hex")
        .toUpperCase();

    return `ORD-${timestamp}-${random}`;
}

function calculateTotals(items, shippingCharge, discount) {
    const subtotal = items.reduce(
        (sum, item) => sum + item.total,
        0
    );

    const totalAmount = Math.max(
        0,
        subtotal + shippingCharge - discount
    );

    return {
        subtotal,
        shippingCharge,
        discount,
        totalAmount
    };
}

export async function createUserOrder(
    userId,
    shippingAddress,
    shippingCharge = 0,
    discount = 0
) {
    const cart = await Cart.findOne({ userId });

    if (!cart || cart.items.length === 0) {
        throw new ApiError(400, "Cart is empty");
    }

    const productIds = cart.items.map(
        (item) => item.productId
    );

    const products = await Product.find({
        _id: { $in: productIds },
        isActive: { $ne: false }
    });

    const productMap = new Map(
        products.map((product) => [
            product._id.toString(),
            product
        ])
    );

    const orderItems = [];

    for (const cartItem of cart.items) {
        const product = productMap.get(
            cartItem.productId.toString()
        );

        if (!product) {
            throw new ApiError(
                400,
                `Product ${cartItem.productId} is unavailable`
            );
        }

        if (
            product.stock !== undefined &&
            product.stock < cartItem.quantity
        ) {
            throw new ApiError(
                400,
                `Insufficient stock for ${product.name}`
            );
        }

        const price = Number(product.price);
        const quantity = Number(cartItem.quantity);

        orderItems.push({
            productId: product._id,
            name: product.name,
            price,
            quantity,
            total: price * quantity
        });
    }

    const totals = calculateTotals(
        orderItems,
        shippingCharge,
        discount
    );

    const order = await createOrder({
        orderNumber: generateOrderNumber(),
        userId,
        items: orderItems,
        shippingAddress,
        ...totals,
        paymentStatus: "PENDING",
        orderStatus: "PENDING",
        statusHistory: [
            {
                status: "PENDING",
                note: "Order created",
                changedBy: userId
            }
        ]
    });

    cart.items = [];
    await cart.save();

    return order;
}

export async function getUserOrder(userId, orderId) {
    const order = await findById(orderId);

    if (!order) {
        throw new ApiError(404, "Order not found");
    }

    if (order.userId.toString() !== userId) {
        throw new ApiError(403, "Access denied");
    }

    return order;
}

export async function getUserOrders(userId) {
    return findByUserId(userId);
}

export async function getOrderByNumber(
    userId,
    orderNumber
) {
    const order = await findByOrderNumber(orderNumber);

    if (!order) {
        throw new ApiError(404, "Order not found");
    }

    if (order.userId.toString() !== userId) {
        throw new ApiError(403, "Access denied");
    }

    return order;
}

export async function getAdminOrders() {
    return findAllOrders();
}

export async function updateOrderStatus(
    orderId,
    status,
    note,
    changedBy
) {
    const order = await findById(orderId);

    if (!order) {
        throw new ApiError(404, "Order not found");
    }

    if (
        order.orderStatus === "DELIVERED" &&
        status !== "RETURN_REQUESTED" &&
        status !== "RETURNED"
    ) {
        throw new ApiError(
            400,
            "Delivered order status cannot be changed"
        );
    }

    if (order.orderStatus === "CANCELLED") {
        throw new ApiError(
            400,
            "Cancelled order cannot be updated"
        );
    }

    order.orderStatus = status;

    order.statusHistory.push({
        status,
        note,
        changedBy,
        changedAt: new Date()
    });

    if (status === "DELIVERED") {
        order.deliveredAt = new Date();
    }

    if (status === "CANCELLED") {
        order.cancelledAt = new Date();
    }

    await saveOrder(order);

    return order;
}

export async function cancelUserOrder(
    userId,
    orderId
) {
    const order = await findById(orderId);

    if (!order) {
        throw new ApiError(404, "Order not found");
    }

    if (order.userId.toString() !== userId) {
        throw new ApiError(403, "Access denied");
    }

    if (
        ["SHIPPED", "DELIVERED", "RETURNED"].includes(
            order.orderStatus
        )
    ) {
        throw new ApiError(
            400,
            "Order cannot be cancelled at this stage"
        );
    }

    if (order.orderStatus === "CANCELLED") {
        throw new ApiError(
            400,
            "Order is already cancelled"
        );
    }

    order.orderStatus = "CANCELLED";
    order.cancelledAt = new Date();

    order.statusHistory.push({
        status: "CANCELLED",
        note: "Cancelled by user",
        changedBy: userId,
        changedAt: new Date()
    });

    await saveOrder(order);

    return order;
}