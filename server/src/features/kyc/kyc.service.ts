import { IKycRepository } from "./interface/kyc.repo.interface";
import { IKycService } from "./interface/kyc.service.interface";
import { IKyc, KycStatus } from "./types";
import ApiError from "../../shared/utility/api.error";

export class KycService implements IKycService {
    constructor(private _kycRepo: IKycRepository) { }

    async submitKyc(userId: string, data: Partial<IKyc>): Promise<IKyc> {
        const existing = await this._kycRepo.getKycByUserId(userId);

        if (existing) {
            if (existing.kycStatus === KycStatus.APPROVED) {
                throw new ApiError("KYC is already approved", 400);
            }
            const updated = await this._kycRepo.updateKycData(userId, {
                ...data,
                kycStatus: KycStatus.RESUBMITTED
            });
            if (!updated) throw new ApiError("Failed to update KYC", 500);
            return updated;
        }

        return await this._kycRepo.createKyc({
            ...data,
            user: userId as any,
            kycStatus: KycStatus.PENDING
        });
    }

    async getKycStatus(userId: string): Promise<IKyc | null> {
        return await this._kycRepo.getKycByUserId(userId);
    }

    async reviewKyc(kycId: string, status: KycStatus, adminId: string): Promise<IKyc | null> {
        return await this._kycRepo.updateKycStatus(kycId, status, adminId);
    }

    async getPendingKyc(): Promise<IKyc[]> {
        return await this._kycRepo.getAllKycList(KycStatus.PENDING);
    }
}
