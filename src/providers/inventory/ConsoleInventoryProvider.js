import { InventoryProvider } from "./InventoryProvider.js";

export class ConsoleInventoryProvider extends InventoryProvider {
    async reserve(orderId, items) {
        console.log(`[Inventory] RESERVED for Order ${orderId}`, items);
        return true;
    }

    async release(orderId, items) {
        console.log(`[Inventory] RELEASED for Order ${orderId}`, items);
        return true;
    }

    async deduct(orderId, items) {
        console.log(`[Inventory] DEDUCTED for Order ${orderId}`, items);
        return true;
    }

    async restore(orderId, items) {
        console.log(`[Inventory] RESTORED for Order ${orderId}`, items);
        return true;
    }
}
