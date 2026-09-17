import {
    createCategory,
    findAllCategories,
    findActiveCategories,
    findCategoryById,
    findCategoryBySlug,
    updateCategoryById,
    deleteCategoryById
} from "./categories.repository.js";

import { ApiError } from "../../utils/ApiError.js";

export async function createCategoryService(data) {
    const existingCategory = await findCategoryBySlug(data.slug);

    if (existingCategory) {
        throw new ApiError(
            409,
            "Category with this slug already exists"
        );
    }

    return createCategory(data);
}

export async function getCategoriesService(includeInactive = false) {
    if (includeInactive) {
        return findAllCategories();
    }

    return findActiveCategories();
}

export async function getCategoryByIdService(categoryId) {
    const category = await findCategoryById(categoryId);

    if (!category) {
        throw new ApiError(404, "Category not found");
    }

    return category;
}

export async function updateCategoryService(categoryId, data) {
    const category = await findCategoryById(categoryId);

    if (!category) {
        throw new ApiError(404, "Category not found");
    }

    if (data.slug && data.slug !== category.slug) {
        const existingCategory = await findCategoryBySlug(data.slug);

        if (
            existingCategory &&
            existingCategory._id.toString() !== categoryId
        ) {
            throw new ApiError(
                409,
                "Category with this slug already exists"
            );
        }
    }

    return updateCategoryById(categoryId, data);
}

export async function deleteCategoryService(categoryId) {
    const category = await findCategoryById(categoryId);

    if (!category) {
        throw new ApiError(404, "Category not found");
    }

    await deleteCategoryById(categoryId);

    return category;
}