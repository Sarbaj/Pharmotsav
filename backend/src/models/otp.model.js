import mongoose from "mongoose";

const otpSchema = new mongoose.Schema(
  {
    mobileNumber: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      trim: true,
    },
    otp: {
      type: String,
      required: true,
    },
    otpExpiry: {
      type: Date,
      required: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    attempts: {
      type: Number,
      default: 0,
    },
    maxAttempts: {
      type: Number,
      default: 3,
    },
    lastOtpSent: {
      type: Date,
      default: Date.now,
    },
    userData: {
      type: Object,
      default: {},
    },
    verificationType: {
      type: String,
      enum: ["phone", "email", "phone_update", "email_update"],
      default: "phone", // Default to phone for backward compatibility
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
otpSchema.index({ mobileNumber: 1 });
otpSchema.index({ email: 1 });
otpSchema.index({ verificationType: 1 });
otpSchema.index({ otpExpiry: 1 }, { expireAfterSeconds: 0 });

// Method to check if OTP is expired
otpSchema.methods.isOtpExpired = function () {
  return new Date() > this.otpExpiry;
};

// Method to check if max attempts reached
otpSchema.methods.hasReachedMaxAttempts = function () {
  return this.attempts >= this.maxAttempts;
};

// Method to increment attempts
otpSchema.methods.incrementAttempts = function () {
  this.attempts += 1;
  return this.save();
};

// Method to reset attempts
otpSchema.methods.resetAttempts = function () {
  this.attempts = 0;
  return this.save();
};

// Custom validation to ensure either mobileNumber or email is provided
otpSchema.pre("validate", function (next) {
  if (
    (this.verificationType === "phone" ||
      this.verificationType === "phone_update") &&
    !this.mobileNumber
  ) {
    return next(new Error("Mobile number is required for phone verification"));
  }
  if (
    (this.verificationType === "email" ||
      this.verificationType === "email_update") &&
    !this.email
  ) {
    return next(new Error("Email is required for email verification"));
  }
  next();
});

export const OTP = mongoose.model("OTP", otpSchema);
