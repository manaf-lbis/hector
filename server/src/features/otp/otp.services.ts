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

    private async generateOtpHash(email: string): Promise<{ rawOtp: string, otpHash: string }> {
        const rawOtp = generateOTP();
        console.log(`-----------------------------------`);
        console.log(`OTP generated for: ${email}`);
        console.log(`Action: OTP Generation`);
        console.log(`OTP: ${rawOtp}`);
        console.log(`-----------------------------------`);
        const otpHash = await createHash(rawOtp);
        return { rawOtp, otpHash };
    }

    async generateLoginOtp(email: string): Promise<{ otpId: Types.ObjectId, resendOtpInSeconds: number }> {
        const isExist = await this._otpRepo.findOne({ email, purpose: OtpPurpose.login });
        const now = new Date();

        if (isExist && isAfter(isExist.windowExpiresAt, now)) {
            const secondsSinceUpdate = differenceInSeconds(now, isExist.updatedAt);
            const resendLimit = Number(process.env.OTP_RESEND_SEC) || 60;
            const maxResend = Number(process.env.MAX_OTP_RESEND_COUNT) || 3;

            if (secondsSinceUpdate < resendLimit) {
                throw new ApiError(`Please wait ${resendLimit - secondsSinceUpdate}s before requesting a new code.`, 400);
            }

            if (isExist.resendCount >= maxResend) {
                const timeRemaining = formatDistanceToNow(isExist.windowExpiresAt);
                throw new ApiError(`Maximum resend attempts reached for this session. Please try again ${timeRemaining}.`, 400);
            }
        }

        const { otpHash } = await this.generateOtpHash(email);
        const windowDuration = 15 * 60 * 1000;
        const codeDuration = Number(process.env.OTP_EXPIRY_SEC) * 1000;

        const otpData = await this._otpRepo.upsert(
            { email, purpose: OtpPurpose.login },
            {
                otpHash,
                attempts: 0,
                resendCount: isExist && isAfter(isExist.windowExpiresAt, now) ? isExist.resendCount + 1 : 0,
                resendedAt: now,
                expiresAt: new Date(now.getTime() + codeDuration),
                windowExpiresAt: isExist && isAfter(isExist.windowExpiresAt, now) ? isExist.windowExpiresAt : new Date(now.getTime() + windowDuration),
            }
        );

        return { resendOtpInSeconds: 60, otpId: otpData._id };
    }

    async generateSignupOtp(email: string): Promise<IOtp> {
        const isExist = await this._otpRepo.findOne({ email, purpose: OtpPurpose.signup });
        const now = new Date();

        if (isExist && isAfter(isExist.windowExpiresAt, now)) {
            if (isAfter(isExist.expiresAt, now)) {
                const timeRemaining = formatDistanceToNow(isExist.expiresAt);
                const secondsLeft = differenceInSeconds(isExist.expiresAt, now);
                throw new ApiError(
                    `Active session found. Please try again in ${timeRemaining} (${secondsLeft}s).`,
                    400
                );
            }
        }

        const { otpHash } = await this.generateOtpHash(email);
        const windowDuration = 15 * 60 * 1000;
        const codeDuration = Number(process.env.OTP_EXPIRY_SEC) * 1000;

        return await this._otpRepo.create({
            email,
            otpHash,
            purpose: OtpPurpose.signup,
            expiresAt: new Date(now.getTime() + codeDuration),
            windowExpiresAt: isExist && isAfter(isExist.windowExpiresAt, now) ? isExist.windowExpiresAt : new Date(now.getTime() + windowDuration)
        });
    }

    async validateOtp({ otpId, submittedOtp }: { otpId: Types.ObjectId, submittedOtp: string }): Promise<boolean> {
        const otpRecord = await this._otpRepo.findOne({ _id: otpId });
        const now = new Date();

        if (!otpRecord || isAfter(now, otpRecord.expiresAt)) {
            throw new ApiError("OTP expired or invalid session", 400);
        }

        const maxAttempts = Number(process.env.MAX_OTP_ATTEMPTS) || 3;
        if (otpRecord.attempts >= maxAttempts) {
            throw new ApiError("Too many attempts for this code. Please resend a new OTP.", 400);
        }

        const isMatch = await compareHash(submittedOtp, otpRecord.otpHash);

        if (!isMatch) {
            otpRecord.attempts += 1;
            await otpRecord.save();
            const attemptsLeft = maxAttempts - otpRecord.attempts;
            if (attemptsLeft <= 0) {
                throw new ApiError("Too many incorrect attempts. Please request a new OTP.", 400);
            }
            throw new ApiError(`Invalid OTP. ${attemptsLeft} attempts remaining.`, 400);
        }

        await this._otpRepo.delete(otpRecord._id);
        return true;
    }

    async getOtp(id: Types.ObjectId): Promise<IOtp | null> {
        return await this._otpRepo.findById(id);
    }

    async reGenerateOtp({ email, otpId }: { email: string; otpId: Types.ObjectId; }): Promise<{ resendOtpInSeconds: number; }> {
        const isExist = await this._otpRepo.findOne({ _id: otpId, email });
        const now = new Date();

        if (!isExist || isAfter(now, isExist.windowExpiresAt)) {
            throw new ApiError("Session expired or invalid. Please start over.", 400);
        }

        const resendLimitSec = Number(process.env.OTP_RESEND_SEC) || 60;
        const secondsPassed = differenceInSeconds(now, isExist.resendedAt);

        if (secondsPassed < resendLimitSec) {
            const waitTime = resendLimitSec - secondsPassed;
            throw new ApiError(`Please wait ${waitTime}s before requesting a new code.`, 400);
        }

        const maxResend = Number(process.env.MAX_OTP_RESEND_COUNT) || 3;

        if (isExist.resendCount >= maxResend) {
            const timeRemaining = formatDistanceToNow(isExist.windowExpiresAt);
            throw new ApiError(`Maximum resend attempts reached for this session. Please try again ${timeRemaining}.`, 400);
        }

        const { otpHash } = await this.generateOtpHash(email);
        const codeDuration = Number(process.env.OTP_EXPIRY_SEC) * 1000;

        isExist.resendCount += 1;
        isExist.attempts = 0;
        isExist.expiresAt = new Date(now.getTime() + codeDuration);
        isExist.resendedAt = now;
        isExist.otpHash = otpHash;

        await isExist.save();
        return { resendOtpInSeconds: 60 };
    }



}