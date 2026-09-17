// src/modules/shipping/shipping.repository.js

import { Shipment } from "./shipment.model.js";

export async function createShipment(data) {
    return Shipment.create(data);
}

export async function findById(shipmentId) {
    return Shipment.findById(shipmentId)
        .populate("orderId")
        .populate("userId", "name email");
}

export async function findByOrderId(orderId) {
    return Shipment.findOne({ orderId })
        .populate("orderId")
        .populate("userId", "name email");
}

export async function findByTrackingNumber(
    trackingNumber
) {
    return Shipment.findOne({
        trackingNumber
    })
        .populate("orderId")
        .populate("userId", "name email");
}

export async function findByUserId(userId) {
    return Shipment.find({ userId })
        .sort({ createdAt: -1 })
        .populate("orderId");
}

export async function findAllShipments() {
    return Shipment.find()
        .sort({ createdAt: -1 })
        .populate("orderId")
        .populate("userId", "name email");
}

export async function saveShipment(shipment) {
    return shipment.save();
}

export async function updateShipment(
    shipmentId,
    data
) {
    return Shipment.findByIdAndUpdate(
        shipmentId,
        data,
        {
            new: true,
            runValidators: true
        }
    );
}