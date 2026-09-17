import {
    createProductService,
    getProductsService,
    getProductByIdService,
    getProductBySlugService,
    updateProductService,
    deleteProductService
} from "./products.service.js";

export async function createProductController(
    req,
    res
) {
    const product =
        await createProductService(req.body);

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
    const product =
        await updateProductService(
            req.params.productId,
            req.body
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