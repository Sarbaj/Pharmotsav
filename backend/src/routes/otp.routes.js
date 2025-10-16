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
  initiateBuyerPhoneOTPForUpdate,
  initiateBuyerEmailOTPForUpdate,
  verifyBuyerPhoneOTPForUpdate,
  verifyBuyerEmailOTPForUpdate,
  initiateSellerPhoneOTPForUpdate,
  initiateSellerEmailOTPForUpdate,
  verifySellerPhoneOTPForUpdate,
  verifySellerEmailOTPForUpdate,
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

// Buyer profile update OTP routes
router.post(
  "/buyer/phone/update/initiate",
  phoneOtpRateLimiter,
  initiateBuyerPhoneOTPForUpdate
);
router.post(
  "/buyer/phone/update/verify",
  otpVerifyRateLimiter,
  verifyBuyerPhoneOTPForUpdate
);

router.post(
  "/buyer/email/update/initiate",
  emailOtpRateLimiter,
  initiateBuyerEmailOTPForUpdate
);
router.post(
  "/buyer/email/update/verify",
  otpVerifyRateLimiter,
  verifyBuyerEmailOTPForUpdate
);

// Seller profile update OTP routes
router.post(
  "/seller/phone/update/initiate",
  phoneOtpRateLimiter,
  initiateSellerPhoneOTPForUpdate
);
router.post(
  "/seller/phone/update/verify",
  otpVerifyRateLimiter,
  verifySellerPhoneOTPForUpdate
);

router.post(
  "/seller/email/update/initiate",
  emailOtpRateLimiter,
  initiateSellerEmailOTPForUpdate
);
router.post(
  "/seller/email/update/verify",
  otpVerifyRateLimiter,
  verifySellerEmailOTPForUpdate
);

export { router as otpRouter };
