// src/modules/shipping/shipping.controller.js

import {
    createOrderShipment,
    getUserShipment,
    getUserShipments,
    getShipmentByTrackingNumber,
    updateShipmentStatus,
    getAdminShipments
} from "./shipping.service.js";

export async function createShipmentController(
    req,
    res
) {
    const shipment =
        await createOrderShipment(
            req.user.id,
            req.body.orderId,
            req.body.provider,
            req.body.courierName,
            req.body.trackingNumber,
            req.body.estimatedDeliveryDate
        );

    res.status(201).json({
        success: true,
        message: "Shipment created successfully",
        data: shipment
    });
}

export async function getShipmentsController(
    req,
    res
) {
    const shipments =
        await getUserShipments(req.user.id);

    res.status(200).json({
        success: true,
        data: shipments
    });
}

export async function getShipmentController(
    req,
    res
) {
    const shipment =
        await getUserShipment(
            req.user.id,
            req.params.shipmentId
        );

    res.status(200).json({
        success: true,
        data: shipment
    });
}

export async function getTrackingController(
    req,
    res
) {
    const shipment =
        await getShipmentByTrackingNumber(
            req.user.id,
            req.params.trackingNumber
        );

    res.status(200).json({
        success: true,
        data: shipment
    });
}

export async function updateShipmentStatusController(
    req,
    res
) {
    const shipment =
        await updateShipmentStatus(
            req.user.id,
            req.params.shipmentId,
            req.body.status,
            req.body.note
        );

    res.status(200).json({
        success: true,
        message: "Shipment status updated successfully",
        data: shipment
    });
}

export async function getAdminShipmentsController(
    req,
    res
) {
    const shipments =
        await getAdminShipments();

    res.status(200).json({
        success: true,
        data: shipments
    });
}