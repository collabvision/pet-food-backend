import { Category } from "./category.model.js";

export async function createCategory(data) {
    return Category.create(data);
}

export async function findAllCategories() {
    return Category.find()
        .sort({ name: 1 });
}

export async function findActiveCategories() {
    return Category.find({ isActive: true })
        .sort({ name: 1 });
}

export async function findCategoryById(categoryId) {
    return Category.findById(categoryId);
}

export async function findCategoryBySlug(slug) {
    return Category.findOne({ slug });
}

export async function updateCategoryById(categoryId, data) {
    return Category.findByIdAndUpdate(
        categoryId,
        data,
        {
            new: true,
            runValidators: true
        }
    );
}

export async function deleteCategoryById(categoryId) {
    return Category.findByIdAndDelete(categoryId);
}