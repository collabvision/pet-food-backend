import { ApiError } from "../../utils/ApiError.js";

import {
    createInventory,
    findInventoryByProduct,
    findInventoryByProductId,
    findAllInventory,
    updateInventoryByProduct,
    deleteInventoryByProduct,
    incrementInventory,
    decrementInventory,
    reserveInventory,
    releaseReservedInventory
} from "./inventory.repository.js";

import {
    findProductById
} from "../products/products.repository.js";


export async function createInventoryService(data) {
    const product =
        await findProductById(data.product);

    if (!product) {
        throw new ApiError(
            404,
            "Product not found"
        );
    }

    const existingInventory =
        await findInventoryByProductId(
            data.product
        );

    if (existingInventory) {
        throw new ApiError(
            409,
            "Inventory already exists for this product"
        );
    }

    return createInventory(data);
}


export async function getInventoryService() {
    return findAllInventory();
}


export async function getInventoryByProductService(
    productId
) {
    const inventory =
        await findInventoryByProduct(
            productId
        );

    if (!inventory) {
        throw new ApiError(
            404,
            "Inventory not found"
        );
    }

    return inventory;
}


export async function updateInventoryService(
    productId,
    data
) {
    const inventory =
        await findInventoryByProductId(
            productId
        );

    if (!inventory) {
        throw new ApiError(
            404,
            "Inventory not found"
        );
    }

    const finalQuantity =
        data.quantity !== undefined
            ? data.quantity
            : inventory.quantity;

    const finalReservedQuantity =
        data.reservedQuantity !== undefined
            ? data.reservedQuantity
            : inventory.reservedQuantity;

    if (
        finalReservedQuantity >
        finalQuantity
    ) {
        throw new ApiError(
            400,
            "Reserved quantity cannot exceed quantity"
        );
    }

    return updateInventoryByProduct(
        productId,
        data
    );
}


export async function deleteInventoryService(
    productId
) {
    const inventory =
        await findInventoryByProductId(
            productId
        );

    if (!inventory) {
        throw new ApiError(
            404,
            "Inventory not found"
        );
    }

    return deleteInventoryByProduct(
        productId
    );
}


export async function addStockService(
    productId,
    quantity
) {
    const inventory =
        await findInventoryByProductId(
            productId
        );

    if (!inventory) {
        throw new ApiError(
            404,
            "Inventory not found"
        );
    }

    return incrementInventory(
        productId,
        quantity
    );
}


export async function removeStockService(
    productId,
    quantity
) {
    const inventory =
        await findInventoryByProductId(
            productId
        );

    if (!inventory) {
        throw new ApiError(
            404,
            "Inventory not found"
        );
    }

    const updatedInventory =
        await decrementInventory(
            productId,
            quantity
        );

    if (!updatedInventory) {
        throw new ApiError(
            400,
            "Insufficient available stock"
        );
    }

    return updatedInventory;
}


export async function reserveStockService(
    productId,
    quantity
) {
    const inventory =
        await findInventoryByProductId(
            productId
        );

    if (!inventory) {
        throw new ApiError(
            404,
            "Inventory not found"
        );
    }

    const updatedInventory =
        await reserveInventory(
            productId,
            quantity
        );

    if (!updatedInventory) {
        throw new ApiError(
            400,
            "Insufficient available stock"
        );
    }

    return updatedInventory;
}


export async function releaseStockService(
    productId,
    quantity
) {
    const inventory =
        await findInventoryByProductId(
            productId
        );

    if (!inventory) {
        throw new ApiError(
            404,
            "Inventory not found"
        );
    }

    const updatedInventory =
        await releaseReservedInventory(
            productId,
            quantity
        );

    if (!updatedInventory) {
        throw new ApiError(
            400,
            "Reserved quantity is insufficient"
        );
    }

    return updatedInventory;
}