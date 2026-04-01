import { NextFunction, Request, Response } from "express";
import { CategoryService } from "./category.service";
import { sendSuccess } from "../../shared/utility/api.success";
import { uploadToCloudinary } from "../../shared/utility/cloudinary";

export class CategoryController {
    constructor(private _categoryService: CategoryService) { }

    async getCategories(req: Request, res: Response, next: NextFunction) {
        try {
            const categories = await this._categoryService.getAllCategories();
            sendSuccess(res, categories, "Categories retrieved successfully");
        } catch (error) {
            next(error);
        }
    }

    async createCategory(req: Request, res: Response, next: NextFunction) {
        try {
            let categoryData = req.body;
            if (req.file) {
                const result = await uploadToCloudinary(req.file.buffer, 'categories', 'upload');
                categoryData.image = result.secure_url;
            }
            const category = await this._categoryService.createCategory(categoryData);
            sendSuccess(res, category, "Category created successfully");
        } catch (error) {
            next(error);
        }
    }

    async updateCategory(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            let categoryData = req.body;
            if (req.file) {
                const result = await uploadToCloudinary(req.file.buffer, 'categories', 'upload');
                categoryData.image = result.secure_url;
            }
            const category = await this._categoryService.updateCategory(id, categoryData);
            sendSuccess(res, category, "Category updated successfully");
        } catch (error) {
            next(error);
        }
    }

    async deleteCategory(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            await this._categoryService.deleteCategory(id);
            sendSuccess(res, null, "Category deleted successfully");
        } catch (error) {
            next(error);
        }
    }

    async bulkUpdateStatus(req: Request, res: Response, next: NextFunction) {
        try {
            const { ids, status } = req.body;
            const result = await this._categoryService.bulkUpdateStatus(ids, status);
            sendSuccess(res, { count: ids.length }, `Bulk updated ${ids.length} categories to ${status}`);
        } catch (error) {
            next(error);
        }
    }

    async bulkDelete(req: Request, res: Response, next: NextFunction) {
        try {
            const { ids } = req.body;
            const result = await this._categoryService.bulkDelete(ids);
            sendSuccess(res, { count: ids.length }, `Bulk deleted ${ids.length} categories`);
        } catch (error) {
            next(error);
        }
    }
}
