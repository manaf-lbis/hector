import { Router } from "express";
import { UserRepo } from "./user.repo";
import { UserService } from "./user.services";
import { UserController } from "./user.controller";
import { authMiddleware, roleMiddleware } from "../../shared/middleware/auth.middleware";
import { Roles } from "../user/types";

const router = Router();

const userRepo = new UserRepo();
const userService = new UserService(userRepo);
const userController = new UserController(userService);

router.put('/me/location', authMiddleware, userController.updateLocation.bind(userController));

router.get('/all', authMiddleware, roleMiddleware([Roles.admin]), userController.getAllUsers.bind(userController));
router.get('/:id', authMiddleware, roleMiddleware([Roles.admin]), userController.getUserById.bind(userController));
router.get('/logs/:userId', authMiddleware, roleMiddleware([Roles.admin]), userController.getLoginLogs.bind(userController));
router.patch("/:id/status", authMiddleware, roleMiddleware([Roles.admin]), userController.updateUserStatus.bind(userController));

export default router;
