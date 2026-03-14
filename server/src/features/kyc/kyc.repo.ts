import { IKycRepository } from "./interface/kyc.repo.interface";
import { KycModel } from "./models/kyc.model";
import { IKyc, KycStatus } from "./types";
import { BaseRepository } from "../../shared/base/base.repo";

export class KycRepository extends BaseRepository<IKyc> implements IKycRepository {
    constructor() {
        super(KycModel);
    }

    async createKyc(data: Partial<IKyc>): Promise<IKyc> {
        return await this.create(data);
    }

    async getKycByUserId(userId: string): Promise<IKyc | null> {
        return await this.findOne({ user: userId } as any);
    }

    async getKycById(id: string): Promise<IKyc | null> {
        return await this.findById(id as any);
    }

    async updateKycStatus(id: string, status: KycStatus, approvedBy?: string): Promise<IKyc | null> {
        const updateData: any = { kycStatus: status };
        if (status === KycStatus.APPROVED && approvedBy) {
            updateData.approvedOn = new Date();
            updateData.approvedBy = approvedBy;
        }
        return await this.update(id as any, updateData);
    }

    async updateKycData(userId: string, data: Partial<IKyc>): Promise<IKyc | null> {
        return await KycModel.findOneAndUpdate(
            { user: userId },
            data,
            { new: true, runValidators: true }
        ).exec();
    }

    async getAllKycList(status?: KycStatus): Promise<IKyc[]> {
        const filter = status ? { kycStatus: status } : {};
        return await KycModel.find(filter)
            .populate('user', 'name email phone')
            .sort({ createdAt: -1 })
            .exec();
    }
}
