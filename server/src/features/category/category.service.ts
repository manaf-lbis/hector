import { CategoryModel } from "./models/category.model";
import { ICategory } from "./types";

export class CategoryService {
    async getAllCategories() {
        return await CategoryModel.find().sort({ createdAt: -1 });
    }

    async createCategory(data: Partial<ICategory>) {
        return await CategoryModel.create(data);
    }

    async updateCategory(id: string, data: Partial<ICategory>) {
        return await CategoryModel.findByIdAndUpdate(id, data, { new: true });
    }

    async deleteCategory(id: string) {
        return await CategoryModel.findByIdAndDelete(id);
    }

    async bulkUpdateStatus(ids: string[], status: 'active' | 'blocked') {
        return await CategoryModel.updateMany({ _id: { $in: ids } }, { status });
    }

    async bulkDelete(ids: string[]) {
        return await CategoryModel.deleteMany({ _id: { $in: ids } });
    }
}
