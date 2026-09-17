import {
    createProductService,
    getProductsService,
    getProductByIdService,
    getProductBySlugService,
    updateProductService,
    deleteProductService
} from "./products.service.js";

import { storageProvider, imageProcessor } from "../../providers/storage/index.js";

export async function createProductController(
    req,
    res
) {
    const data = { ...req.body };
    if (req.file) {
        const processedImage = await imageProcessor.processImage(req.file.buffer);
        const uploaded = await storageProvider.uploadImage(processedImage, req.file.originalname);
        data.images = [uploaded];
    }

    const product =
        await createProductService(data);

    res.status(201).json({
        success: true,
        message: "Product created successfully",
        data: product
    });
}

export async function getProductsController(
    req,
    res
) {
    const products =
        await getProductsService();

    res.status(200).json({
        success: true,
        data: products
    });
}

export async function getProductByIdController(
    req,
    res
) {
    const product =
        await getProductByIdService(
            req.params.productId
        );

    res.status(200).json({
        success: true,
        data: product
    });
}

export async function getProductBySlugController(
    req,
    res
) {
    const product =
        await getProductBySlugService(
            req.params.slug
        );

    res.status(200).json({
        success: true,
        data: product
    });
}

export async function updateProductController(
    req,
    res
) {
    const data = { ...req.body };
    if (req.file) {
        const processedImage = await imageProcessor.processImage(req.file.buffer);
        const uploaded = await storageProvider.uploadImage(processedImage, req.file.originalname);
        data.images = [uploaded];
    }

    const product =
        await updateProductService(
            req.params.productId,
            data
        );

    res.status(200).json({
        success: true,
        message: "Product updated successfully",
        data: product
    });
}

export async function deleteProductController(
    req,
    res
) {
    const product =
        await deleteProductService(
            req.params.productId
        );

    res.status(200).json({
        success: true,
        message: "Product deleted successfully",
        data: product
    });
}