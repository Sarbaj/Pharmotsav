import { OTP } from "../models/otp.model.js";
import { Seller } from "../models/seller.model.js";
import { Buyer } from "../models/buyer.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponce } from "../utils/ApiResponce.js";
import {
  generateOTP,
  hashOTP,
  verifyOTP as verifyOTPCode,
  generateOTPExpiry,
} from "../utils/otpGenerator.js";
import { sendOTPSMS, sendWelcomeSMS } from "../utils/smsService.js";
import {
  sendEmailVerificationOTP,
  sendWelcomeEmail,
} from "../utils/emailService.js";
import { normalizedLocationfunc } from "../utils/userCommonMethods.js";

/**
 * Initiate OTP verification for seller registration
 */
const initiateOTP = asyncHandler(async (req, res) => {
  const { mobileNumber, userData } = req.body;

  if (!mobileNumber) {
    throw new ApiError(400, "Mobile number is required");
  }

  // Check if seller already exists
  const existingSeller = await Seller.findOne({ mobileNumber });
  if (existingSeller) {
    throw new ApiError(409, "Seller with this mobile number already exists");
  }

  // Generate OTP
  const otp = generateOTP();
  const hashedOTP = hashOTP(otp);
  const otpExpiry = generateOTPExpiry();

  // Clean up any existing OTP for this mobile number
  await OTP.deleteMany({ mobileNumber });

  // Create new OTP record
  const otpRecord = await OTP.create({
    mobileNumber,
    otp: hashedOTP,
    otpExpiry,
    userData: userData || {},
  });

  // Send SMS
  try {
    await sendOTPSMS(mobileNumber, otp);
  } catch (error) {
    // If SMS fails, delete the OTP record
    await OTP.findByIdAndDelete(otpRecord._id);
    throw new ApiError(500, "Failed to send OTP. Please try again.");
  }

  return res.status(200).json(
    new ApiResponce(200, "OTP sent successfully to your mobile number", {
      mobileNumber,
      expiresIn: "10 minutes",
    })
  );
});

/**
 * Verify OTP only (without registration)
 */
const verifyOTP = asyncHandler(async (req, res) => {
  const { mobileNumber, otp } = req.body;

  if (!mobileNumber || !otp) {
    throw new ApiError(400, "Mobile number and OTP are required");
  }

  // Find OTP record
  const otpRecord = await OTP.findOne({ mobileNumber });
  if (!otpRecord) {
    throw new ApiError(404, "OTP not found. Please request a new OTP.");
  }

  // Check if OTP is expired
  if (new Date() > otpRecord.otpExpiry) {
    await OTP.findByIdAndDelete(otpRecord._id);
    throw new ApiError(400, "OTP has expired. Please request a new OTP.");
  }

  // Check if max attempts reached
  if (otpRecord.attempts >= otpRecord.maxAttempts) {
    await OTP.findByIdAndDelete(otpRecord._id);
    throw new ApiError(
      400,
      "Too many failed attempts. Please request a new OTP."
    );
  }

  // Verify OTP
  const isOTPValid = verifyOTPCode(otp, otpRecord.otp);
  if (!isOTPValid) {
    await otpRecord.incrementAttempts();
    throw new ApiError(400, "Invalid OTP. Please try again.");
  }

  // Mark OTP as verified but don't delete it yet
  otpRecord.isVerified = true;
  await otpRecord.save();

  return res.status(200).json(
    new ApiResponce(200, "OTP verified successfully", {
      mobileNumber,
      verified: true,
    })
  );
});

/**
 * Resend OTP
 */
const resendOTP = asyncHandler(async (req, res) => {
  const { mobileNumber } = req.body;

  if (!mobileNumber) {
    throw new ApiError(400, "Mobile number is required");
  }

  // Find existing OTP record
  const otpRecord = await OTP.findOne({ mobileNumber });
  if (!otpRecord) {
    throw new ApiError(404, "No OTP request found. Please initiate OTP first.");
  }

  // Check if enough time has passed since last OTP (2 minutes)
  const timeSinceLastOTP = Date.now() - otpRecord.lastOtpSent.getTime();
  if (timeSinceLastOTP < 2 * 60 * 1000) {
    const waitTime = Math.ceil((2 * 60 * 1000 - timeSinceLastOTP) / 1000);
    throw new ApiError(
      400,
      `Please wait ${waitTime} seconds before requesting a new OTP.`
    );
  }

  // Generate new OTP
  const otp = generateOTP();
  const hashedOTP = hashOTP(otp);
  const otpExpiry = generateOTPExpiry();

  // Update OTP record
  otpRecord.otp = hashedOTP;
  otpRecord.otpExpiry = otpExpiry;
  otpRecord.attempts = 0;
  otpRecord.lastOtpSent = new Date();
  await otpRecord.save();

  // Send SMS
  try {
    await sendOTPSMS(mobileNumber, otp);
  } catch (error) {
    throw new ApiError(500, "Failed to send OTP. Please try again.");
  }

  return res.status(200).json(
    new ApiResponce(200, "OTP resent successfully", {
      mobileNumber,
      expiresIn: "10 minutes",
    })
  );
});

