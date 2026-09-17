import {
    createInventoryService,
    getInventoryService,
    getInventoryByProductService,
    updateInventoryService,
    deleteInventoryService,
    addStockService,
    removeStockService,
    reserveStockService,
    releaseStockService
} from "./inventory.service.js";


export async function createInventoryController(
    req,
    res
) {
    const inventory =
        await createInventoryService(
            req.body
        );

    res.status(201).json({
        success: true,
        message: "Inventory created successfully",
        data: inventory
    });
}


export async function getInventoryController(
    req,
    res
) {
    const inventory =
        await getInventoryService();

    res.status(200).json({
        success: true,
        data: inventory
    });
}


export async function getInventoryByProductController(
    req,
    res
) {
    const inventory =
        await getInventoryByProductService(
            req.params.productId
        );

    res.status(200).json({
        success: true,
        data: inventory
    });
}


export async function updateInventoryController(
    req,
    res
) {
    const inventory =
        await updateInventoryService(
            req.params.productId,
            req.body
        );

    res.status(200).json({
        success: true,
        message: "Inventory updated successfully",
        data: inventory
    });
}


export async function deleteInventoryController(
    req,
    res
) {
    await deleteInventoryService(
        req.params.productId
    );

    res.status(200).json({
        success: true,
        message: "Inventory deleted successfully"
    });
}


export async function addStockController(
    req,
    res
) {
    const inventory =
        await addStockService(
            req.params.productId,
            req.body.quantity
        );

    res.status(200).json({
        success: true,
        message: "Stock added successfully",
        data: inventory
    });
}


export async function removeStockController(
    req,
    res
) {
    const inventory =
        await removeStockService(
            req.params.productId,
            req.body.quantity
        );

    res.status(200).json({
        success: true,
        message: "Stock removed successfully",
        data: inventory
    });
}


export async function reserveStockController(
    req,
    res
) {
    const inventory =
        await reserveStockService(
            req.params.productId,
            req.body.quantity
        );

    res.status(200).json({
        success: true,
        message: "Stock reserved successfully",
        data: inventory
    });
}


export async function releaseStockController(
    req,
    res
) {
    const inventory =
        await releaseStockService(
            req.params.productId,
            req.body.quantity
        );

    res.status(200).json({
        success: true,
        message: "Reserved stock released successfully",
        data: inventory
    });
}