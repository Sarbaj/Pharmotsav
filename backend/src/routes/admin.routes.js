import { Router } from "express";
import {
  verifyJwtAdmin,
  verifyJwtMember,
} from "../middlewares/auth.middleware.js";
import {
  memberRegisterController,
  adminLoginController,
  adminLogoutController,
  removeMemberController,
  getAllMembersController,
  memberLogoutController,
  getAllSellersController,
  getAllBuyersController,
  approveSellerController,
  getSellerByIdController,
  getBuyerByIdController,
  getSellersByStatusController,
  getAdminNotificationsController,
  markNotificationAsReadController,
  markAllNotificationsAsReadController,
} from "../controllers/admin.controller.js";

const adminRouter = Router();

adminRouter.route("/login-admin").post(adminLoginController);
//secure only access by admin not even members

adminRouter.route("/add-member").post(verifyJwtAdmin, memberRegisterController);
adminRouter
  .route("/remove-member")
  .post(verifyJwtAdmin, removeMemberController);
adminRouter.route("/logout-admin").get(verifyJwtAdmin, adminLogoutController);
adminRouter
  .route("/logout-member")
  .get(verifyJwtMember, memberLogoutController);
adminRouter
  .route("/get-all-members")
  .get(verifyJwtAdmin, getAllMembersController);

// Seller and Buyer Management Routes
adminRouter
  .route("/get-all-sellers")
  .get(verifyJwtAdmin, getAllSellersController);
adminRouter
  .route("/get-all-buyers")
  .get(verifyJwtAdmin, getAllBuyersController);
adminRouter
  .route("/get-sellers-by-status/:status")
  .get(verifyJwtAdmin, getSellersByStatusController);
adminRouter
  .route("/get-seller/:sellerId")
  .get(verifyJwtAdmin, getSellerByIdController);
adminRouter
  .route("/get-buyer/:buyerId")
  .get(verifyJwtAdmin, getBuyerByIdController);
adminRouter
  .route("/approve-seller/:sellerId")
  .put(verifyJwtAdmin, approveSellerController);

// Admin Notification Routes
adminRouter
  .route("/notifications")
  .get(verifyJwtAdmin, getAdminNotificationsController);
adminRouter
  .route("/notifications/:notificationId/mark-read")
  .put(verifyJwtAdmin, markNotificationAsReadController);
adminRouter
  .route("/notifications/mark-all-read")
  .put(verifyJwtAdmin, markAllNotificationsAsReadController);

export default adminRouter;