/**
 * Get OTP status
 */
const getOTPStatus = asyncHandler(async (req, res) => {
  const { mobileNumber } = req.params;

  if (!mobileNumber) {
    throw new ApiError(400, "Mobile number is required");
  }

  const otpRecord = await OTP.findOne({ mobileNumber });
  if (!otpRecord) {
    return res
      .status(200)
      .json(new ApiResponce(200, "No OTP request found", { hasOTP: false }));
  }

  const isExpired = new Date() > otpRecord.otpExpiry;
  const hasReachedMaxAttempts = otpRecord.attempts >= otpRecord.maxAttempts;

  return res.status(200).json(
    new ApiResponce(200, "OTP status retrieved", {
      hasOTP: true,
      isExpired,
      hasReachedMaxAttempts,
      attempts: otpRecord.attempts,
      maxAttempts: otpRecord.maxAttempts,
      expiresAt: otpRecord.otpExpiry,
    })
  );
});

/**
 * Initiate phone OTP verification for buyer registration
 */
const initiateBuyerPhoneOTP = asyncHandler(async (req, res) => {
  const { mobileNumber, userData } = req.body;

  if (!mobileNumber) {
    throw new ApiError(400, "Mobile number is required");
  }

  // Check if buyer already exists
  const existingBuyer = await Buyer.findOne({ mobileNumber });
  if (existingBuyer) {
    throw new ApiError(409, "Buyer with this mobile number already exists");
  }

  // Generate OTP
  const otp = generateOTP();
  const hashedOTP = hashOTP(otp);
  const otpExpiry = generateOTPExpiry();

  // Clean up any existing OTP for this mobile number
  await OTP.deleteMany({ mobileNumber, verificationType: "phone" });

  // Create new OTP record
  const otpRecord = await OTP.create({
    mobileNumber,
    otp: hashedOTP,
    otpExpiry,
    userData: userData || {},
    verificationType: "phone",
  });

  // Send SMS
  try {
    await sendOTPSMS(mobileNumber, otp);
  } catch (error) {
    // If SMS fails, delete the OTP record
    await OTP.findByIdAndDelete(otpRecord._id);
    throw new ApiError(500, "Failed to send OTP. Please try again.");
  }

  return res.status(200).json(
    new ApiResponce(200, "OTP sent successfully to your mobile number", {
      mobileNumber,
      expiresIn: "10 minutes",
    })
  );
});

/**
 * Initiate email OTP verification for buyer registration
 */
const initiateBuyerEmailOTP = asyncHandler(async (req, res) => {
  const { email, userData } = req.body;

  if (!email) {
    throw new ApiError(400, "Email is required");
  }

  // Check if buyer already exists
  const existingBuyer = await Buyer.findOne({ email });
  if (existingBuyer) {
    throw new ApiError(409, "Buyer with this email already exists");
  }

  // Generate OTP
  const otp = generateOTP();
  const hashedOTP = hashOTP(otp);
  const otpExpiry = generateOTPExpiry();

  // Clean up any existing OTP for this email
  await OTP.deleteMany({ email, verificationType: "email" });

  // Create new OTP record
  const otpRecord = await OTP.create({
    email,
    otp: hashedOTP,
    otpExpiry,
    userData: userData || {},
    verificationType: "email",
  });

  // Send email
  try {
    const firstName = userData?.firstName || "User";
    await sendEmailVerificationOTP(email, otp, firstName);
  } catch (error) {
    // If email fails, delete the OTP record
    await OTP.findByIdAndDelete(otpRecord._id);
    throw new ApiError(
      500,
      "Failed to send email verification. Please try again."
    );
  }

  return res.status(200).json(
    new ApiResponce(200, "Verification email sent successfully", {
      email,
      expiresIn: "10 minutes",
    })
  );
});

/**
 * Verify phone OTP for buyer registration
 */
const verifyBuyerPhoneOTP = asyncHandler(async (req, res) => {
  const { mobileNumber, otp } = req.body;

  if (!mobileNumber || !otp) {
    throw new ApiError(400, "Mobile number and OTP are required");
  }

  // Find OTP record
  const otpRecord = await OTP.findOne({
    mobileNumber,
    verificationType: "phone",
  });
  if (!otpRecord) {
    throw new ApiError(404, "OTP not found. Please request a new OTP.");
  }

  // Check if OTP is expired
  if (new Date() > otpRecord.otpExpiry) {
    await OTP.findByIdAndDelete(otpRecord._id);
    throw new ApiError(400, "OTP has expired. Please request a new OTP.");
  }

  // Check if max attempts reached
  if (otpRecord.attempts >= otpRecord.maxAttempts) {
    await OTP.findByIdAndDelete(otpRecord._id);
    throw new ApiError(
      400,
      "Too many failed attempts. Please request a new OTP."
    );
  }

  // Verify OTP
  const isOTPValid = verifyOTPCode(otp, otpRecord.otp);
  if (!isOTPValid) {
    await otpRecord.incrementAttempts();
    throw new ApiError(400, "Invalid OTP. Please try again.");
  }

  // Mark OTP as verified but don't delete it yet
  otpRecord.isVerified = true;
  await otpRecord.save();

  return res.status(200).json(
    new ApiResponce(200, "Phone number verified successfully", {
      mobileNumber,
      verified: true,
    })
  );
});

