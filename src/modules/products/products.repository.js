import { Product } from "./product.model.js";

export async function createProduct(data) {
    return Product.create(data);
}

export async function findAllProducts(filter = {}, query = {}) {
    const page = Math.max(1, Number(query.page) || 1);
    const limit = Math.max(1, Number(query.limit) || 12);
    const skip = (page - 1) * limit;

    let sort = { createdAt: -1 };
    if (query.sort === 'featured') {
        sort = { rating: -1, createdAt: -1 };
    }

    const [items, total] = await Promise.all([
        Product.find(filter)
            .populate("category", "name slug")
            .sort(sort)
            .skip(skip)
            .limit(limit),
        Product.countDocuments(filter)
    ]);

    return {
        items,
        total,
        page,
        pages: Math.max(1, Math.ceil(total / limit))
    };
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