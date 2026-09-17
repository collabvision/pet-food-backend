/**
 * Billing Service
 * Handles all server-side calculations for orders and checkout.
 */

export class BillingService {
    /**
     * Calculate billing details for a list of items
     * @param {Array<{price: number, quantity: number, discount?: number, tax?: number}>} items
     * @param {number} shippingCharge
     * @returns {Object} Billing details
     */
    static calculateBilling(items, shippingCharge = 0) {
        let subtotal = 0;
        let totalDiscount = 0;
        let totalTax = 0;

        items.forEach((item) => {
            const itemTotal = item.price * item.quantity;
            const itemDiscount = (item.discount || 0) * item.quantity;
            const taxableAmount = itemTotal - itemDiscount;
            
            // Assume tax is a percentage (e.g., 18 for 18% GST)
            const taxAmount = item.tax ? (taxableAmount * item.tax) / 100 : 0;

            subtotal += itemTotal;
            totalDiscount += itemDiscount;
            totalTax += taxAmount;
        });

        const totalAmount = subtotal - totalDiscount + totalTax + shippingCharge;

        return {
            subtotal: parseFloat(subtotal.toFixed(2)),
            totalDiscount: parseFloat(totalDiscount.toFixed(2)),
            totalTax: parseFloat(totalTax.toFixed(2)),
            shippingCharge: parseFloat(shippingCharge.toFixed(2)),
            totalAmount: parseFloat(totalAmount.toFixed(2))
        };
    }
}
