import express from "express";
import {
  initiateOTP,
  verifyOTP,
  resendOTP,
  getOTPStatus,
  initiateBuyerPhoneOTP,
  initiateBuyerEmailOTP,
  verifyBuyerPhoneOTP,
  verifyBuyerEmailOTP,
  resendBuyerPhoneOTP,
  resendBuyerEmailOTP,
} from "../controllers/otp.controller.js";
import {
  phoneOtpRateLimiter,
  emailOtpRateLimiter,
  otpRateLimiter,
  otpVerifyRateLimiter,
} from "../middlewares/rateLimiter.js";

const router = express.Router();

// Seller OTP routes (existing)
router.post("/initiate", otpRateLimiter, initiateOTP);
router.post("/verify", otpVerifyRateLimiter, verifyOTP);
router.post("/resend", otpRateLimiter, resendOTP);
router.get("/status/:mobileNumber", getOTPStatus);

// Buyer phone OTP routes
router.post(
  "/buyer/phone/initiate",
  phoneOtpRateLimiter,
  initiateBuyerPhoneOTP
);
router.post("/buyer/phone/verify", otpVerifyRateLimiter, verifyBuyerPhoneOTP);
router.post("/buyer/phone/resend", phoneOtpRateLimiter, resendBuyerPhoneOTP);

// Buyer email OTP routes
router.post(
  "/buyer/email/initiate",
  emailOtpRateLimiter,
  initiateBuyerEmailOTP
);
router.post("/buyer/email/verify", otpVerifyRateLimiter, verifyBuyerEmailOTP);
router.post("/buyer/email/resend", emailOtpRateLimiter, resendBuyerEmailOTP);

export { router as otpRouter };
