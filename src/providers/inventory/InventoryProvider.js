export class InventoryProvider {
    /**
     * Reserve inventory for an order
     * @param {string} orderId
     * @param {Array<{productId: string, quantity: number}>} items
     * @returns {Promise<boolean>}
     */
    async reserve(orderId, items) {
        throw new Error("reserve not implemented");
    }

    /**
     * Release reserved inventory
     * @param {string} orderId
     * @param {Array<{productId: string, quantity: number}>} items
     * @returns {Promise<boolean>}
     */
    async release(orderId, items) {
        throw new Error("release not implemented");
    }

    /**
     * Deduct inventory permanently (after successful payment/shipping)
     * @param {string} orderId
     * @param {Array<{productId: string, quantity: number}>} items
     * @returns {Promise<boolean>}
     */
    async deduct(orderId, items) {
        throw new Error("deduct not implemented");
    }

    /**
     * Restore inventory (e.g. on return)
     * @param {string} orderId
     * @param {Array<{productId: string, quantity: number}>} items
     * @returns {Promise<boolean>}
     */
    async restore(orderId, items) {
        throw new Error("restore not implemented");
    }
}
