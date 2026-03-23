import { NextFunction, Request, Response } from "express";
import mongoose, { Types } from "mongoose";
import { IUserService } from "./interface/user.services.interface";
import { sendSuccess } from "../../shared/utility/api.success";

export class UserController {
    constructor(private _userService: IUserService) { }

    async getAllUsers(req: Request, res: Response, next: NextFunction) {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 10;
            const search = req.query.search as string;
            const status = req.query.status as string;
            const result = await this._userService.getAllUsers(page, limit, search, status);
            sendSuccess(res, result, "Users retrieved successfully");
        } catch (error) {
            next(error);
        }
    }

    async getUserById(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const isAdmin = (req as any).user?.role === 'admin';
            const user = isAdmin
                ? await this._userService.getUserById({ userId: id as any })
                : await this._userService.getActiveUserById({ userId: id as any });

            const kyc = await mongoose.model('Kyc').findOne({ user: id });
            sendSuccess(res, { ...(user as any)?.toObject(), kycData: kyc }, "User retrieved successfully");
        } catch (error) {
            next(error);
        }
    }

    async getLoginLogs(req: Request, res: Response, next: NextFunction) {
        try {
            const { userId } = req.params;
            const limit = parseInt(req.query.limit as string) || 10;
            const logs = await this._userService.getLoginLogs(userId as any, limit as any);
            sendSuccess(res, logs, "Login logs retrieved successfully");
        } catch (error) {
            next(error);
        }
    }

    async updateUserStatus(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const { status } = req.body;

            if ((req as any).user?.userId === id && status === 'blocked') {
                throw new Error("You cannot block your own account");
            }

            const user = await this._userService.updateUserStatus(id, status);
            sendSuccess(res, user, `User status updated to ${status}`);
        } catch (error) {
            next(error);
        }
    }
}
