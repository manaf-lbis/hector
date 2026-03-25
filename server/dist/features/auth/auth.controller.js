"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const auth_validator_1 = require("../../shared/utility/validators/auth.validator");
const api_error_1 = __importDefault(require("../../shared/utility/api.error"));
const api_success_1 = require("../../shared/utility/api.success");
const token_utility_1 = require("../../shared/utility/token.utility");
class AuthController {
    constructor(_authService) {
        this._authService = _authService;
    }
    async _setTokens({ res, accessToken, refreshToken }) {
        res.cookie('accesstoken', accessToken, { maxAge: Number(process.env.JWT_ACCESS_EXPIRATION_MIN) * 60 * 1000 });
        res.cookie('refresh', refreshToken, { maxAge: Number(process.env.JWT_REFRESH_EXPIRATION_DAY) * 24 * 60 * 60 * 1000 });
    }
    async _setAuthToken({ res, token }) {
        res.cookie('authToken', token, { maxAge: Number(process.env.JWT_ACCESS_EXPIRATION_MIN) * 60 * 1000 });
    }
    async login(req, res, next) {
        try {
            const { identifier } = req.body;
            (0, auth_validator_1.validateEmailOrPhone)(identifier);
            const token = await this._authService.login(identifier);
            await this._setAuthToken({ res, token: token.authToken });
            (0, api_success_1.sendSuccess)(res, { identifier }, 'OTP sented successfully');
        }
        catch (error) {
            next(error);
        }
    }
    async signup(req, res, next) {
        try {
            const { email, name, phone } = req.body;
            (0, auth_validator_1.validateFullName)(name);
            (0, auth_validator_1.validateEmail)(email);
            (0, auth_validator_1.validatePhone)(phone);
            const result = await this._authService.signup({ email, name, phone });
            await this._setAuthToken({ res, token: result.authToken });
            (0, api_success_1.sendSuccess)(res, result.resendOtpInSeconds, 'OTP sented successfully');
        }
        catch (error) {
            next(error);
        }
    }
    async verifySignup(req, res, next) {
        try {
            const { otp } = req.body;
            const signupToken = req.cookies?.authToken;
            (0, auth_validator_1.validateOTP)(otp);
            const tokenPayload = (0, token_utility_1.verifyAuthToken)(signupToken);
            if (!tokenPayload)
                throw new api_error_1.default('Session invalid');
            const result = await this._authService.verifySignup({
                otp,
                email: tokenPayload.email,
                otpId: tokenPayload.otpId,
                name: tokenPayload.name,
                phone: tokenPayload.phone,
                ip: req.ip,
                userAgent: req.headers['user-agent']
            });
            res.clearCookie('authToken');
            await this._setTokens({ res, accessToken: result.accessToken, refreshToken: result.refreshToken });
            (0, api_success_1.sendSuccess)(res, {
                name: tokenPayload.name,
                email: tokenPayload.email,
                phone: tokenPayload.phone,
                role: result.role
            }, 'Signup successful');
        }
        catch (error) {
            next(error);
        }
    }
    async verifyLogin(req, res, next) {
        try {
            const { otp } = req.body;
            (0, auth_validator_1.validateOTP)(otp);
            const signupToken = req.cookies?.authToken;
            const tokenPayload = (0, token_utility_1.verifyAuthToken)(signupToken);
            if (!tokenPayload)
                throw new api_error_1.default('Session invalid');
            const result = await this._authService.verifyLogin({
                otp,
                email: tokenPayload.email,
                otpId: tokenPayload.otpId,
                ip: req.ip,
                userAgent: req.headers['user-agent']
            });
            res.clearCookie('authToken');
            await this._setTokens({ res, accessToken: result.accessToken, refreshToken: result.refreshToken });
            (0, api_success_1.sendSuccess)(res, {
                name: tokenPayload.name,
                email: tokenPayload.email,
                phone: tokenPayload.phone,
                role: result.role
            }, 'Login successful');
        }
        catch (error) {
            next(error);
        }
    }
    async loginResend(req, res, next) {
        try {
            const token = req.cookies?.authToken;
            const payload = (0, token_utility_1.verifyAuthToken)(token);
            if (!payload)
                throw new api_error_1.default('Session invalid Try again');
            const result = await this._authService.loginResend({ email: payload.email, otpId: payload.otpId });
            (0, api_success_1.sendSuccess)(res, result.resendOtpInSeconds, 'OTP sented successfully');
        }
        catch (error) {
            next(error);
        }
    }
    async signupResend(req, res, next) {
        try {
            const token = req.cookies?.authToken;
            const tokenPayload = (0, token_utility_1.verifyAuthToken)(token);
            if (!tokenPayload)
                throw new api_error_1.default('Session invalid Try again');
            const result = await this._authService.signupResend({ email: tokenPayload.email, otpId: tokenPayload.otpId });
            (0, api_success_1.sendSuccess)(res, result.resendOtpInSeconds, 'OTP sented successfully');
        }
        catch (error) {
            next(error);
        }
    }
    async refreshToken(req, res, next) {
        try {
            const token = req.cookies?.refresh;
            if (!token)
                throw new api_error_1.default('No refresh token provided', 401);
            const result = await this._authService.refreshToken(token);
            await this._setTokens({ res, accessToken: result.accessToken, refreshToken: result.refreshToken });
            (0, api_success_1.sendSuccess)(res, { role: result.role }, 'Token refreshed successfully');
        }
        catch (error) {
            next(error);
        }
    }
    async logout(req, res, next) {
        try {
            const user = req.user;
            await this._authService.logout(user.userId);
            res.clearCookie('accesstoken');
            res.clearCookie('refresh');
            (0, api_success_1.sendSuccess)(res, null, 'Logout successful');
        }
        catch (error) {
            next(error);
        }
    }
    async getMe(req, res, next) {
        try {
            const userPayload = req.user;
            const user = await this._authService.getMe(userPayload.userId);
            (0, api_success_1.sendSuccess)(res, user, 'User data fetched successfully');
        }
        catch (error) {
            next(error);
        }
    }
}
exports.AuthController = AuthController;