/**
 * Verify email OTP for buyer registration
 */
const verifyBuyerEmailOTP = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    throw new ApiError(400, "Email and OTP are required");
  }

  // Find OTP record
  const otpRecord = await OTP.findOne({
    email,
    verificationType: "email",
  });
  if (!otpRecord) {
    throw new ApiError(404, "OTP not found. Please request a new OTP.");
  }

  // Check if OTP is expired
  if (new Date() > otpRecord.otpExpiry) {
    await OTP.findByIdAndDelete(otpRecord._id);
    throw new ApiError(400, "OTP has expired. Please request a new OTP.");
  }

  // Check if max attempts reached
  if (otpRecord.attempts >= otpRecord.maxAttempts) {
    await OTP.findByIdAndDelete(otpRecord._id);
    throw new ApiError(
      400,
      "Too many failed attempts. Please request a new OTP."
    );
  }

  // Verify OTP
  const isOTPValid = verifyOTPCode(otp, otpRecord.otp);
  if (!isOTPValid) {
    await otpRecord.incrementAttempts();
    throw new ApiError(400, "Invalid OTP. Please try again.");
  }

  // Mark OTP as verified but don't delete it yet
  otpRecord.isVerified = true;
  await otpRecord.save();

  return res.status(200).json(
    new ApiResponce(200, "Email verified successfully", {
      email,
      verified: true,
    })
  );
});

/**
 * Resend phone OTP for buyer registration
 */
const resendBuyerPhoneOTP = asyncHandler(async (req, res) => {
  const { mobileNumber } = req.body;

  if (!mobileNumber) {
    throw new ApiError(400, "Mobile number is required");
  }

  // Find existing OTP record
  const otpRecord = await OTP.findOne({
    mobileNumber,
    verificationType: "phone",
  });
  if (!otpRecord) {
    throw new ApiError(404, "No OTP request found. Please initiate OTP first.");
  }

  // Check if enough time has passed since last OTP (2 minutes)
  const timeSinceLastOTP = Date.now() - otpRecord.lastOtpSent.getTime();
  if (timeSinceLastOTP < 2 * 60 * 1000) {
    const waitTime = Math.ceil((2 * 60 * 1000 - timeSinceLastOTP) / 1000);
    throw new ApiError(
      400,
      `Please wait ${waitTime} seconds before requesting a new OTP.`
    );
  }

  // Generate new OTP
  const otp = generateOTP();
  const hashedOTP = hashOTP(otp);
  const otpExpiry = generateOTPExpiry();

  // Update OTP record
  otpRecord.otp = hashedOTP;
  otpRecord.otpExpiry = otpExpiry;
  otpRecord.attempts = 0;
  otpRecord.lastOtpSent = new Date();
  await otpRecord.save();

  // Send SMS
  try {
    await sendOTPSMS(mobileNumber, otp);
  } catch (error) {
    throw new ApiError(500, "Failed to send OTP. Please try again.");
  }

  return res.status(200).json(
    new ApiResponce(200, "OTP resent successfully", {
      mobileNumber,
      expiresIn: "10 minutes",
    })
  );
});

/**
 * Resend email OTP for buyer registration
 */
const resendBuyerEmailOTP = asyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email) {
    throw new ApiError(400, "Email is required");
  }

  // Find existing OTP record
  const otpRecord = await OTP.findOne({
    email,
    verificationType: "email",
  });
  if (!otpRecord) {
    throw new ApiError(404, "No OTP request found. Please initiate OTP first.");
  }

  // Check if enough time has passed since last OTP (2 minutes)
  const timeSinceLastOTP = Date.now() - otpRecord.lastOtpSent.getTime();
  if (timeSinceLastOTP < 2 * 60 * 1000) {
    const waitTime = Math.ceil((2 * 60 * 1000 - timeSinceLastOTP) / 1000);
    throw new ApiError(
      400,
      `Please wait ${waitTime} seconds before requesting a new OTP.`
    );
  }

  // Generate new OTP
  const otp = generateOTP();
  const hashedOTP = hashOTP(otp);
  const otpExpiry = generateOTPExpiry();

  // Update OTP record
  otpRecord.otp = hashedOTP;
  otpRecord.otpExpiry = otpExpiry;
  otpRecord.attempts = 0;
  otpRecord.lastOtpSent = new Date();
  await otpRecord.save();

  // Send email
  try {
    const firstName = otpRecord.userData?.firstName || "User";
    await sendEmailVerificationOTP(email, otp, firstName);
  } catch (error) {
    throw new ApiError(
      500,
      "Failed to send email verification. Please try again."
    );
  }

  return res.status(200).json(
    new ApiResponce(200, "Verification email resent successfully", {
      email,
      expiresIn: "10 minutes",
    })
  );
});

export {
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
};
