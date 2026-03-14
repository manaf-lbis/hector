import { NextFunction, Request, Response } from "express";
import { IKycService } from "./interface/kyc.service.interface";
import { sendSuccess } from "../../shared/utility/api.success";
import { KycStatus } from "./types";
import ApiError from "../../shared/utility/api.error";
import { uploadToCloudinary } from "../../shared/utility/cloudinary";
import cloudinary from "../../shared/utility/cloudinary";
import https from 'https';
import { DOCUMENT_TYPES, MAJOR_BANKS } from "./kyc.constants";

export class KycController {
    constructor(private _kycService: IKycService) { }

    async submitKyc(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = (req as any).user.userId;
            const files = req.files as { [fieldname: string]: Express.Multer.File[] };

            // Extract file paths and upload to Cloudinary
            const filePaths: any = {};
            if (files) {
                const uploadPromises = Object.keys(files).map(async (key) => {
                    const file = files[key][0];
                    const result = await uploadToCloudinary(file.buffer, 'kyc', 'authenticated');
                    // We store the public_id to fetch it via proxy later
                    filePaths[key] = result.public_id;
                });
                await Promise.all(uploadPromises);
            }

            // Parse body if it's sent as a string (sometimes needed with multipart/form-data)
            let kycData = req.body;
            if (typeof kycData.data === 'string') {
                kycData = JSON.parse(kycData.data);
            }

            const finalKycData = { ...kycData, ...filePaths };

            const kyc = await this._kycService.submitKyc(userId, finalKycData);
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
            const kycList = await this._kycService.getPendingKyc();
            sendSuccess(res, kycList, "Pending KYC list retrieved");
        } catch (error) {
            next(error);
        }
    }

    async reviewKyc(req: Request, res: Response, next: NextFunction) {
        try {
            const { kycId, status } = req.body;
            const adminId = (req as any).user.userId;

            if (![KycStatus.APPROVED, KycStatus.REJECTED].includes(status)) {
                throw new ApiError("Invalid status", 400);
            }

            const kyc = await this._kycService.reviewKyc(kycId, status, adminId);
            sendSuccess(res, kyc, `KYC ${status} successfully`);
        } catch (error) {
            next(error);
        }
    }
    async getPrivacyPolicy(req: Request, res: Response, next: NextFunction) {
        try {
            const mockPolicies = [
                "By submitting this form, you authorize Hector to verify your identity using the provided documents. Your data will be stored securely using bank-grade encryption and will never be shared with third parties for marketing purposes. You consent to periodic KYC refresh checks as mandated by RBI guidelines.",
                "I hereby declare that the details furnished above are true and correct to the best of my knowledge and belief and I undertake to inform you of any changes therein, immediately. In case any of the above information is found to be false or untrue or misleading or misrepresenting, I am aware that I may be held liable for it.",
                "We collect your Aadhar/PAN and Bank details solely for the purpose of identity verification and regulatory compliance. We retain this data only as long as your account is active or as required by law. By proceeding, you agree to our comprehensive Data Protection Policy.",
            ];

            const randomPolicy = mockPolicies[Math.floor(Math.random() * mockPolicies.length)];

            sendSuccess(res, { policy: randomPolicy }, "Privacy policy retrieved");
        } catch (error) {
            next(error);
        }
    }

    async getFile(req: Request, res: Response, next: NextFunction) {
        try {
            // When using a regex route like /\/files\/(.*)/, the captured group 
            // is available in req.params[0]
            const publicId = req.params[0];

            if (!publicId || typeof publicId !== 'string') {
                return next(new ApiError("Public ID is required", 400));
            }

            // Generate a signed URL for the authenticated/private asset
            const signedUrl = cloudinary.url(publicId, {
                sign_url: true,
                type: 'authenticated',
                secure: true
            });

            // Proxy the file stream from Cloudinary to the client
            https.get(signedUrl, (cloudinaryResponse) => {
                if (cloudinaryResponse.statusCode !== 200) {
                    return next(new ApiError("Failed to fetch file from storage", 500));
                }

                // Safely handle potentially missing or array-typed headers
                const contentType = cloudinaryResponse.headers['content-type'];
                const contentLength = cloudinaryResponse.headers['content-length'];

                if (contentType) {
                    const finalContentType = Array.isArray(contentType) ? contentType[0] : contentType;
                    res.setHeader('Content-Type', finalContentType as string);
                } else {
                    res.setHeader('Content-Type', 'application/octet-stream');
                }

                if (contentLength) {
                    const finalContentLength = Array.isArray(contentLength) ? contentLength[0] : contentLength;
                    res.setHeader('Content-Length', finalContentLength as string);
                }

                // Pipe the response directly to the client
                cloudinaryResponse.pipe(res);
            }).on('error', (e) => {
                next(e);
            });
        } catch (error) {
            next(error);
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
