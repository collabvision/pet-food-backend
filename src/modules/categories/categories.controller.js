import {
    createCategoryService,
    getCategoriesService,
    getCategoryByIdService,
    updateCategoryService,
    deleteCategoryService
} from "./categories.service.js";

export async function createCategoryController(req, res) {
    const category = await createCategoryService(req.body);

    res.status(201).json({
        success: true,
        message: "Category created successfully",
        data: category
    });
}

export async function getCategoriesController(req, res) {
    const includeInactive =
        req.query.includeInactive === "true";

    const categories = await getCategoriesService(includeInactive);

    res.status(200).json({
        success: true,
        data: categories
    });
}

export async function getCategoryByIdController(req, res) {
    const category = await getCategoryByIdService(
        req.params.categoryId
    );

    res.status(200).json({
        success: true,
        data: category
    });
}

export async function updateCategoryController(req, res) {
    const category = await updateCategoryService(
        req.params.categoryId,
        req.body
    );

    res.status(200).json({
        success: true,
        message: "Category updated successfully",
        data: category
    });
}

export async function deleteCategoryController(req, res) {
    const category = await deleteCategoryService(
        req.params.categoryId
    );

    res.status(200).json({
        success: true,
        message: "Category deleted successfully",
        data: category
    });
}