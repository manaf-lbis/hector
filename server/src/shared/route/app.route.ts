import { Router } from "express";
import authRoute from '../../features/auth/auth.route'
import kycRoute from '../../features/kyc/kyc.route'

const route = Router()

route.use('/auth', authRoute)
route.use('/kyc', kycRoute)

export default route