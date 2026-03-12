import { NextFunction, Request, Response } from "express";
import { IAuthService } from "./interface/auth.service.interface";
import { validateEmail, validateEmailOrPhone, validateFullName, validateOTP, validatePhone } from "../../shared/utility/validators/auth.validator";
import ApiError from "../../shared/utility/api.error";
import { sendSuccess } from "../../shared/utility/api.success";
import { verifyAuthToken, verifyToken } from "../../shared/utility/token.utility";
import { Roles } from "../user/types";

export class AuthController {
    constructor(
        private _authService: IAuthService
    ) { }

    private async _setTokens({ res, accessToken, refreshToken }: { res: Response, accessToken: string, refreshToken: string }) {
        res.cookie('accesstoken', accessToken,
            { maxAge: Number(process.env.JWT_ACCESS_EXPIRATION_MIN) * 60 * 1000 }
        );
        res.cookie('refresh', accessToken,
            { maxAge: Number(process.env.JWT_REFRESH_EXPIRATION_DAY) * 24 * 60 * 60 * 1000 }
        );
    }

    private async _setAuthToken({ res, token }: { res: Response, token: string }) {
        res.cookie('authToken', token,
            { maxAge: Number(process.env.JWT_ACCESS_EXPIRATION_MIN) * 60 * 1000 }
        );
    }

    async login(req: Request, res: Response, next: NextFunction) {
        try {
            const { identifier } = req.body
            validateEmailOrPhone(identifier)

            const token = await this._authService.login(identifier)
            await this._setAuthToken({ res, token: token.authToken });

            sendSuccess(res, { identifier }, 'OTP sented successfully')


        } catch (error) {
            next(error)
        }

    }

    async signup(req: Request, res: Response, next: NextFunction) {
        try {
            const { email, name, phone } = req.body
            validateFullName(name)
            validateEmail(email)
            validatePhone(phone)

            const result = await this._authService.signup({ email, name, phone });

            await this._setAuthToken({ res, token: result.authToken });
            sendSuccess(res, result.resendOtpInSeconds, 'OTP sented successfully')

        } catch (error) {
            next(error)
        }

    }

    async verifySignup(req: Request, res: Response, next: NextFunction) {
        try {
            const { otp } = req.body;
            const signupToken = req.cookies?.authToken;

            validateOTP(otp);

            const tokenPayload = verifyAuthToken(signupToken);
            if (!tokenPayload) throw new ApiError('Session invalid')

            const result = await this._authService.verifySignup({
                otp,
                email: tokenPayload.email!,
                otpId: tokenPayload.otpId!,
                name: tokenPayload.name!,
                phone: tokenPayload.phone!,
            })

            res.clearCookie('authToken');
            await this._setTokens({ res, accessToken: result.accessToken, refreshToken: result.refreshToken });
            sendSuccess(res, {
                name: tokenPayload.name!,
                email: tokenPayload.email!,
                phone: tokenPayload.phone!,
                role: result.role
            }, 'Signup successful')


        } catch (error) {
            next(error)
        }
    }

    async verifyLogin(req: Request, res: Response, next: NextFunction) {
        try {
            const { otp } = req.body;
            validateOTP(otp);

            const signupToken = req.cookies?.authToken;
            const tokenPayload = verifyAuthToken(signupToken);
            if (!tokenPayload) throw new ApiError('Session invalid')

            const result = await this._authService.verifyLogin({ otp, email: tokenPayload.email!, otpId: tokenPayload.otpId! });

            res.clearCookie('authToken');
            await this._setTokens({ res, accessToken: result.accessToken, refreshToken: result.refreshToken });

            sendSuccess(res, {
                name: tokenPayload.name!,
                email: tokenPayload.email!,
                phone: tokenPayload.phone!,
                role: result.role
            }, 'Login successful')

        } catch (error) {
            next(error)
        }
    }

    async loginResend(req: Request, res: Response, next: NextFunction) {
        try {
            const token = req.cookies?.authToken;
            const payload = verifyAuthToken(token);
            if (!payload) throw new ApiError('Session invalid Try again');

            const res = await this._authService.loginResend({ email: payload.email!, otpId: payload.otpId! });

            sendSuccess(res, { email: payload.email}, 'OTP sented successfully')

        } catch (error) {
            next(error)
        }
    }

    async signupResend(req: Request, res: Response, next: NextFunction) {
        try {
            const token = req.cookies?.authToken;
            const tokenPayload = verifyAuthToken(token);
            if (!tokenPayload) throw new ApiError('Session invalid Try again');

            await this._authService.signupResend({ email: tokenPayload.email!, otpId: tokenPayload.otpId });

        } catch (error) {
            next(error)
        }
    }
} 