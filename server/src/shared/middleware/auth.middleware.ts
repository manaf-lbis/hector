import { NextFunction, Request, Response } from "express";
import { verifyToken } from "../utility/token.utility";
import ApiError from "../utility/api.error";
import { Roles } from "../../features/user/types";

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.cookies?.accesstoken;
        if (!token) {
            throw new ApiError("Authentication required", 401);
        }

        const decoded = verifyToken(token);
        if (!decoded) {
            throw new ApiError("Invalid or expired session", 401);
        }

        req.user = {
            userId: decoded.userId,
            role: decoded.role! as Roles,
            email: decoded.email,
            phone: decoded.phone
        };
        next();
    } catch (error) {
        next(error);
    }
};

export const roleMiddleware = (roles: Roles[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        try {
            const user = req.user;
            if (!user || !roles.includes(user.role)) {
                throw new ApiError("Access denied", 403);
            }
            next();
        } catch (error) {
            next(error);
        }
    };
};
