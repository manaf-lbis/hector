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
            if (existing.kycStatus === types_1.KycStatus.REJECTED) {
                throw new api_error_1.default("KYC was rejected. You cannot resubmit.", 403);
            }
            const updated = await this._kycRepo.updateKycData(userId, {
                ...data,
                kycStatus: types_1.KycStatus.RESUBMITTED,
                reason: undefined,
                $push: {
                    history: {
                        status: types_1.KycStatus.RESUBMITTED,
                        actionBy: userId,
                        actionByName: data.userName || 'User',
                        actionByRole: 'user',
                        createdAt: new Date()
                    }
                }
            });
            if (!updated)
                throw new api_error_1.default("Failed to update KYC", 500);
            return updated;
        }
        const historyEntry = {
            status: types_1.KycStatus.PENDING,
            actionBy: userId,
            actionByName: data.userName || 'User', // We should pass names or fetch them
            actionByRole: 'user',
            createdAt: new Date()
        };
        return await this._kycRepo.createKyc({
            ...data,
            user: userId,
            kycStatus: types_1.KycStatus.PENDING,
            history: [historyEntry]
        });
    }
    async getKycStatus(userId) {
        return await this._kycRepo.getKycByUserId(userId);
    }
    async reviewKyc(kycId, status, adminId, reason, adminName, adminRole) {
        return await this._kycRepo.updateKycStatus(kycId, status, adminId, reason, adminName, adminRole);
    }
    async getPendingKyc(search, status) {
        // Fetch all to filter/count (simpler than complex aggregation for now given the repo structure)
        const allKyc = await this._kycRepo.getAllKycList();
        let filtered = allKyc;
        // Apply Search (on populated user field)
        if (search) {
            const regex = new RegExp(search, 'i');
            filtered = filtered.filter(k => k.user?.name?.match(regex) ||
                k.user?.email?.match(regex));
        }
        // Calculate counts for icons/tabs (before applying status filter)
        const counts = { all: filtered.length };
        filtered.forEach(k => {
            const s = k.kycStatus.toLowerCase();
            counts[s] = (counts[s] || 0) + 1;
        });
        // Apply Status Filter
        if (status && status !== 'all') {
            const statusToFilter = status.toLowerCase();
            filtered = filtered.filter(k => {
                const kStatus = k.kycStatus.toLowerCase();
                if (statusToFilter === 'pending') {
                    return kStatus === 'pending' || kStatus === 'resubmitted';
                }
                return kStatus === statusToFilter;
            });
        }
        return {
            kycList: filtered,
            total: filtered.length,
            counts
        };
    }
}
exports.KycService = KycService;
