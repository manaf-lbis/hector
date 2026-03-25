import { Router } from "express";
import { AuthService } from "./auth.service";
import { UserRepo } from "../user/user.repo";
import { AuthController } from "./auth.controller";
import { OtpService } from "../otp/otp.services";
import { OtpRepo } from "../otp/otp.repo";
import { UserService } from "../user/user.services";
import { authMiddleware } from "../../shared/middleware/auth.middleware";

const router = Router();

const userRepo = new UserRepo()
const otpRepo = new OtpRepo()
const otpService = new OtpService(otpRepo)
const userService = new UserService(userRepo)
const authService = new AuthService(userService, otpService)
const authController = new AuthController(authService)

router.post('/login',authController.login.bind(authController))
router.post('/signup', authController.signup.bind(authController))
router.post('/signup/verify-otp', authController.verifySignup.bind(authController))
router.post('/signup/resend-otp', authController.signupResend.bind(authController))

router.post('/login/verify-otp', authController.verifyLogin.bind(authController))
router.post('/login/resend-otp', authController.loginResend.bind(authController))

router.post('/refresh', authController.refreshToken.bind(authController))
router.post('/logout', authMiddleware, authController.logout.bind(authController))
router.get('/me', authMiddleware, authController.getMe.bind(authController))

export default router