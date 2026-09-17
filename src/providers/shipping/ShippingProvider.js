// src/providers/shipping/ShippingProvider.js

export class ShippingProvider {
    async createShipment() {
        throw new Error(
            "createShipment() must be implemented"
        );
    }

    async getShipmentStatus() {
        throw new Error(
            "getShipmentStatus() must be implemented"
        );
    }

    async cancelShipment() {
        throw new Error(
            "cancelShipment() must be implemented"
        );
    }
}