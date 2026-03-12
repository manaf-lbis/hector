import { Types } from "mongoose";
import { Roles } from "../../user/types";


export interface IAuthService {
    login(identifier: string): Promise<{authToken: string}>;
    signup({ name, email, phone }: { name: string, email: string, phone: string }): Promise<{ authToken: string, resendOtpInSeconds: number }>;
    verifySignup({otp, name, email, phone, otpId }: { otp:string; name: string; email: string; phone: string; otpId: Types.ObjectId }): Promise<{ accessToken: string,refreshToken: string,role: Roles }>
    verifyLogin({otp, email, otpId }: { otp:string; email: string; otpId: Types.ObjectId }): Promise<{ accessToken: string,refreshToken: string,role: Roles }>
    loginResend({email,otpId}: { email: string; otpId: Types.ObjectId }): Promise<void>
    signupResend({email,otpId}: { email: string; otpId: Types.ObjectId }): Promise<void>
}