// src/modules/shipping/shipping.service.js

import { ApiError } from "../../utils/ApiError.js";

import {
    createShipment,
    findById,
    findByOrderId,
    findByTrackingNumber,
    findByUserId,
    findAllShipments,
    saveShipment
} from "./shipping.repository.js";

import { findById as findOrderById } from "../orders/orders.repository.js";

export async function createOrderShipment(
    adminId,
    orderId,
    provider,
    courierName,
    trackingNumber,
    estimatedDeliveryDate
) {
    const order = await findOrderById(orderId);

    if (!order) {
        throw new ApiError(
            404,
            "Order not found"
        );
    }

    if (order.orderStatus === "CANCELLED") {
        throw new ApiError(
            400,
            "Cancelled order cannot be shipped"
        );
    }

    const existingShipment =
        await findByOrderId(orderId);

    if (existingShipment) {
        throw new ApiError(
            409,
            "Shipment already exists for this order"
        );
    }

    const shipment = await createShipment({
        orderId,
        userId: order.userId,
        provider,
        courierName: courierName || null,
        trackingNumber: trackingNumber || null,
        estimatedDeliveryDate:
            estimatedDeliveryDate
                ? new Date(estimatedDeliveryDate)
                : null,
        status: "READY_TO_SHIP",
        statusHistory: [
            {
                status: "READY_TO_SHIP",
                note: "Shipment created",
                changedBy: adminId
            }
        ]
    });

    return shipment;
}

export async function getUserShipment(
    userId,
    shipmentId
) {
    const shipment = await findById(shipmentId);

    if (!shipment) {
        throw new ApiError(
            404,
            "Shipment not found"
        );
    }

    if (
        shipment.userId._id.toString() !==
        userId
    ) {
        throw new ApiError(
            403,
            "Access denied"
        );
    }

    return shipment;
}

export async function getUserShipments(userId) {
    return findByUserId(userId);
}

export async function getShipmentByTrackingNumber(
    userId,
    trackingNumber
) {
    const shipment =
        await findByTrackingNumber(
            trackingNumber
        );

    if (!shipment) {
        throw new ApiError(
            404,
            "Shipment not found"
        );
    }

    if (
        shipment.userId._id.toString() !==
        userId
    ) {
        throw new ApiError(
            403,
            "Access denied"
        );
    }

    return shipment;
}

export async function updateShipmentStatus(
    adminId,
    shipmentId,
    status,
    note
) {
    const shipment =
        await findById(shipmentId);

    if (!shipment) {
        throw new ApiError(
            404,
            "Shipment not found"
        );
    }

    if (shipment.status === "CANCELLED") {
        throw new ApiError(
            400,
            "Cancelled shipment cannot be updated"
        );
    }

    if (shipment.status === "DELIVERED") {
        throw new ApiError(
            400,
            "Delivered shipment cannot be updated"
        );
    }

    shipment.status = status;

    shipment.statusHistory.push({
        status,
        note,
        changedBy: adminId,
        changedAt: new Date()
    });

    if (status === "SHIPPED") {
        shipment.shippedAt = new Date();
    }

    if (status === "DELIVERED") {
        shipment.deliveredAt = new Date();
    }

    await saveShipment(shipment);

    return shipment;
}

export async function getAdminShipments() {
    return findAllShipments();
}