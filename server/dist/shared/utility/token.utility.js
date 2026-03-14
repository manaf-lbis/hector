"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = exports.verifyAuthToken = exports.verifyRefreshToken = exports.generateAuthToken = exports.generateTokens = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const api_error_1 = __importDefault(require("./api.error"));
const generateTokens = (payload) => {
    const accessSecret = process.env.JWT_ACCESS_SECRET;
    const refreshSecret = process.env.JWT_REFRESH_SECRET;
    if (!accessSecret || !refreshSecret) {
        throw new api_error_1.default("Token generation failed");
    }
    const accessToken = jsonwebtoken_1.default.sign(payload, accessSecret, {
        expiresIn: '15m',
    });
    const refreshToken = jsonwebtoken_1.default.sign(payload, refreshSecret, {
        expiresIn: '7d',
    });
    return { accessToken, refreshToken };
};
exports.generateTokens = generateTokens;
const generateAuthToken = (payload) => {
    const accessSecret = process.env.JWT_ACCESS_SECRET;
    if (!accessSecret)
        throw new api_error_1.default("Token validation failed");
    return jsonwebtoken_1.default.sign(payload, accessSecret, {
        expiresIn: '15m',
    });
};
exports.generateAuthToken = generateAuthToken;
const verifyRefreshToken = (token) => {
    try {
        const key = process.env.JWT_REFRESH_SECRET;
        if (!key)
            throw new api_error_1.default("Token validation failed", 500);
        return jsonwebtoken_1.default.verify(token, key);
    }
    catch (err) {
        return null;
    }
};
exports.verifyRefreshToken = verifyRefreshToken;
const verifyAuthToken = (token) => {
    try {
        const key = process.env.JWT_ACCESS_SECRET;
        if (!key)
            throw new api_error_1.default("Token validation failed", 500);
        return jsonwebtoken_1.default.verify(token, key);
    }
    catch (err) {
        return null;
    }
};
exports.verifyAuthToken = verifyAuthToken;
const verifyToken = (token, ignoreExpiration = false) => {
    try {
        const key = process.env.JWT_ACCESS_SECRET;
        if (!key)
            throw new api_error_1.default("Token validation failed", 500);
        return jsonwebtoken_1.default.verify(token, key, { ignoreExpiration });
    }
    catch (err) {
        return null;
    }
};
exports.verifyToken = verifyToken;
