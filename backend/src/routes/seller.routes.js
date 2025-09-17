import { Router } from 'express'
import { verifyJwtSeller,verifyJwtMember } from '../middlewares/auth.middleware.js'
import {
    registerSeller,
    loginSeller,
    logoutSeller,
    refreshAccessTokenSeller,
    changeSellerCurrentPassword,
    changeSellerForgotedPassword,
    updateSellerProfile,
    getCurrentSeller,
    getSellerAllProducts,
    approveSellerStatus,
    rejectSellerStatus,
    getAllSellers,
    removeSeller,
    getSeller
} from '../controllers/seller.controller.js'


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

//secure for member
sellerRouter.route('/approve-seller/:id').post(verifyJwtMember,approveSellerStatus)
sellerRouter.route('/reject-seller/:id').post(verifyJwtMember,rejectSellerStatus)
sellerRouter.route('/get-all-sellers').get(verifyJwtMember,getAllSellers)
sellerRouter.route('/remove-seller/:id').post(verifyJwtMember,removeSeller)
sellerRouter.route('/get-seller').post(verifyJwtMember,getSeller)


export default sellerRouter