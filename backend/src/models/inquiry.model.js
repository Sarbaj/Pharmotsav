import mongoose, { Schema } from "mongoose";

const inquirySchema = new Schema(
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
    products: [
      {
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
        status: {
          type: String,
          enum: ["pending", "responded", "closed"],
          default: "pending",
        },
        notes: {
          type: String,
          default: "",
        },
      },
    ],
    status: {
      type: String,
      enum: ["pending", "responded", "closed"],
      default: "pending",
    },
    totalProducts: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

// Index for efficient queries
inquirySchema.index({ buyerId: 1, sellerId: 1 });
inquirySchema.index({ sellerId: 1, status: 1 });

export const Inquiry = mongoose.model("Inquiry", inquirySchema);

