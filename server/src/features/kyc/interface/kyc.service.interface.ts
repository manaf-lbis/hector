import { IKyc, KycStatus } from "../types";

export interface IKycService {
    submitKyc(userId: string, data: Partial<IKyc>): Promise<IKyc>;
    getKycStatus(userId: string): Promise<IKyc | null>;
    reviewKyc(kycId: string, status: KycStatus, adminId: string, reason?: string, adminName?: string, adminRole?: string): Promise<IKyc | null>;
    getPendingKyc(search?: string, status?: string): Promise<{
        kycList: IKyc[],
        total: number,
        counts: { [key: string]: number }
    }>;
}
