import { Types } from "mongoose";
import ApiError from "../../shared/utility/api.error";
import { generateAuthToken, generateTokens, verifyRefreshToken } from "../../shared/utility/token.utility";
import { IOtpService } from "../otp/interface/otp.service.interface";
import { IUserService } from "../user/interface/user.services.interface";
import { Roles } from "../user/types";
import { IAuthService } from "./interface/auth.service.interface";
import { sendEmail } from "../../shared/configs/email.cilent.config";
import { welcomeTemplate } from "../../shared/templates/welcome.template";

export class AuthService implements IAuthService {
    private readonly _OTP_RESEND_SEC = Number(process.env.OTP_RESEND_SEC)
    constructor(
        private _userService: IUserService,
        private _otpService: IOtpService
    ) { }


    async login(identifier: string): Promise<{ authToken: string; }> {

        console.log(identifier);

        const user = await this._userService.findByIdentifier({ identifier });
        if (!user) throw new ApiError('user not found');
        if (user.status !== 'active') throw new ApiError('user is not Blocked')

        const result = await this._otpService.generateLoginOtp(user.email);



        const authToken = generateAuthToken({ otpId: result.otpId, email: user.email });

        return {
            authToken,
        }
    }

    async signup({ name, email, phone }: { name: string; email: string; phone: string; }): Promise<{ authToken: string, resendOtpInSeconds: number; }> {

        const user = await this._userService.checkUserExists({ email, phone })

        if (user) {
            if (user.email === email) throw new ApiError('user already exists with email please Login')
            if (user.phone === phone) throw new ApiError('user already exists with phone please Login')
        }

        const otpData = await this._otpService.generateSignupOtp(email)
        const authToken = generateAuthToken({ name, email, phone, otpId: otpData._id })

        return { authToken, resendOtpInSeconds: this._OTP_RESEND_SEC }
    }

    async verifySignup({ otp, name, email, phone, otpId, ip, userAgent }: { otp: string; name: string; email: string; phone: string; otpId: Types.ObjectId; ip?: string; userAgent?: string }): Promise<{ accessToken: string; refreshToken: string; role: Roles }> {

        await this._otpService.validateOtp({ otpId, submittedOtp: otp });
        const user = await this._userService.createUser({ name, email, phone, role: Roles.user });
        
        try {
            await sendEmail(user.email, "Welcome to Hector!", welcomeTemplate(user.name));
        } catch (error) {
            console.error("Failed to send welcome email:", error);
        }

        const tokens = generateTokens({ userId: user._id, role: user.role, name: user.name });

        await this._userService.updateUserToken({ userId: user._id, refreshToken: tokens.refreshToken });
        await this._userService.recordLogin(user._id, ip, userAgent);

        return {
            accessToken: tokens.accessToken,
            refreshToken: tokens.refreshToken,
            role: user.role
        }
    }

    async verifyLogin({ otp, email, otpId, ip, userAgent }: { otp: string; email: string; otpId: Types.ObjectId; ip?: string; userAgent?: string }): Promise<{ accessToken: string; role: Roles, refreshToken: string }> {

        await this._otpService.validateOtp({ otpId, submittedOtp: otp });
        console.log(email);

        const user = await this._userService.findByIdentifier({ identifier: email });

        if (!user) throw new ApiError('user not found')

        const tokens = generateTokens({ userId: user._id, role: user.role, name: user.name });
        await this._userService.updateUserToken({ userId: user._id, refreshToken: tokens.refreshToken });
        await this._userService.recordLogin(user._id, ip, userAgent);


        return {
            accessToken: tokens.accessToken,
            refreshToken: tokens.refreshToken,
            role: user.role
        }

    }

    async loginResend({ email, otpId }: { email: string; otpId: Types.ObjectId; }): Promise<{ resendOtpInSeconds: number; }> {
        return await this._otpService.reGenerateOtp({ email, otpId });
    }

    async signupResend({ email, otpId }: { email: string; otpId: Types.ObjectId; }): Promise<{ resendOtpInSeconds: number; }> {
        return await this._otpService.reGenerateOtp({ email, otpId });
    }

    async refreshToken(token: string): Promise<{ accessToken: string, refreshToken: string, role: string }> {
        const payload = verifyRefreshToken(token);
        if (!payload) throw new ApiError('Invalid or expired refresh token', 401);

        const user = await this._userService.getActiveUserById({ userId: payload.userId });
        if (!user || user.refreshToken !== token) {
            throw new ApiError('Invalid refresh token', 401);
        }

        const tokens = generateTokens({ userId: user._id, role: user.role, name: user.name });
        await this._userService.updateUserToken({ userId: user._id, refreshToken: tokens.refreshToken });

        return {
            accessToken: tokens.accessToken,
            refreshToken: tokens.refreshToken,
            role: user.role
        };
    }

    async logout(userId: Types.ObjectId): Promise<void> {
        await this._userService.updateUserToken({ userId, refreshToken: "" });
    }

    async getMe(userId: Types.ObjectId): Promise<{ name: string, email: string, phone: string, role: Roles, kycStatus?: string, kycData?: any, location?: any }> {
        const user = await this._userService.getActiveUserById({ userId });
        if (!user) throw new ApiError('User not found', 404);

        let kycStatus = undefined;
        let kycData = undefined;

        try {
            const mongoose = require('mongoose');
            const kyc = await mongoose.model('Kyc').findOne({ user: userId }).select('kycStatus profilePicture');
            if (kyc) {
                kycStatus = kyc.kycStatus;
                kycData = { profilePicture: kyc.profilePicture };
            }
        } catch (error) {
            console.error('Error fetching KYC for /me', error);
        }

        return {
            name: user.name,
            email: user.email,
            phone: user.phone,
            role: user.role as Roles,
            kycStatus,
            kycData,
            location: user.location
        };
    }
}