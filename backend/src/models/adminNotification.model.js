import mongoose, { Schema } from "mongoose";

const adminNotificationSchema = new Schema(
  {
    type: {
      type: String,
      enum: ["buyer_inquiry", "seller_response", "system_update"],
      default: "buyer_inquiry",
      required: true,
    },
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
    inquiryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Inquiry",
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["unread", "read"],
      default: "unread",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// Index for efficient queries
adminNotificationSchema.index({ status: 1, createdAt: -1 });
adminNotificationSchema.index({ buyerId: 1, sellerId: 1 });
adminNotificationSchema.index({ inquiryId: 1 });

export const AdminNotification = mongoose.model(
  "AdminNotification",
  adminNotificationSchema
);
