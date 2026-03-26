"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OtpService = void 0;
const api_error_1 = __importDefault(require("../../shared/utility/api.error"));
const date_fns_1 = require("date-fns");
const hashing_utility_1 = require("../../shared/utility/hashing.utility");
const otp_utility_1 = require("../../shared/utility/otp.utility");
const email_cilent_config_1 = require("../../shared/configs/email.cilent.config");
const otp_template_1 = require("../../shared/templates/otp.template");
const types_1 = require("./types");
class OtpService {
    constructor(_otpRepo) {
        this._otpRepo = _otpRepo;
    }
    async generateOtpHash(email) {
        const rawOtp = (0, otp_utility_1.generateOTP)();
        console.log(`-----------------------------------`);
        console.log(`OTP generated for: ${email}`);
        console.log(`Action: OTP Generation`);
        console.log(`OTP: ${rawOtp}`);
        console.log(`-----------------------------------`);
        const otpHash = await (0, hashing_utility_1.createHash)(rawOtp);
        return { rawOtp, otpHash };
    }
    async generateLoginOtp(email) {
        const isExist = await this._otpRepo.findOne({ email, purpose: types_1.OtpPurpose.login });
        const now = new Date();
        if (isExist && (0, date_fns_1.isAfter)(isExist.windowExpiresAt, now)) {
            const secondsSinceUpdate = (0, date_fns_1.differenceInSeconds)(now, isExist.updatedAt);
            const resendLimit = Number(process.env.OTP_RESEND_SEC) || 60;
            const maxResend = Number(process.env.MAX_OTP_RESEND_COUNT) || 3;
            if (secondsSinceUpdate < resendLimit) {
                throw new api_error_1.default(`Please wait ${resendLimit - secondsSinceUpdate}s before requesting a new code.`, 400);
            }
            if (isExist.resendCount >= maxResend) {
                const timeRemaining = (0, date_fns_1.formatDistanceToNow)(isExist.windowExpiresAt);
                throw new api_error_1.default(`Maximum resend attempts reached for this session. Please try again ${timeRemaining}.`, 400);
            }
        }
        const { rawOtp, otpHash } = await this.generateOtpHash(email);
        await (0, email_cilent_config_1.sendEmail)(email, "Your Hector Login Code", (0, otp_template_1.otpTemplate)(rawOtp));
        const windowDuration = 15 * 60 * 1000;
        const codeDuration = Number(process.env.OTP_EXPIRY_SEC) * 1000;
        const otpData = await this._otpRepo.upsert({ email, purpose: types_1.OtpPurpose.login }, {
            otpHash,
            attempts: 0,
            resendCount: isExist && (0, date_fns_1.isAfter)(isExist.windowExpiresAt, now) ? isExist.resendCount + 1 : 0,
            resendedAt: now,
            expiresAt: new Date(now.getTime() + codeDuration),
            windowExpiresAt: isExist && (0, date_fns_1.isAfter)(isExist.windowExpiresAt, now) ? isExist.windowExpiresAt : new Date(now.getTime() + windowDuration),
        });
        return { resendOtpInSeconds: 60, otpId: otpData._id };
    }
    async generateSignupOtp(email) {
        const isExist = await this._otpRepo.findOne({ email, purpose: types_1.OtpPurpose.signup });
        const now = new Date();
        if (isExist && (0, date_fns_1.isAfter)(isExist.windowExpiresAt, now)) {
            const secondsSinceUpdate = (0, date_fns_1.differenceInSeconds)(now, isExist.resendedAt);
            const resendLimit = Number(process.env.OTP_RESEND_SEC) || 60;
            const maxResend = Number(process.env.MAX_OTP_RESEND_COUNT) || 3;
            if (secondsSinceUpdate < resendLimit) {
                throw new api_error_1.default(`Please wait ${resendLimit - secondsSinceUpdate}s before requesting a new code.`, 400);
            }
            if (isExist.resendCount >= maxResend) {
                const timeRemaining = (0, date_fns_1.formatDistanceToNow)(isExist.windowExpiresAt);
                throw new api_error_1.default(`Maximum resend attempts reached for this session. Please try again ${timeRemaining}.`, 400);
            }
        }
        const { rawOtp, otpHash } = await this.generateOtpHash(email);
        await (0, email_cilent_config_1.sendEmail)(email, "Your Hector Signup Code", (0, otp_template_1.otpTemplate)(rawOtp));
        const windowDuration = 15 * 60 * 1000;
        const codeDuration = Number(process.env.OTP_EXPIRY_SEC) * 1000;
        const otpData = await this._otpRepo.upsert({ email, purpose: types_1.OtpPurpose.signup }, {
            otpHash,
            attempts: 0,
            resendCount: (isExist && (0, date_fns_1.isAfter)(isExist.windowExpiresAt, now)) ? isExist.resendCount + 1 : 0,
            resendedAt: now,
            expiresAt: new Date(now.getTime() + codeDuration),
            windowExpiresAt: (isExist && (0, date_fns_1.isAfter)(isExist.windowExpiresAt, now)) ? isExist.windowExpiresAt : new Date(now.getTime() + windowDuration),
        });
        return otpData;
    }
    async validateOtp({ otpId, submittedOtp }) {
        const otpRecord = await this._otpRepo.findOne({ _id: otpId });
        const now = new Date();
        if (!otpRecord || (0, date_fns_1.isAfter)(now, otpRecord.expiresAt)) {
            throw new api_error_1.default("OTP expired or invalid session", 400);
        }
        const maxAttempts = Number(process.env.MAX_OTP_ATTEMPTS) || 3;
        if (otpRecord.attempts >= maxAttempts) {
            throw new api_error_1.default("Too many attempts for this code. Please resend a new OTP.", 400);
        }
        const isMatch = await (0, hashing_utility_1.compareHash)(submittedOtp, otpRecord.otpHash);
        if (!isMatch) {
            otpRecord.attempts += 1;
            await otpRecord.save();
            const attemptsLeft = maxAttempts - otpRecord.attempts;
            if (attemptsLeft <= 0) {
                throw new api_error_1.default("Too many incorrect attempts. Please request a new OTP.", 400);
            }
            throw new api_error_1.default(`Invalid OTP. ${attemptsLeft} attempts remaining.`, 400);
        }
        await this._otpRepo.delete(otpRecord._id);
        return true;
    }
    async getOtp(id) {
        return await this._otpRepo.findById(id);
    }
    async reGenerateOtp({ email, otpId }) {
        const isExist = await this._otpRepo.findOne({ _id: otpId, email });
        const now = new Date();
        if (!isExist || (0, date_fns_1.isAfter)(now, isExist.windowExpiresAt)) {
            throw new api_error_1.default("Session expired or invalid. Please start over.", 400);
        }
        const resendLimitSec = Number(process.env.OTP_RESEND_SEC) || 60;
        const secondsPassed = (0, date_fns_1.differenceInSeconds)(now, isExist.resendedAt);
        if (secondsPassed < resendLimitSec) {
            const waitTime = resendLimitSec - secondsPassed;
            throw new api_error_1.default(`Please wait ${waitTime}s before requesting a new code.`, 400);
        }
        const maxResend = Number(process.env.MAX_OTP_RESEND_COUNT) || 3;
        if (isExist.resendCount >= maxResend) {
            const timeRemaining = (0, date_fns_1.formatDistanceToNow)(isExist.windowExpiresAt);
            throw new api_error_1.default(`Maximum resend attempts reached for this session. Please try again ${timeRemaining}.`, 400);
        }
        const { rawOtp, otpHash } = await this.generateOtpHash(email);
        await (0, email_cilent_config_1.sendEmail)(email, "Your Hector Verification Code", (0, otp_template_1.otpTemplate)(rawOtp));
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
exports.OtpService = OtpService;
