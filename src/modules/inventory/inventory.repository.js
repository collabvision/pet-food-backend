import { Inventory } from "./inventory.model.js";

export async function createInventory(data) {
    return Inventory.create(data);
}

export async function findInventoryByProduct(productId) {
    return Inventory
        .findOne({ product: productId })
        .populate("product", "name slug sku");
}

export async function findInventoryByProductId(productId) {
    return Inventory.findOne({
        product: productId
    });
}

export async function findAllInventory() {
    return Inventory
        .find()
        .populate("product", "name slug sku")
        .sort({ updatedAt: -1 });
}

export async function updateInventoryByProduct(
    productId,
    data
) {
    return Inventory.findOneAndUpdate(
        { product: productId },
        data,
        {
            new: true,
            runValidators: true
        }
    ).populate(
        "product",
        "name slug sku"
    );
}

export async function deleteInventoryByProduct(
    productId
) {
    return Inventory.findOneAndDelete({
        product: productId
    });
}

export async function incrementInventory(
    productId,
    quantity
) {
    return Inventory.findOneAndUpdate(
        { product: productId },
        {
            $inc: {
                quantity
            }
        },
        {
            new: true,
            runValidators: true
        }
    );
}

export async function decrementInventory(
    productId,
    quantity
) {
    return Inventory.findOneAndUpdate(
        {
            product: productId,
            $expr: {
                $gte: [
                    "$quantity",
                    {
                        $add: [
                            "$reservedQuantity",
                            quantity
                        ]
                    }
                ]
            }
        },
        {
            $inc: {
                quantity: -quantity
            }
        },
        {
            new: true,
            runValidators: true
        }
    );
}

export async function reserveInventory(
    productId,
    quantity
) {
    return Inventory.findOneAndUpdate(
        {
            product: productId,
            $expr: {
                $gte: [
                    {
                        $subtract: [
                            "$quantity",
                            "$reservedQuantity"
                        ]
                    },
                    quantity
                ]
            }
        },
        {
            $inc: {
                reservedQuantity: quantity
            }
        },
        {
            new: true,
            runValidators: true
        }
    );
}

export async function releaseReservedInventory(
    productId,
    quantity
) {
    return Inventory.findOneAndUpdate(
        {
            product: productId,
            reservedQuantity: {
                $gte: quantity
            }
        },
        {
            $inc: {
                reservedQuantity: -quantity
            }
        },
        {
            new: true,
            runValidators: true
        }
    );
}