"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const api_error_1 = __importDefault(require("../../shared/utility/api.error"));
const token_utility_1 = require("../../shared/utility/token.utility");
const types_1 = require("../user/types");
class AuthService {
    constructor(_userService, _otpService) {
        this._userService = _userService;
        this._otpService = _otpService;
        this._OTP_RESEND_SEC = Number(process.env.OTP_RESEND_SEC);
    }
    async login(identifier) {
        console.log(identifier);
        const user = await this._userService.findByIdentifier({ identifier });
        if (!user)
            throw new api_error_1.default('user not found');
        if (user.status !== 'active')
            throw new api_error_1.default('user is not Blocked');
        const result = await this._otpService.generateLoginOtp(user.email);
        const authToken = (0, token_utility_1.generateAuthToken)({ otpId: result.otpId, email: user.email });
        return {
            authToken,
        };
    }
    async signup({ name, email, phone }) {
        const user = await this._userService.checkUserExists({ email, phone });
        if (user) {
            if (user.email === email)
                throw new api_error_1.default('user already exists with email please Login');
            if (user.phone === phone)
                throw new api_error_1.default('user already exists with phone please Login');
        }
        const otpData = await this._otpService.generateSignupOtp(email);
        const authToken = (0, token_utility_1.generateAuthToken)({ name, email, phone, otpId: otpData._id });
        return { authToken, resendOtpInSeconds: this._OTP_RESEND_SEC };
    }
    async verifySignup({ otp, name, email, phone, otpId }) {
        await this._otpService.validateOtp({ otpId, submittedOtp: otp });
        const user = await this._userService.createUser({ name, email, phone, role: types_1.Roles.user });
        const tokens = (0, token_utility_1.generateTokens)({ userId: user._id, role: user.role });
        await this._userService.updateUserToken({ userId: user._id, refreshToken: tokens.refreshToken });
        return {
            accessToken: tokens.accessToken,
            refreshToken: tokens.refreshToken,
            role: user.role
        };
    }
    async verifyLogin({ otp, email, otpId }) {
        await this._otpService.validateOtp({ otpId, submittedOtp: otp });
        console.log(email);
        const user = await this._userService.findByIdentifier({ identifier: email });
        if (!user)
            throw new api_error_1.default('user not found');
        const tokens = (0, token_utility_1.generateTokens)({ userId: user._id, role: user.role });
        await this._userService.updateUserToken({ userId: user._id, refreshToken: tokens.refreshToken });
        return {
            accessToken: tokens.accessToken,
            refreshToken: tokens.refreshToken,
            role: user.role
        };
    }
    async loginResend({ email, otpId }) {
        return await this._otpService.reGenerateOtp({ email, otpId });
    }
    async signupResend({ email, otpId }) {
        return await this._otpService.reGenerateOtp({ email, otpId });
    }
    async refreshToken(token) {
        const payload = (0, token_utility_1.verifyRefreshToken)(token);
        if (!payload)
            throw new api_error_1.default('Invalid or expired refresh token', 401);
        const user = await this._userService.getActiveUserById({ userId: payload.userId });
        if (!user || user.refreshToken !== token) {
            throw new api_error_1.default('Invalid refresh token', 401);
        }
        const tokens = (0, token_utility_1.generateTokens)({ userId: user._id, role: user.role });
        await this._userService.updateUserToken({ userId: user._id, refreshToken: tokens.refreshToken });
        return {
            accessToken: tokens.accessToken,
            refreshToken: tokens.refreshToken,
            role: user.role
        };
    }
    async logout(userId) {
        await this._userService.updateUserToken({ userId, refreshToken: "" });
    }
    async getMe(userId) {
        const user = await this._userService.getActiveUserById({ userId });
        if (!user)
            throw new api_error_1.default('User not found', 404);
        return {
            name: user.name,
            email: user.email,
            phone: user.phone,
            role: user.role
        };
    }
}
exports.AuthService = AuthService;
