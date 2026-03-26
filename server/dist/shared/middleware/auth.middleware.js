"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.roleMiddleware = exports.authMiddleware = void 0;
const token_utility_1 = require("../utility/token.utility");
const api_error_1 = __importDefault(require("../utility/api.error"));
const authMiddleware = (req, res, next) => {
    try {
        const token = req.cookies?.accesstoken;
        console.log(`[AUTH_MIDDLEWARE] Request Path: ${req.path}`);
        console.log(`[AUTH_MIDDLEWARE] Cookie present: ${!!token}`);
        if (!token) {
            console.error(`[AUTH_MIDDLEWARE] Missing accesstoken cookie. Available cookies:`, Object.keys(req.cookies || {}));
            throw new api_error_1.default("Authentication required", 401);
        }
        const decoded = (0, token_utility_1.verifyToken)(token);
        if (!decoded) {
            console.error(`[AUTH_MIDDLEWARE] Token verification failed`);
            throw new api_error_1.default("Invalid or expired session", 401);
        }
        req.user = {
            userId: decoded.userId,
            role: decoded.role,
            email: decoded.email,
            phone: decoded.phone,
            name: decoded.name
        };
        next();
    }
    catch (error) {
        next(error);
    }
};
exports.authMiddleware = authMiddleware;
const roleMiddleware = (roles) => {
    return (req, res, next) => {
        try {
            const user = req.user;
            if (!user || !roles.includes(user.role)) {
                throw new api_error_1.default("Access denied", 403);
            }
            next();
        }
        catch (error) {
            next(error);
        }
    };
};
exports.roleMiddleware = roleMiddleware;
