import express from "express";
import {
  createOrUpdateInquiry,
  getSellerInquiries,
  getBuyerInquiries,
  updateInquiryStatus,
  removeProductFromInquiry,
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

// Remove product from inquiry
inquiryRouter
  .route("/remove-product/:inquiryId/:productId")
  .delete(verifyJwtMember, removeProductFromInquiry);

export default inquiryRouter;
