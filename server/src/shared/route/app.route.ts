import { Router } from "express";
import authRoute from '../../features/auth/auth.route'
import kycRoute from '../../features/kyc/kyc.route'
import userRoute from '../../features/user/user.route'
import categoryRoute from '../../features/category/category.route'

const route = Router()

route.use('/auth', authRoute)
route.use('/kyc', kycRoute)
route.use('/users', userRoute)
route.use('/categories', categoryRoute)

export default route