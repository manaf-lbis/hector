"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendSuccess = void 0;
const http_status_enums_1 = require("../constants/http.status.enums");
const sendSuccess = (res, data, message = "Request successful", statusCode = http_status_enums_1.StatusCodes.OK) => {
    res.status(statusCode).json({
        success: true,
        message: message,
        data: data
    });
};
exports.sendSuccess = sendSuccess;
