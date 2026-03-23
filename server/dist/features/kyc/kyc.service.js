"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.KycService = void 0;
const types_1 = require("./types");
const api_error_1 = __importDefault(require("../../shared/utility/api.error"));
class KycService {
    constructor(_kycRepo) {
        this._kycRepo = _kycRepo;
    }
    async submitKyc(userId, data) {
        const existing = await this._kycRepo.getKycByUserId(userId);
        if (existing) {
            if (existing.kycStatus === types_1.KycStatus.APPROVED) {
                throw new api_error_1.default("KYC is already approved", 400);
            }
            if (existing.kycStatus === types_1.KycStatus.REJECTED) {
                throw new api_error_1.default("KYC was rejected. You cannot resubmit.", 403);
            }
            const updated = await this._kycRepo.updateKycData(userId, {
                ...data,
                kycStatus: types_1.KycStatus.RESUBMITTED,
                reason: undefined // Clear the previous reason on resubmit
            });
            if (!updated)
                throw new api_error_1.default("Failed to update KYC", 500);
            return updated;
        }
        return await this._kycRepo.createKyc({
            ...data,
            user: userId,
            kycStatus: types_1.KycStatus.PENDING
        });
    }
    async getKycStatus(userId) {
        return await this._kycRepo.getKycByUserId(userId);
    }
    async reviewKyc(kycId, status, adminId, reason) {
        return await this._kycRepo.updateKycStatus(kycId, status, adminId, reason);
    }
    async getPendingKyc() {
        return await this._kycRepo.getAllKycList(types_1.KycStatus.PENDING);
    }
}
exports.KycService = KycService;
