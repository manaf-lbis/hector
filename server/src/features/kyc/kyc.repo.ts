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
        return await KycModel.findOne({ user: userId })
            .populate('approvedBy', 'name')
            .exec();
    }

    async getKycById(id: string): Promise<IKyc | null> {
        return await this.findById(id as any);
    }

    async updateKycStatus(id: string, status: KycStatus, adminId: string, reason?: string, adminName?: string, adminRole?: string): Promise<IKyc | null> {
        const updateData: any = { 
            kycStatus: status, 
            reason,
            $push: {
                history: {
                    status,
                    actionBy: adminId,
                    actionByName: adminName || 'Admin',
                    actionByRole: adminRole || 'admin',
                    reason,
                    createdAt: new Date()
                }
            }
        };
        if (status === KycStatus.APPROVED) {
            updateData.approvedOn = new Date();
            updateData.approvedBy = adminId;
        }
        return await KycModel.findByIdAndUpdate(id, updateData, { new: true }).exec();
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
