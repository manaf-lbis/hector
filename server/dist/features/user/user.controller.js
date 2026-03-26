"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const api_success_1 = require("../../shared/utility/api.success");
class UserController {
    constructor(_userService) {
        this._userService = _userService;
    }
    async getAllUsers(req, res, next) {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const search = req.query.search;
            const status = req.query.status;
            const result = await this._userService.getAllUsers(page, limit, search, status);
            (0, api_success_1.sendSuccess)(res, result, "Users retrieved successfully");
        }
        catch (error) {
            next(error);
        }
    }
    async getUserById(req, res, next) {
        try {
            const { id } = req.params;
            const isAdmin = req.user?.role === 'admin';
            const user = isAdmin
                ? await this._userService.getUserById({ userId: id })
                : await this._userService.getActiveUserById({ userId: id });
            const kyc = await mongoose_1.default.model('Kyc').findOne({ user: id });
            (0, api_success_1.sendSuccess)(res, { ...user?.toObject(), kycData: kyc }, "User retrieved successfully");
        }
        catch (error) {
            next(error);
        }
    }
    async getLoginLogs(req, res, next) {
        try {
            const { userId } = req.params;
            const limit = parseInt(req.query.limit) || 10;
            const logs = await this._userService.getLoginLogs(userId, limit);
            (0, api_success_1.sendSuccess)(res, logs, "Login logs retrieved successfully");
        }
        catch (error) {
            next(error);
        }
    }
    async updateUserStatus(req, res, next) {
        try {
            const { id } = req.params;
            const { status } = req.body;
            if (req.user?.userId === id && status === 'blocked') {
                throw new Error("You cannot block your own account");
            }
            const user = await this._userService.updateUserStatus(id, status);
            (0, api_success_1.sendSuccess)(res, user, `User status updated to ${status}`);
        }
        catch (error) {
            next(error);
        }
    }
    async updateLocation(req, res, next) {
        try {
            const userId = req.user.userId;
            const { lat, lng, address, city, state } = req.body;
            const user = await mongoose_1.default.model('User').findByIdAndUpdate(userId, { location: { lat, lng, address, city, state } }, { new: true });
            (0, api_success_1.sendSuccess)(res, user, "Location updated successfully");
        }
        catch (error) {
            next(error);
        }
    }
}
exports.UserController = UserController;
