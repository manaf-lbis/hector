import { IKycRepository } from "./interface/kyc.repo.interface";
import { IKycService } from "./interface/kyc.service.interface";
import { IKyc, KycStatus } from "./types";
import ApiError from "../../shared/utility/api.error";

export class KycService implements IKycService {
    constructor(private _kycRepo: IKycRepository) { }

    async submitKyc(userId: string, data: Partial<IKyc>): Promise<IKyc> {
        const existing = await this._kycRepo.getKycByUserId(userId);

        if (existing) {
            if (existing.kycStatus === KycStatus.REJECTED) {
                throw new ApiError("KYC was rejected. You cannot resubmit.", 403);
            }
            const updated = await this._kycRepo.updateKycData(userId, {
                ...data,
                kycStatus: KycStatus.RESUBMITTED,
                reason: undefined, 
                $push: {
                    history: {
                        status: KycStatus.RESUBMITTED,
                        actionBy: userId as any,
                        actionByName: (data as any).userName || 'User',
                        actionByRole: 'user',
                        createdAt: new Date()
                    }
                }
            } as any);
            if (!updated) throw new ApiError("Failed to update KYC", 500);
            return updated;
        }

        const historyEntry = {
            status: KycStatus.PENDING,
            actionBy: userId as any,
            actionByName: (data as any).userName || 'User', // We should pass names or fetch them
            actionByRole: 'user',
            createdAt: new Date()
        };

        const kyc = await this._kycRepo.createKyc({
            ...data,
            user: userId as any,
            kycStatus: KycStatus.PENDING,
            history: [historyEntry]
        });

        // Link KYC back to User for population support
        const mongoose = require('mongoose');
        await mongoose.model('User').findByIdAndUpdate(userId, { kyc: kyc._id });

        return kyc;
    }

    async getKycStatus(userId: string): Promise<IKyc | null> {
        return await this._kycRepo.getKycByUserId(userId);
    }

    async reviewKyc(kycId: string, status: KycStatus, adminId: string, reason?: string, adminName?: string, adminRole?: string): Promise<IKyc | null> {
        return await this._kycRepo.updateKycStatus(kycId, status, adminId, reason, adminName, adminRole);
    }

    async getPendingKyc(search?: string, status?: string): Promise<{
        kycList: IKyc[],
        total: number,
        counts: { [key: string]: number }
    }> {
        // Fetch all to filter/count (simpler than complex aggregation for now given the repo structure)
        const allKyc = await this._kycRepo.getAllKycList();
        
        let filtered = allKyc;

        // Apply Search (on populated user field)
        if (search) {
            const regex = new RegExp(search, 'i');
            filtered = filtered.filter(k => 
                (k.user as any)?.name?.match(regex) || 
                (k.user as any)?.email?.match(regex) ||
                (k.user as any)?.customId?.match(regex)
            );
        }

        // Calculate counts for icons/tabs (before applying status filter)
        const counts: { [key: string]: number } = { all: filtered.length };
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

    async bulkReviewKyc(kycIds: string[], status: KycStatus, adminId: string, reason?: string, adminName?: string, adminRole?: string): Promise<any> {
        return await this._kycRepo.bulkUpdateKycStatus(kycIds, status, adminId, reason, adminName, adminRole);
    }
}
