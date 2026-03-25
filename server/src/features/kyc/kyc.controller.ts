import { NextFunction, Request, Response } from "express";
import { IKycService } from "./interface/kyc.service.interface";
import { sendSuccess } from "../../shared/utility/api.success";
import { KycStatus } from "./types";
import ApiError from "../../shared/utility/api.error";
import { uploadToCloudinary } from "../../shared/utility/cloudinary";
import cloudinary from "../../shared/utility/cloudinary";
import https from 'https';
import { DOCUMENT_TYPES, MAJOR_BANKS, MOCK_POLICIES } from "./kyc.constants";

export class KycController {
    constructor(private _kycService: IKycService) { }

    async submitKyc(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = (req as any).user.userId;
            const files = req.files as { [fieldname: string]: Express.Multer.File[] };

            const filePaths: any = {};
            if (files) {
                const uploadPromises = Object.keys(files).map(async (key) => {
                    const file = files[key][0];
                    const result = await uploadToCloudinary(file.buffer, 'kyc', 'authenticated');
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

            sendSuccess(res, kyc, "KYC submitted successfully");
        } catch (error) {
            next(error);
        }
    }

    async getKycStatus(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = (req as any).user.userId;
            const kyc = await this._kycService.getKycStatus(userId);

            if (!kyc) {
                return sendSuccess(res, { kycStatus: 'none' }, "No KYC found");
            }

            sendSuccess(res, kyc, "KYC status retrieved");
        } catch (error) {
            next(error);
        }
    }

    async getPendingKyc(req: Request, res: Response, next: NextFunction) {
        try {
            const search = req.query.search as string;
            const status = req.query.status as string;
            const result = await this._kycService.getPendingKyc(search, status);
            sendSuccess(res, result, "KYC list retrieved successfully");
        } catch (error) {
            next(error);
        }
    }

    async reviewKyc(req: Request, res: Response, next: NextFunction) {
        try {
            const { kycId, status, reason } = req.body;
            const adminId = (req as any).user.userId;

            if (![KycStatus.APPROVED, KycStatus.REJECTED, KycStatus.RETURNED].includes(status)) {
                throw new ApiError("Invalid status", 400);
            }

            if ((status === KycStatus.REJECTED || status === KycStatus.RETURNED) && !reason) {
                throw new ApiError(`Reason is required for ${status}`, 400);
            }

            const adminName = (req as any).user.name;
            const adminRole = (req as any).user.role;

            const kyc = await this._kycService.reviewKyc(kycId, status, adminId, reason, adminName, adminRole);
            sendSuccess(res, kyc, `KYC ${status} successfully`);
        } catch (error) {
            next(error);
        }
    }
    async getPrivacyPolicy(req: Request, res: Response, next: NextFunction) {
        try {
            const randomPolicy = MOCK_POLICIES[Math.floor(Math.random() * MOCK_POLICIES.length)];
            sendSuccess(res, { policy: randomPolicy }, "Privacy policy retrieved");
        } catch (error) {
            next(error);
        }
    }

    async getFile(req: Request, res: Response, next: NextFunction) {
        try {
            const path = req.params[0];
            if (!path) return next(new ApiError("File path is required", 400));

            console.log(`[KYC_GET_FILE] Base Path: ${path}`);

            const lastDotIndex = path.lastIndexOf('.');
            const publicIdWithoutExt = lastDotIndex !== -1 ? path.substring(0, lastDotIndex) : path;
            const ext = lastDotIndex !== -1 ? path.substring(lastDotIndex + 1).toLowerCase() : '';

            const tryFetch = async (resourceType: 'image' | 'raw', id: string) => {
                const signedUrl = cloudinary.url(id, {
                    sign_url: true,
                    type: 'authenticated',
                    resource_type: resourceType,
                    secure: true
                });

                return new Promise<{ status: number; contentType?: string; body?: string }>((resolve, reject) => {
                    https.get(signedUrl, (cloudinaryRes) => {
                        if (cloudinaryRes.statusCode === 200) {
                            const contentType = cloudinaryRes.headers['content-type'] as string;
                            if (contentType) res.setHeader('Content-Type', contentType);
                            cloudinaryRes.pipe(res);
                            resolve({ status: 200 });
                        } else {
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
                return next(new ApiError("File not found or storage error", 404));
            }
        } catch (error) {
            console.error(`[KYC_GET_FILE] Controller error:`, error);
            if (!res.headersSent) next(error);
        }
    }

    async getKycConfig(req: Request, res: Response, next: NextFunction) {
        try {
            sendSuccess(res, { DOCUMENT_TYPES, MAJOR_BANKS }, "KYC config retrieved");
        } catch (error) {
            next(error);
        }
    }
}
