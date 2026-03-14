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
        return await this.findOne({ user: userId });
    }
    async getKycById(id) {
        return await this.findById(id);
    }
    async updateKycStatus(id, status, approvedBy) {
        const updateData = { kycStatus: status };
        if (status === types_1.KycStatus.APPROVED && approvedBy) {
            updateData.approvedOn = new Date();
            updateData.approvedBy = approvedBy;
        }
        return await this.update(id, updateData);
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
