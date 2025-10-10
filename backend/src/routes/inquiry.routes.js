import express from "express";
import {
  createOrUpdateInquiry,
  getSellerInquiries,
  getBuyerInquiries,
  updateInquiryStatus,
  deleteInquiry,
  moveInquiriesToRecent,
  getBuyerRecentInquiries,
  getSellerRecentInquiries,
} from "../controllers/inquiry.controller.js";
import { verifyJwtMember } from "../middlewares/auth.middleware.js";

const inquiryRouter = express.Router();

// Create or update inquiry (buyer only)
inquiryRouter
  .route("/create-inquiry")
  .post(verifyJwtMember, createOrUpdateInquiry);

// Get inquiries for seller
inquiryRouter.route("/seller").get(verifyJwtMember, getSellerInquiries);

// Get inquiries for buyer
inquiryRouter.route("/buyer").get(verifyJwtMember, getBuyerInquiries);

// Update inquiry status
inquiryRouter
  .route("/update-status/:inquiryId")
  .put(verifyJwtMember, updateInquiryStatus);

// Delete entire inquiry
inquiryRouter
  .route("/delete/:inquiryId")
  .delete(verifyJwtMember, deleteInquiry);

// Move inquiries from pending to recent
inquiryRouter
  .route("/move-to-recent")
  .post(verifyJwtMember, moveInquiriesToRecent);

// Get recent inquiries for buyer
inquiryRouter.route("/recent").get(verifyJwtMember, getBuyerRecentInquiries);

// Get recent inquiries for seller
inquiryRouter
  .route("/seller-recent")
  .get(verifyJwtMember, getSellerRecentInquiries);

export default inquiryRouter;
