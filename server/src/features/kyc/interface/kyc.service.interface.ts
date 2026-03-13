import { IKyc, KycStatus } from "../types";

export interface IKycService {
    submitKyc(userId: string, data: Partial<IKyc>): Promise<IKyc>;
    getKycStatus(userId: string): Promise<IKyc | null>;
    reviewKyc(kycId: string, status: KycStatus, adminId: string): Promise<IKyc | null>;
    getPendingKyc(): Promise<IKyc[]>;
}
