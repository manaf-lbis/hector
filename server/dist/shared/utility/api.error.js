"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const http_status_enums_1 = require("../constants/http.status.enums");
class ApiError extends Error {
    constructor(message, statusCode = http_status_enums_1.StatusCodes.INTERNAL_SERVER_ERROR, errorData) {
        super(message);
        this.statusCode = statusCode;
        this.success = false;
        this.message = message;
        this.error = errorData;
    }
}
exports.default = ApiError;
