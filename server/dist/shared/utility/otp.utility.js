"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateOTP = void 0;
const api_error_1 = __importDefault(require("./api.error"));
const generateOTP = (length = 6) => {
    if (length < 4 || length > 10) {
        throw new api_error_1.default("OTP length should be between 4 and 10 digits");
    }
    const digits = "0123456789";
    let otp = "";
    for (let i = 0; i < length; i++) {
        otp += digits[Math.floor(Math.random() * 10)];
    }
    return otp;
};
exports.generateOTP = generateOTP;
