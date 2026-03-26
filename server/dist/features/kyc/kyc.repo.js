"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KycRepository = void 0;
const kyc_model_1 = require("./models/kyc.model");
const types_1 = require("./types");
const base_repo_1 = require("../../shared/base/base.repo");
class KycRepository extends base_repo_1.BaseRepository {
    constructor() {
        super(kyc_model_1.KycModel);
    }
    async createKyc(data) {
        return await this.create(data);
    }
    async getKycByUserId(userId) {
        return await kyc_model_1.KycModel.findOne({ user: userId })
            .populate('approvedBy', 'name')
            .exec();
    }
    async getKycById(id) {
        return await this.findById(id);
    }
    async updateKycStatus(id, status, adminId, reason, adminName, adminRole) {
        const updateData = {
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
        if (status === types_1.KycStatus.APPROVED) {
            updateData.approvedOn = new Date();
            updateData.approvedBy = adminId;
        }
        return await kyc_model_1.KycModel.findByIdAndUpdate(id, updateData, { new: true }).exec();
    }
    async updateKycData(userId, data) {
        return await kyc_model_1.KycModel.findOneAndUpdate({ user: userId }, data, { new: true, runValidators: true }).exec();
    }
    async getAllKycList(status) {
        const filter = status ? { kycStatus: status } : {};
        return await kyc_model_1.KycModel.find(filter)
            .populate('user', 'name email phone')
            .sort({ createdAt: -1 })
            .exec();
    }
}
exports.KycRepository = KycRepository;
