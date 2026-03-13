import { NextFunction, Request, Response } from "express";
import { IKycService } from "./interface/kyc.service.interface";
import { sendSuccess } from "../../shared/utility/api.success";
import { KycStatus } from "./types";
import ApiError from "../../shared/utility/api.error";

export class KycController {
    constructor(private _kycService: IKycService) { }

    async submitKyc(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = (req as any).user.userId;
            const kycData = req.body;

            const kyc = await this._kycService.submitKyc(userId, kycData);
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
}
