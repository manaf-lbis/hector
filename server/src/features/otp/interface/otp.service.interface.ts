import { Types } from "mongoose"
import { IOtp } from "../types"

export interface IOtpService {
    generateSignupOtp(email: string): Promise<IOtp>
    generateLoginOtp(email: string): Promise<{ otpId : Types.ObjectId,resendOtpInSeconds: number }>
    validateOtp({otpId, submittedOtp}:{ otpId: Types.ObjectId, submittedOtp: string }): Promise<boolean>
    reGenerateOtp({email,otpId}:{email:string,otpId:Types.ObjectId}):Promise<{resendOtpInSeconds:number}>


}