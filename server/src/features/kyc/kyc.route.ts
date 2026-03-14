import { Router } from "express";
import { KycRepository } from "./kyc.repo";
import { KycService } from "./kyc.service";
import { KycController } from "./kyc.controller";
import { authMiddleware, roleMiddleware } from "../../shared/middleware/auth.middleware";
import { kycUpload } from "../../shared/middleware/upload.middleware";
import { Roles } from "../user/types";

const router = Router();

const kycRepo = new KycRepository();
const kycService = new KycService(kycRepo);
const kycController = new KycController(kycService);

router.post('/submit', authMiddleware, kycUpload, kycController.submitKyc.bind(kycController));
router.get('/status', authMiddleware, kycController.getKycStatus.bind(kycController));
router.get('/config', kycController.getKycConfig.bind(kycController));
router.get('/privacy-policy', authMiddleware, kycController.getPrivacyPolicy.bind(kycController));
router.get(/\/files\/(.*)/, authMiddleware, kycController.getFile.bind(kycController));

// Admin routes
router.get('/pending', authMiddleware, roleMiddleware([Roles.admin]), kycController.getPendingKyc.bind(kycController));
router.post('/review', authMiddleware, roleMiddleware([Roles.admin]), kycController.reviewKyc.bind(kycController));

export default router;
