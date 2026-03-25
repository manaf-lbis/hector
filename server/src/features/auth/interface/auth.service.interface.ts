import { Types } from "mongoose";
import { Roles } from "../../user/types";


export interface IAuthService {
    login(identifier: string): Promise<{ authToken: string }>;
    signup({ name, email, phone }: { name: string, email: string, phone: string }): Promise<{ authToken: string, resendOtpInSeconds: number }>;
    verifySignup({ otp, name, email, phone, otpId, ip, userAgent }: { otp: string; name: string; email: string; phone: string; otpId: Types.ObjectId, ip?: string, userAgent?: string }): Promise<{ accessToken: string, refreshToken: string, role: Roles }>
    verifyLogin({ otp, email, otpId, ip, userAgent }: { otp: string; email: string; otpId: Types.ObjectId, ip?: string, userAgent?: string }): Promise<{ accessToken: string, refreshToken: string, role: Roles }>
    loginResend({ email, otpId }: { email: string; otpId: Types.ObjectId }): Promise<{ resendOtpInSeconds: number }>
    signupResend({ email, otpId }: { email: string; otpId: Types.ObjectId }): Promise<{ resendOtpInSeconds: number }>
    refreshToken(token: string): Promise<{ accessToken: string, refreshToken: string, role: string }>
    logout(userId: Types.ObjectId): Promise<void>
    getMe(userId: Types.ObjectId): Promise<{ name: string, email: string, phone: string, role: Roles }>
}