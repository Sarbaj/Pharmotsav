import { Router } from "express";
import {
  verifyJwtSeller,
  verifyJwtMember,
} from "../middlewares/auth.middleware.js";
import {
  registerSeller,
  loginSeller,
  logoutSeller,
  refreshAccessTokenSeller,
  changeSellerCurrentPassword,
  changeSellerForgotedPassword,
  updateSellerProfile,
  getCurrentSeller,
  getLoginAfterRefresh,
  getSellerAllProducts,
  approveSellerStatus,
  rejectSellerStatus,
  getAllSellers,
  removeSeller,
  getSeller,
  getSellerDetails,
} from "../controllers/seller.controller.js";

const sellerRouter = Router();

sellerRouter.route("/register-seller").post(registerSeller);
sellerRouter.route("/login-seller").post(loginSeller);
sellerRouter.route("/login-after-refresh").post(getLoginAfterRefresh);

//secure routes
sellerRouter.route("/logout-seller").post(verifyJwtSeller, logoutSeller);
sellerRouter
  .route("/refresh-token-seller")
  .post(verifyJwtSeller, refreshAccessTokenSeller);
sellerRouter
  .route("/change-password-seller")
  .post(verifyJwtSeller, changeSellerCurrentPassword);
sellerRouter
  .route("/change-forgoted-password-seller")
  .post(verifyJwtSeller, changeSellerForgotedPassword);
sellerRouter.route("/current-seller").get(verifyJwtSeller, getCurrentSeller);
sellerRouter
  .route("/update-seller-profile")
  .patch(verifyJwtSeller, updateSellerProfile);
sellerRouter.route("/my-products").get(verifyJwtSeller, getSellerAllProducts);

//secure for member
sellerRouter
  .route("/approve-seller")
  .post(verifyJwtMember, approveSellerStatus);
sellerRouter.route("/reject-seller").post(verifyJwtMember, rejectSellerStatus);
sellerRouter.route("/get-all-sellers").get(verifyJwtMember, getAllSellers);
sellerRouter.route("/remove-seller").post(verifyJwtMember, removeSeller);
sellerRouter.route("/get-seller").post(verifyJwtMember, getSeller);

// Public route for getting seller details (no authentication required)
sellerRouter.route("/details/:sellerId").get(getSellerDetails);

export default sellerRouter;
