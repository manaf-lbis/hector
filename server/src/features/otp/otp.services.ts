import ApiError from "../../shared/utility/api.error";
import { addSeconds, differenceInSeconds, formatDistanceToNow, isAfter } from 'date-fns';
import { compareHash, createHash } from "../../shared/utility/hashing.utility";
import { generateOTP } from "../../shared/utility/otp.utility";
import { IOtpRepo } from "./interface/otp.repo.interface";
import { IOtpService } from "./interface/otp.service.interface";
import { IOtp, OtpPurpose } from "./types";
import { Types } from "mongoose";

export class OtpService implements IOtpService {

    constructor(
        private _otpRepo: IOtpRepo
    ) { }

    private async generateOtpHash(): Promise<string> {
        const rawOtp = generateOTP();
        const otpHash = await createHash(rawOtp);
        return otpHash;
    }

    async generateLoginOtp(email: string): Promise<{ otpId: Types.ObjectId, resendOtpInSeconds: number }> {
        const isExist = await this._otpRepo.findOne({ identifier: email, purpose: OtpPurpose.login });


        if (isExist) {
            const now = new Date();

            if (isExist.attempts >= Number(process.env.MAX_OTP_ATTEMPTS)) {
                const timeWait = formatDistanceToNow(isExist.expiresAt);
                throw new ApiError(`Max attempts reached. Please try again in ${timeWait}.`, 400);
            }

            const secondsSinceUpdate = differenceInSeconds(now, isExist.updatedAt);
            if (secondsSinceUpdate < 60) {
                throw new ApiError(`Please wait ${60 - secondsSinceUpdate}s before requesting a new code.`, 400);
            }
        }

        const otpHash = await this.generateOtpHash()
        const expiresAt = addSeconds(new Date(), Number(process.env.OTP_EXPIRY_SEC));


        const otpData = await this._otpRepo.upsert(
            { email: email, purpose: OtpPurpose.login },
            {
                otpHash,
                attempts: 0,
                resendCount: (isExist?.resendCount || 0) + 1,
                expiresAt,
            }
        );

        return { resendOtpInSeconds: 60, otpId: otpData._id };
    }

    async generateSignupOtp(email: string): Promise<IOtp> {

        const isExist = await this._otpRepo.findOne({ email });

        if (isExist) {
            const now = new Date();

            if (isAfter(isExist.expiresAt, now)) {
                const timeRemaining = formatDistanceToNow(isExist.expiresAt);
                const secondsLeft = differenceInSeconds(isExist.expiresAt, now);
                throw new ApiError(
                    `Active session found. Please try again in ${timeRemaining} (${secondsLeft}s).`,
                    400
                );
            }

        }
        const otpHash = await this.generateOtpHash();

        return await this._otpRepo.create({
            email, otpHash, purpose: OtpPurpose.signup, expiresAt: new Date(Date.now() + Number(process.env.OTP_EXPIRY_SEC) * 1000)
        });

    }

    async validateOtp({ otpId, submittedOtp }: { otpId: Types.ObjectId, submittedOtp: string }): Promise<boolean> {

        const otpRecord = await this._otpRepo.findOne({ _id: otpId });

        if (!otpRecord) throw new ApiError("OTP expired", 400);

        if (otpRecord.attempts >= Number(process.env.MAX_OTP_ATTEMPTS)) {
            throw new ApiError("Too many attempts. Please request a new OTP.");
        }

        otpRecord.attempts += 1;

        const isMatch = await compareHash(submittedOtp, otpRecord.otpHash);


        if (!isMatch) {
            await otpRecord.save();
            throw new ApiError(`Invalid OTP. Attempts left: ${Number(process.env.MAX_OTP_ATTEMPTS) - otpRecord.attempts}`);
        }

        await this._otpRepo.delete(otpRecord._id)
        return true;
    }

    async getOtp(id: Types.ObjectId): Promise<IOtp | null> {
        return await this._otpRepo.findById(id);
    }

    async reGenerateOtp({ email, otpId }: { email: string; otpId: Types.ObjectId; }): Promise<{ resendOtpInSeconds: number; }> {

        console.log(otpId,email);
        
        const resendLimitSec = Number(process.env.OTP_RESEND_SEC)
        const isExist = await this._otpRepo.findOne({ _id: otpId, email });

        if (!isExist) {
            throw new ApiError("Session expired");
        }

        if (isExist && isExist.resendedAt) {
            const secondsPassed = differenceInSeconds(new Date(), new Date(isExist.resendedAt));
            if (secondsPassed < resendLimitSec) {
                const waitTime = resendLimitSec - secondsPassed;

                throw new ApiError(
                    `Please wait ${waitTime} more second${waitTime > 1 ? 's' : ''} before requesting a new OTP.`,
                    400
                );
            }
        }

        const otpHash = await this.generateOtpHash();
        if (isExist.resendCount >= Number(process.env.MAX_OTP_RESEND_COUNT)) throw new ApiError('Max resend count reached. Please try again later');

        isExist.resendCount += 1;
        isExist.attempts = 0;
        isExist.expiresAt = new Date(Date.now() + Number(process.env.OTP_EXPIRY_SEC) * 1000);
        isExist.otpHash = otpHash;
        await isExist.save();
        return { resendOtpInSeconds: 60 };
    }



}