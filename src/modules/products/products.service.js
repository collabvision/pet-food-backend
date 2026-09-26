import { ApiError } from "../../utils/ApiError.js";

import {
    createProduct,
    findAllProducts,
    findProductById,
    findProductBySlug,
    findProductBySku,
    updateProductById,
    deleteProductById
} from "./products.repository.js";

import { findCategoryById } from "../categories/categories.repository.js";


export async function createProductService(data) {
    const existingSlug =
        await findProductBySlug(data.slug);

    if (existingSlug) {
        throw new ApiError(
            409,
            "Product slug already exists"
        );
    }

    const existingSku =
        await findProductBySku(data.sku);

    if (existingSku) {
        throw new ApiError(
            409,
            "Product SKU already exists"
        );
    }

    const category =
        await findCategoryById(data.category);

    if (!category) {
        throw new ApiError(
            404,
            "Category not found"
        );
    }

    if (!category.isActive) {
        throw new ApiError(
            400,
            "Category is inactive"
        );
    }

    if (
        data.compareAtPrice !== undefined &&
        data.compareAtPrice !== null &&
        data.compareAtPrice < data.price
    ) {
        throw new ApiError(
            400,
            "Compare-at price must be greater than or equal to price"
        );
    }

    if (
        data.requiresPrescription === true &&
        data.isMedical !== true
    ) {
        throw new ApiError(
            400,
            "Prescription requirement is only allowed for medical products"
        );
    }

    return createProduct(data);
}


export async function getProductsService(query = {}) {
    const filter = { isActive: true };

    if (query.q) {
        filter.$text = { $search: query.q };
    }

    if (query.petType || query.category) {
        // Import Category model at the top of the file ideally, but for simplicity here we can require it
        const { Category } = await import('../categories/category.model.js');
        const catFilter = {};
        
        if (query.petType) {
            const types = query.petType.split(',').map(t => new RegExp('^' + t.trim() + '$', 'i'));
            catFilter.name = { $in: types };
        }
        
        if (query.category) {
            const slugs = query.category.split(',');
            catFilter.slug = { $in: slugs };
        }

        const matchedCategories = await Category.find(catFilter).select('_id');
        filter.category = { $in: matchedCategories.map(c => c._id) };
    }

    if (query.brand) {
        const brands = query.brand.split(',').map(b => b.trim());
        filter.brand = { $in: brands.map(b => new RegExp('^' + b + '$', 'i')) };
    }

    if (query.minPrice || query.maxPrice) {
        filter.price = {};
        if (query.minPrice) filter.price.$gte = Number(query.minPrice);
        if (query.maxPrice) filter.price.$lte = Number(query.maxPrice);
    }

    if (query.vetApproved === 'true') {
        filter.isMedical = true;
    }

    return findAllProducts(filter, query);
}


export async function getProductByIdService(productId) {
    const product =
        await findProductById(productId);

    if (!product || !product.isActive) {
        throw new ApiError(
            404,
            "Product not found"
        );
    }

    return product;
}


export async function getProductBySlugService(slug) {
    const product =
        await findProductBySlug(slug);

    if (!product || !product.isActive) {
        throw new ApiError(
            404,
            "Product not found"
        );
    }

    return product;
}


export async function updateProductService(
    productId,
    data
) {
    const product =
        await findProductById(productId);

    if (!product) {
        throw new ApiError(
            404,
            "Product not found"
        );
    }

    if (
        data.slug &&
        data.slug !== product.slug
    ) {
        const existingSlug =
            await findProductBySlug(data.slug);

        if (
            existingSlug &&
            existingSlug._id.toString() !== productId
        ) {
            throw new ApiError(
                409,
                "Product slug already exists"
            );
        }
    }

    if (
        data.sku &&
        data.sku !== product.sku
    ) {
        const existingSku =
            await findProductBySku(data.sku);

        if (
            existingSku &&
            existingSku._id.toString() !== productId
        ) {
            throw new ApiError(
                409,
                "Product SKU already exists"
            );
        }
    }

    if (data.category) {
        const category =
            await findCategoryById(data.category);

        if (!category) {
            throw new ApiError(
                404,
                "Category not found"
            );
        }

        if (!category.isActive) {
            throw new ApiError(
                400,
                "Category is inactive"
            );
        }
    }

    const finalPrice =
        data.price !== undefined
            ? data.price
            : product.price;

    const finalCompareAtPrice =
        data.compareAtPrice !== undefined
            ? data.compareAtPrice
            : product.compareAtPrice;

    /*
     * If price is increased and the old
     * compareAtPrice becomes invalid,
     * automatically remove it.
     */
    if (
        finalCompareAtPrice !== null &&
        finalCompareAtPrice < finalPrice
    ) {
        if (
            data.price !== undefined &&
            data.compareAtPrice === undefined
        ) {
            data.compareAtPrice = null;
        } else {
            throw new ApiError(
                400,
                "Compare-at price must be greater than or equal to price"
            );
        }
    }

    const finalIsMedical =
        data.isMedical !== undefined
            ? data.isMedical
            : product.isMedical;

    const finalRequiresPrescription =
        data.requiresPrescription !== undefined
            ? data.requiresPrescription
            : product.requiresPrescription;

    if (
        finalRequiresPrescription === true &&
        finalIsMedical !== true
    ) {
        throw new ApiError(
            400,
            "Prescription requirement is only allowed for medical products"
        );
    }

    return updateProductById(
        productId,
        data
    );
}


export async function deleteProductService(productId) {
    const product =
        await findProductById(productId);

    if (!product) {
        throw new ApiError(
            404,
            "Product not found"
        );
    }

    return deleteProductById(productId);
}