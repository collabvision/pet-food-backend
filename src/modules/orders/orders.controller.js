// src/modules/orders/orders.controller.js

import {
    createUserOrder,
    getUserOrder,
    getUserOrders,
    getOrderByNumber,
    getAdminOrders,
    updateOrderStatus,
    cancelUserOrder
} from "./orders.service.js";

export async function createOrderController(req, res) {
    const order = await createUserOrder(
        req.user.id,
        req.body.shippingAddress,
        req.body.shippingCharge,
        req.body.discount
    );

    res.status(201).json({
        success: true,
        message: "Order created successfully",
        data: order
    });
}

export async function getOrdersController(req, res) {
    const orders = await getUserOrders(req.user.id);

    res.status(200).json({
        success: true,
        data: orders
    });
}

export async function getOrderController(req, res) {
    const order = await getUserOrder(
        req.user.id,
        req.params.orderId
    );

    res.status(200).json({
        success: true,
        data: order
    });
}

export async function getOrderByNumberController(
    req,
    res
) {
    const order = await getOrderByNumber(
        req.user.id,
        req.params.orderNumber
    );

    res.status(200).json({
        success: true,
        data: order
    });
}

export async function cancelOrderController(req, res) {
    const order = await cancelUserOrder(
        req.user.id,
        req.params.orderId
    );

    res.status(200).json({
        success: true,
        message: "Order cancelled successfully",
        data: order
    });
}

export async function getAdminOrdersController(
    req,
    res
) {
    const orders = await getAdminOrders();

    res.status(200).json({
        success: true,
        data: orders
    });
}

export async function updateOrderStatusController(
    req,
    res
) {
    const order = await updateOrderStatus(
        req.params.orderId,
        req.body.status,
        req.body.note,
        req.user.id
    );

    res.status(200).json({
        success: true,
        message: "Order status updated successfully",
        data: order
    });
}