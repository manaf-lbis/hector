import { IKycRepository } from "./interface/kyc.repo.interface";
import { KycModel } from "./models/kyc.model";
import { IKyc, KycStatus } from "./types";

export class KycRepository implements IKycRepository {
    async createKyc(data: Partial<IKyc>): Promise<IKyc> {
        return await KycModel.create(data);
    }

    async getKycByUserId(userId: string): Promise<IKyc | null> {
        return await KycModel.findOne({ user: userId }).exec();
    }

    async getKycById(id: string): Promise<IKyc | null> {
        return await KycModel.findById(id).exec();
    }

    async updateKycStatus(id: string, status: KycStatus, approvedBy?: string): Promise<IKyc | null> {
        const updateData: any = { kycStatus: status };
        if (status === KycStatus.APPROVED && approvedBy) {
            updateData.approvedOn = new Date();
            updateData.approvedBy = approvedBy;
        }
        return await KycModel.findByIdAndUpdate(
            id,
            updateData,
            { new: true }
        ).exec();
    }

    async updateKycData(userId: string, data: Partial<IKyc>): Promise<IKyc | null> {
        // If updating data, mostly it should become pending or resubmitted (handled by service)
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
