"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateOTP = exports.validateEmailOrPhone = exports.validatePhone = exports.validateEmail = exports.validateFullName = void 0;
const api_error_1 = __importDefault(require("../api.error"));
const validateFullName = (value) => {
    const trimmed = value.trim();
    if (!trimmed) {
        throw new api_error_1.default("Full name is required", 400);
    }
    if (trimmed.length < 2) {
        throw new api_error_1.default("Name is too short (minimum 2 characters)", 400);
    }
    if (trimmed.length > 50) {
        throw new api_error_1.default("Name is too long (maximum 50 characters)", 400);
    }
    if (!/^[a-zA-Z\s'-]+$/.test(trimmed)) {
        throw new api_error_1.default("Name can only contain letters, spaces, hyphens and apostrophes", 400);
    }
};
exports.validateFullName = validateFullName;
const validateEmail = (value) => {
    const trimmed = value.trim();
    if (!trimmed) {
        throw new api_error_1.default("Email is required", 400);
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmed)) {
        throw new api_error_1.default("Please enter a valid email address", 400);
    }
    if (trimmed.length > 254) {
        throw new api_error_1.default("Email is too long", 400);
    }
};
exports.validateEmail = validateEmail;
const validatePhone = (value) => {
    const trimmed = value.trim();
    if (!trimmed) {
        throw new api_error_1.default("Phone number is required", 400);
    }
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(trimmed)) {
        throw new api_error_1.default("Enter a valid 10-digit Indian phone number starting with 6-9", 400);
    }
};
exports.validatePhone = validatePhone;
const validateEmailOrPhone = (value) => {
    const trimmed = value.trim();
    if (!trimmed) {
        throw new api_error_1.default("Email or phone number is required", 400);
    }
    if (trimmed.includes("@")) {
        (0, exports.validateEmail)(trimmed);
    }
    else {
        (0, exports.validatePhone)(trimmed);
    }
};
exports.validateEmailOrPhone = validateEmailOrPhone;
const validateOTP = (value) => {
    if (value.length === 0) {
        throw new api_error_1.default("Please enter the OTP code", 400);
    }
    if (value.length !== 6) {
        throw new api_error_1.default("OTP must be exactly 6 digits", 400);
    }
    if (!/^\d{6}$/.test(value)) {
        throw new api_error_1.default("OTP must contain only numbers", 400);
    }
};
exports.validateOTP = validateOTP;
