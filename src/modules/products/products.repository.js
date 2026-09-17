import { Product } from "./product.model.js";

export async function createProduct(data) {
    return Product.create(data);
}

export async function findAllProducts(filter = {}) {
    return Product.find(filter)
        .populate("category", "name slug")
        .sort({ createdAt: -1 });
}

export async function findProductById(productId) {
    return Product.findById(productId)
        .populate("category", "name slug");
}

export async function findProductBySlug(slug) {
    return Product.findOne({ slug })
        .populate("category", "name slug");
}

export async function findProductBySku(sku) {
    return Product.findOne({ sku });
}

export async function updateProductById(productId, data) {
    return Product.findByIdAndUpdate(
        productId,
        data,
        {
            new: true,
            runValidators: true
        }
    ).populate("category", "name slug");
}

export async function deleteProductById(productId) {
    return Product.findByIdAndDelete(productId);
}