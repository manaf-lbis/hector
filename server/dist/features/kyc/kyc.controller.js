"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.KycController = void 0;
const api_success_1 = require("../../shared/utility/api.success");
const types_1 = require("./types");
const api_error_1 = __importDefault(require("../../shared/utility/api.error"));
const cloudinary_1 = require("../../shared/utility/cloudinary");
const cloudinary_2 = __importDefault(require("../../shared/utility/cloudinary"));
const https_1 = __importDefault(require("https"));
const kyc_constants_1 = require("./kyc.constants");
class KycController {
    constructor(_kycService) {
        this._kycService = _kycService;
    }
    async submitKyc(req, res, next) {
        try {
            const userId = req.user.userId;
            const files = req.files;
            const filePaths = {};
            if (files) {
                const uploadPromises = Object.keys(files).map(async (key) => {
                    const file = files[key][0];
                    const result = await (0, cloudinary_1.uploadToCloudinary)(file.buffer, 'kyc', 'authenticated');
                    filePaths[key] = `${result.public_id}.${result.format}`;
                });
                await Promise.all(uploadPromises);
            }
            let kycData = req.body;
            if (typeof kycData.data === 'string') {
                kycData = JSON.parse(kycData.data);
            }
            const finalKycData = { ...kycData, ...filePaths };
            const { userName, ...restKycData } = finalKycData;
            const kyc = await this._kycService.submitKyc(userId, finalKycData);
            if (userName) {
                const mongoose = require('mongoose');
                await mongoose.model('User').findByIdAndUpdate(userId, { name: userName });
            }
            (0, api_success_1.sendSuccess)(res, kyc, "KYC submitted successfully");
        }
        catch (error) {
            next(error);
        }
    }
    async getKycStatus(req, res, next) {
        try {
            const userId = req.user.userId;
            const kyc = await this._kycService.getKycStatus(userId);
            if (!kyc) {
                return (0, api_success_1.sendSuccess)(res, { kycStatus: 'none' }, "No KYC found");
            }
            (0, api_success_1.sendSuccess)(res, kyc, "KYC status retrieved");
        }
        catch (error) {
            next(error);
        }
    }
    async getPendingKyc(req, res, next) {
        try {
            const search = req.query.search;
            const status = req.query.status;
            const result = await this._kycService.getPendingKyc(search, status);
            (0, api_success_1.sendSuccess)(res, result, "KYC list retrieved successfully");
        }
        catch (error) {
            next(error);
        }
    }
    async reviewKyc(req, res, next) {
        try {
            const { kycId, status, reason } = req.body;
            const adminId = req.user.userId;
            if (![types_1.KycStatus.APPROVED, types_1.KycStatus.REJECTED, types_1.KycStatus.RETURNED].includes(status)) {
                throw new api_error_1.default("Invalid status", 400);
            }
            if ((status === types_1.KycStatus.REJECTED || status === types_1.KycStatus.RETURNED) && !reason) {
                throw new api_error_1.default(`Reason is required for ${status}`, 400);
            }
            const adminName = req.user.name;
            const adminRole = req.user.role;
            const kyc = await this._kycService.reviewKyc(kycId, status, adminId, reason, adminName, adminRole);
            (0, api_success_1.sendSuccess)(res, kyc, `KYC ${status} successfully`);
        }
        catch (error) {
            next(error);
        }
    }
    async getPrivacyPolicy(req, res, next) {
        try {
            const randomPolicy = kyc_constants_1.MOCK_POLICIES[Math.floor(Math.random() * kyc_constants_1.MOCK_POLICIES.length)];
            (0, api_success_1.sendSuccess)(res, { policy: randomPolicy }, "Privacy policy retrieved");
        }
        catch (error) {
            next(error);
        }
    }
    async getFile(req, res, next) {
        try {
            const path = req.params[0];
            if (!path)
                return next(new api_error_1.default("File path is required", 400));
            console.log(`[KYC_GET_FILE] Base Path: ${path}`);
            const lastDotIndex = path.lastIndexOf('.');
            const publicIdWithoutExt = lastDotIndex !== -1 ? path.substring(0, lastDotIndex) : path;
            const ext = lastDotIndex !== -1 ? path.substring(lastDotIndex + 1).toLowerCase() : '';
            const tryFetch = async (resourceType, id) => {
                const signedUrl = cloudinary_2.default.url(id, {
                    sign_url: true,
                    type: 'authenticated',
                    resource_type: resourceType,
                    secure: true
                });
                return new Promise((resolve, reject) => {
                    https_1.default.get(signedUrl, (cloudinaryRes) => {
                        if (cloudinaryRes.statusCode === 200) {
                            const contentType = cloudinaryRes.headers['content-type'];
                            if (contentType)
                                res.setHeader('Content-Type', contentType);
                            cloudinaryRes.pipe(res);
                            resolve({ status: 200 });
                        }
                        else {
                            let data = '';
                            cloudinaryRes.on('data', chunk => data += chunk);
                            cloudinaryRes.on('end', () => resolve({ status: cloudinaryRes.statusCode || 500, body: data }));
                        }
                    }).on('error', reject);
                });
            };
            let result = await tryFetch('image', publicIdWithoutExt);
            if (result.status !== 200) {
                console.log(`[KYC_GET_FILE] image/publicId fail (${result.status}), trying raw/fullPath...`);
                result = await tryFetch('raw', path);
            }
            if (result.status !== 200) {
                console.log(`[KYC_GET_FILE] raw/fullPath fail (${result.status}), trying image/fullPath...`);
                result = await tryFetch('image', path);
            }
            if (result.status !== 200 && !res.headersSent) {
                console.error(`[KYC_GET_FILE] All Cloudinary attempts failed. Last status: ${result.status}, Body: ${result.body}`);
                return next(new api_error_1.default("File not found or storage error", 404));
            }
        }
        catch (error) {
            console.error(`[KYC_GET_FILE] Controller error:`, error);
            if (!res.headersSent)
                next(error);
        }
    }
    async getKycConfig(req, res, next) {
        try {
            (0, api_success_1.sendSuccess)(res, { DOCUMENT_TYPES: kyc_constants_1.DOCUMENT_TYPES, MAJOR_BANKS: kyc_constants_1.MAJOR_BANKS }, "KYC config retrieved");
        }
        catch (error) {
            next(error);
        }
    }
}
exports.KycController = KycController;
