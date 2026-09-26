import {
    createProductService,
    getProductsService,
    getProductByIdService,
    getProductBySlugService,
    updateProductService,
    deleteProductService
} from "./products.service.js";

import { CloudinaryProvider } from "../../providers/storage/CloudinaryProvider.js";
import { LocalStorageProvider } from "../../providers/storage/LocalStorageProvider.js";
import { ImageProcessor } from "../../providers/storage/ImageProcessor.js";

const localProvider = new LocalStorageProvider();
const cloudProvider = new CloudinaryProvider();

export async function createProductController(
    req,
    res
) {
    const data = { ...req.body };
    if (req.files && req.files.length > 0) {
        data.images = await Promise.all(
            req.files.map(async (file) => {
                const processedImage = await ImageProcessor.processImage(file.buffer);
                
                const [localRes, cloudRes] = await Promise.all([
                    localProvider.uploadImage(processedImage, file.originalname),
                    cloudProvider.uploadImage(processedImage, file.originalname)
                ]);

                return {
                    url: cloudRes.url,
                    localUrl: localRes.url,
                    cloudinaryUrl: cloudRes.url,
                    publicId: cloudRes.publicId
                };
            })
        );
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
        await getProductsService(req.query);

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
    if (req.files && req.files.length > 0) {
        data.images = await Promise.all(
            req.files.map(async (file) => {
                const processedImage = await ImageProcessor.processImage(file.buffer);
                
                const [localRes, cloudRes] = await Promise.all([
                    localProvider.uploadImage(processedImage, file.originalname),
                    cloudProvider.uploadImage(processedImage, file.originalname)
                ]);

                return {
                    url: cloudRes.url,
                    localUrl: localRes.url,
                    cloudinaryUrl: cloudRes.url,
                    publicId: cloudRes.publicId
                };
            })
        );
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