import crypto from "crypto";

/**
 * Generate a secure 6-digit OTP
 * @returns {string} 6-digit OTP
 */
export const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

/**
 * Hash OTP using SHA-256
 * @param {string} otp - The OTP to hash
 * @returns {string} Hashed OTP
 */
export const hashOTP = (otp) => {
  return crypto.createHash("sha256").update(otp).digest("hex");
};

/**
 * Verify OTP by comparing with hashed version
 * @param {string} otp - The OTP to verify
 * @param {string} hashedOTP - The hashed OTP to compare against
 * @returns {boolean} True if OTP matches
 */
export const verifyOTP = (otp, hashedOTP) => {
  const hashedInput = hashOTP(otp);
  return hashedInput === hashedOTP;
};

/**
 * Generate OTP expiry time (10 minutes from now)
 * @returns {Date} Expiry date
 */
export const generateOTPExpiry = () => {
  const now = new Date();
  return new Date(now.getTime() + 10 * 60 * 1000); // 10 minutes
};

/**
 * Check if OTP is expired
 * @param {Date} expiryDate - The expiry date to check
 * @returns {boolean} True if expired
 */
export const isOTPExpired = (expiryDate) => {
  return new Date() > expiryDate;
};

/**
 * Generate a secure session token for OTP verification
 * @returns {string} Session token
 */
export const generateSessionToken = () => {
  return crypto.randomBytes(32).toString("hex");
};
