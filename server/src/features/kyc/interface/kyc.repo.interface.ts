import { IKyc, KycStatus } from "../types";
import { IBaseRepository } from "../../../shared/base/interface/base.repository.interface";

export interface IKycRepository extends IBaseRepository<IKyc> {
    createKyc(data: Partial<IKyc>): Promise<IKyc>;
    getKycByUserId(userId: string): Promise<IKyc | null>;
    getKycById(id: string): Promise<IKyc | null>;
    updateKycStatus(id: string, status: KycStatus, approvedBy?: string): Promise<IKyc | null>;
    updateKycData(userId: string, data: Partial<IKyc>): Promise<IKyc | null>;
    getAllKycList(status?: KycStatus): Promise<IKyc[]>;
}
