import { Product } from "../modules/products/product.model.js";
import { Inventory } from "../modules/inventory/inventory.model.js";
import { connectDB } from "../config/db.js";

async function syncProductInventory() {
    await connectDB();

    try {
        const products = await Product.find({})
            .select("_id")
            .lean();

        const inventories = await Inventory.find({})
            .select("product")
            .lean();

        const productIds = new Set(
            products.map(p => p._id.toString())
        );

        const inventoryProductIds = new Set(
            inventories.map(i => i.product.toString())
        );

        // Find products that do not have inventory.
        const missingInventory = products.filter(
            p => !inventoryProductIds.has(p._id.toString())
        );

        // Find inventory records without a matching product.
        const orphanInventory = inventories.filter(
            i => !productIds.has(i.product.toString())
        );

        if (missingInventory.length > 0) {
            await Inventory.bulkWrite(
                missingInventory.map(product => ({
                    updateOne: {
                        filter: { product: product._id },
                        update: {
                            $setOnInsert: {
                                product: product._id,
                                quantity: 0,
                                reservedQuantity: 0,
                                lowStockThreshold: 10
                            }
                        },
                        upsert: true
                    }
                })),
                { ordered: false }
            );
        }

        const finalProductCount = await Product.countDocuments({});
        const finalInventoryCount = await Inventory.countDocuments({});

        console.log({
            totalProducts: finalProductCount,
            totalInventoryRecords: finalInventoryCount,
            missingInventoryFixed: missingInventory.length,
            orphanInventoryCount: orphanInventory.length,
            orphanInventoryIds: orphanInventory.map(i => i._id)
        });

    } finally {
        // Use the disconnect function exported by your DB config.
        // If none exists, add one or close the Mongoose connection here.
    }
}

syncProductInventory().catch(error => {
    console.error("Inventory synchronization failed:", error);
    process.exitCode = 1;
});