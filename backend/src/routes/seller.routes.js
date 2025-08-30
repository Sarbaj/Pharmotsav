import { Router } from 'express'
import { verifyJwtSeller } from '../middlewares/auth.middleware.js'
import {
    registerSeller,
    loginSeller,
    logoutSeller,
    refreshAccessTokenSeller,
    changeSellerCurrentPassword,
    changeSellerForgotedPassword,
    updateSellerProfile,
    getCurrentSeller,
    getSellerAllProducts
} from '../controllers/seller.controller.js'
import { changeBuyerForgotedPassword } from '../controllers/buyer.controller.js'

const sellerRouter = Router()

sellerRouter.route('/register-seller').post(registerSeller)
sellerRouter.route('/login-seller').post(loginSeller)

//secure routes
sellerRouter.route('/logout-seller').post(verifyJwtSeller,logoutSeller)
sellerRouter.route('/refresh-token-seller').post(verifyJwtSeller,refreshAccessTokenSeller)
sellerRouter.route('/change-password-seller').post(verifyJwtSeller,changeSellerCurrentPassword)
sellerRouter.route('/change-forgoted-password-seller').post(verifyJwtSeller,changeSellerForgotedPassword)
sellerRouter.route('/current-seller').get(verifyJwtSeller,getCurrentSeller)
sellerRouter.route('/update-seller-profile').patch(verifyJwtSeller,updateSellerProfile)
sellerRouter.route('/my-products').get(verifyJwtSeller,getSellerAllProducts)


export default sellerRouter