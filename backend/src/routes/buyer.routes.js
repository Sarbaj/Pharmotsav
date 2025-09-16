import { Router } from 'express'
import { verifyJwtBuyer } from '../middlewares/auth.middleware.js'
import {
    registerBuyer,
    loginBuyer,
    logoutBuyer,
    refreshAccessTokenBuyer,
    changeBuyerCurrentPassword,
    changeBuyerForgotedPassword,
    updateBuyerProfile,
    getCurrentBuyer
} from '../controllers/buyer.controller.js'

const buyerRouter = Router()

buyerRouter.route('/register-buyer').post(registerBuyer)
buyerRouter.route('/login-buyer').post(loginBuyer)

//secure routes
buyerRouter.route('/logout-buyer').post(verifyJwtBuyer,logoutBuyer)
buyerRouter.route('/refresh-token-buyer').post(verifyJwtBuyer,refreshAccessTokenBuyer)
buyerRouter.route('/change-password-buyer').post(verifyJwtBuyer,changeBuyerCurrentPassword)
buyerRouter.route('/change-forgoted-password-buyer').post(verifyJwtBuyer,changeBuyerForgotedPassword)
buyerRouter.route('/current-buyer').get(verifyJwtBuyer,getCurrentBuyer)
buyerRouter.route('/update-buyer-profile').patch(verifyJwtBuyer,updateBuyerProfile)


export default buyerRouter