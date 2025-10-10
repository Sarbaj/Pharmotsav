import mongoose, { Schema } from "mongoose";

const recentInquirySchema = new Schema(
  {
    buyerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Buyer",
      required: true,
    },
    sellerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Seller",
      required: true,
    },
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    productName: {
      type: String,
      required: true,
    },
    inquiryDate: {
      type: Date,
      default: Date.now,
    },
    emailSentDate: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      enum: ["responded", "closed"],
      default: "responded",
    },
    notes: {
      type: String,
      default: "",
    },
    emailContent: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

// Index for efficient queries
recentInquirySchema.index({ buyerId: 1, sellerId: 1 });
recentInquirySchema.index({ sellerId: 1, status: 1 });
recentInquirySchema.index({ buyerId: 1, productId: 1 });
recentInquirySchema.index({ status: 1 });

export const RecentInquiry = mongoose.model(
  "RecentInquiry",
  recentInquirySchema
);
