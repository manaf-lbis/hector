"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const api_error_1 = __importDefault(require("../utility/api.error"));
const errorHandler = (err, req, res, next) => {
    console.error(err.message);
    console.error(err.stack);
    if (err instanceof api_error_1.default) {
        res.status(err.statusCode).json({
            success: err.success,
            message: err.message,
            error: err.error
        });
    }
    else {
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: null
        });
    }
};
exports.errorHandler = errorHandler;
exports.default = exports.errorHandler;
