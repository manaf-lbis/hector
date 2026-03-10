import { Router } from "express";
import { AuthService } from "./auth.service";
import { UserRepo } from "../user/user.repo";

const router = Router();

const userRepo = new UserRepo()
const authServic = new AuthService(userRepo)

router.post('/login', (req, res) => {
    console.log(req.body);
    res.status(200).json({ status: 'success' })
   }
)

// router.post('/signup',)
// router.post('/verify',)
// router.post('/resend-otp',)


export default router