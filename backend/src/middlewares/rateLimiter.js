import { ApiError } from "../utils/ApiError.js";

// In-memory store for rate limiting (use Redis in production)
const rateLimitStore = new Map();

/**
 * Rate limiting middleware for OTP endpoints
 * @param {number} maxRequests - Maximum requests per window
 * @param {number} windowMs - Time window in milliseconds
 * @returns {Function} Express middleware function
 */
export const rateLimiter = (maxRequests = 5, windowMs = 15 * 60 * 1000) => {
  return (req, res, next) => {
    const clientId = req.ip || req.connection.remoteAddress;
    const now = Date.now();
    const windowStart = now - windowMs;

    // Clean up old entries
    for (const [key, value] of rateLimitStore.entries()) {
      if (value.timestamp < windowStart) {
        rateLimitStore.delete(key);
      }
    }

    // Get or create client data
    const clientData = rateLimitStore.get(clientId) || {
      count: 0,
      timestamp: now,
    };

    // Check if client is within rate limit
    if (clientData.count >= maxRequests && clientData.timestamp > windowStart) {
      const resetTimeSeconds = Math.ceil(
        (clientData.timestamp + windowMs - now) / 1000
      );
      const resetTimeMinutes = Math.ceil(resetTimeSeconds / 60);

      let errorMessage;
      if (resetTimeSeconds < 60) {
        errorMessage = `⚠️ Please wait ${resetTimeSeconds} seconds before requesting a new OTP.`;
      } else {
        errorMessage = `⚠️ Please wait ${resetTimeMinutes} minutes (${resetTimeSeconds} seconds) before requesting a new OTP.`;
      }

      throw new ApiError(429, errorMessage);
    }

    // Update client data
    if (clientData.timestamp <= windowStart) {
      clientData.count = 1;
      clientData.timestamp = now;
    } else {
      clientData.count += 1;
    }

    rateLimitStore.set(clientId, clientData);

    next();
  };
};

/**
 * Specific rate limiter for phone OTP sending (3 requests per 15 minutes)
 */
export const phoneOtpRateLimiter = rateLimiter(4, 15 * 60 * 1000);

/**
 * Specific rate limiter for email OTP sending (5 requests per 15 minutes)
 */
export const emailOtpRateLimiter = rateLimiter(5, 15 * 60 * 1000);

/**
 * Specific rate limiter for OTP verification (10 attempts per 15 minutes)
 */
export const otpVerifyRateLimiter = rateLimiter(10, 15 * 60 * 1000);

/**
 * Legacy rate limiter for backward compatibility
 */
export const otpRateLimiter = phoneOtpRateLimiter;
