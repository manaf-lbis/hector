import { Router } from "express";
import { CategoryController } from "./category.controller";
import { CategoryService } from "./category.service";
import { authMiddleware, roleMiddleware } from "../../shared/middleware/auth.middleware";
import { Roles } from "../user/types";
import { categoryUpload } from "../../shared/middleware/upload.middleware";

const categoryRouter = Router();
const categoryService = new CategoryService();
const categoryController = new CategoryController(categoryService);

categoryRouter.get("/", categoryController.getCategories.bind(categoryController));

// Admin routes
categoryRouter.use(authMiddleware, roleMiddleware([Roles.admin]));

categoryRouter.post("/", categoryUpload, categoryController.createCategory.bind(categoryController));
categoryRouter.put("/:id", categoryUpload, categoryController.updateCategory.bind(categoryController));
categoryRouter.patch("/bulk-status", categoryController.bulkUpdateStatus.bind(categoryController));
categoryRouter.delete("/bulk", categoryController.bulkDelete.bind(categoryController));
categoryRouter.delete("/:id", categoryController.deleteCategory.bind(categoryController));

export default categoryRouter;
