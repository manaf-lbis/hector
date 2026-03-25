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
            const result = await this._userService.getAllUsers(page, limit);
            (0, api_success_1.sendSuccess)(res, result, "Users retrieved successfully");
        }
        catch (error) {
            next(error);
        }
    }
    async getUserById(req, res, next) {
        try {
            const { id } = req.params;
            const user = await this._userService.getActiveUserById({ userId: id });
            // Populate KYC manually if repository doesn't do it
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
}
exports.UserController = UserController;
