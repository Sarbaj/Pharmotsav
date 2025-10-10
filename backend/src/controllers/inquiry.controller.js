import { Inquiry } from "../models/inquiry.model.js";
import { RecentInquiry } from "../models/recentInquiry.model.js";
import { Product } from "../models/product.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponce } from "../utils/ApiResponce.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// Create or update inquiry
const createOrUpdateInquiry = asyncHandler(async (req, res) => {
  const { productId } = req.body;
  const buyerId = req.member._id;

  if (!productId) {
    throw new ApiError(400, "Product ID is required");
  }

  // Ensure only buyers can create inquiries
  if (req.userType !== "buyer") {
    throw new ApiError(403, "Only buyers can create inquiries");
  }

  // Get product details to find seller
  const product = await Product.findById(productId).populate("sellerId");
  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  if (!product.sellerId) {
    throw new ApiError(400, "Product has no associated seller");
  }

  const sellerId = product.sellerId._id;

  // Check if inquiry already exists for this buyer-product combination
  let inquiry = await Inquiry.findOne({ buyerId, productId });

  if (inquiry) {
    return res
      .status(200)
      .json(new ApiResponce(200, "Product already in inquiry", { inquiry }));
  } else {
    // Create new inquiry for this specific product
    inquiry = await Inquiry.create({
      buyerId,
      sellerId,
      productId,
      productName: product.productName,
      status: "pending",
    });
  }

  return res
    .status(201)
    .json(new ApiResponce(201, "Inquiry created successfully", { inquiry }));
});

// Get inquiries for a specific seller
const getSellerInquiries = asyncHandler(async (req, res) => {
  const sellerId = req.member._id;

  // Ensure only sellers can view their inquiries
  if (req.userType !== "seller") {
    throw new ApiError(403, "Only sellers can view their inquiries");
  }

  const inquiries = await Inquiry.find({ sellerId })
    .populate(
      "buyerId",
      "firstName lastName email mobileNumber country natureOfBusiness"
    )
    .populate("productId", "productName productImage specification")
    .sort({ createdAt: -1 });

  return res.status(200).json(
    new ApiResponce(200, "Seller inquiries fetched successfully", {
      inquiries,
    })
  );
});

// Get inquiries for a specific buyer
const getBuyerInquiries = asyncHandler(async (req, res) => {
  const buyerId = req.member._id;

  console.log("getBuyerInquiries - buyerId:", buyerId);
  console.log("getBuyerInquiries - userType:", req.userType);
  console.log("getBuyerInquiries - member:", req.member);

  // Ensure only buyers can view their inquiries
  if (req.userType !== "buyer") {
    throw new ApiError(403, "Only buyers can view their inquiries");
  }

  const inquiries = await Inquiry.find({ buyerId })
    .populate(
      "sellerId",
      "firstName lastName email CompanyName mobileNumber location natureOfBusiness licenseNumber gstNumber"
    )
    .populate({
      path: "productId",
      select: "productName productImage description specification category",
      populate: {
        path: "category",
        select: "name categoryName title",
      },
    })
    .sort({ createdAt: -1 });

  console.log("Found inquiries:", inquiries.length);
  console.log("Inquiries data:", inquiries);

  return res.status(200).json(
    new ApiResponce(200, "Buyer inquiries fetched successfully", {
      inquiries,
    })
  );
});

// Update inquiry status
const updateInquiryStatus = asyncHandler(async (req, res) => {
  const { inquiryId } = req.params;
  const { status, productId, notes } = req.body;

  if (!inquiryId) {
    throw new ApiError(400, "Inquiry ID is required");
  }

  const inquiry = await Inquiry.findById(inquiryId);
  if (!inquiry) {
    throw new ApiError(404, "Inquiry not found");
  }

  if (productId) {
    // Update specific product status
    const product = inquiry.products.find(
      (p) => p.productId.toString() === productId
    );
    if (product) {
      product.status = status;
      if (notes) product.notes = notes;
    }
  } else {
    // Update overall inquiry status
    inquiry.status = status;
  }

  await inquiry.save();

  return res
    .status(200)
    .json(
      new ApiResponce(200, "Inquiry status updated successfully", { inquiry })
    );
});

// Delete entire inquiry
const deleteInquiry = asyncHandler(async (req, res) => {
  const { inquiryId } = req.params;
  const buyerId = req.member._id;

  if (!inquiryId) {
    throw new ApiError(400, "Inquiry ID is required");
  }

  // Ensure only buyers can delete their own inquiries
  if (req.userType !== "buyer") {
    throw new ApiError(403, "Only buyers can delete inquiries");
  }

  // Find the inquiry and verify ownership
  const inquiry = await Inquiry.findById(inquiryId);
  if (!inquiry) {
    throw new ApiError(404, "Inquiry not found");
  }

  // Check if the buyer owns this inquiry
  if (inquiry.buyerId.toString() !== buyerId.toString()) {
    throw new ApiError(403, "You can only delete your own inquiries");
  }

  // Delete the inquiry
  await Inquiry.findByIdAndDelete(inquiryId);

  return res
    .status(200)
    .json(new ApiResponce(200, "Inquiry deleted successfully"));
});

// Move inquiries from pending to recent
const moveInquiriesToRecent = asyncHandler(async (req, res) => {
  const { inquiryIds, emailContent } = req.body;
  const buyerId = req.member._id;

  if (!inquiryIds || !Array.isArray(inquiryIds) || inquiryIds.length === 0) {
    throw new ApiError(400, "Inquiry IDs are required");
  }

  // Ensure only buyers can move their own inquiries
  if (req.userType !== "buyer") {
    throw new ApiError(403, "Only buyers can move inquiries");
  }

  const movedInquiries = [];
  const errors = [];

  for (const inquiryId of inquiryIds) {
    try {
      // Find the inquiry and verify ownership
      const inquiry = await Inquiry.findById(inquiryId);
      if (!inquiry) {
        errors.push(`Inquiry ${inquiryId} not found`);
        continue;
      }

      // Check if the buyer owns this inquiry
      if (inquiry.buyerId.toString() !== buyerId.toString()) {
        errors.push(`You can only move your own inquiries`);
        continue;
      }

      // Create recent inquiry record
      const recentInquiry = await RecentInquiry.create({
        buyerId: inquiry.buyerId,
        sellerId: inquiry.sellerId,
        productId: inquiry.productId,
        productName: inquiry.productName,
        inquiryDate: inquiry.inquiryDate,
        emailSentDate: new Date(),
        status: "responded",
        emailContent: emailContent || "",
      });

      // Delete the original inquiry
      await Inquiry.findByIdAndDelete(inquiryId);

      movedInquiries.push(recentInquiry);
    } catch (error) {
      console.error(`Error moving inquiry ${inquiryId}:`, error);
      errors.push(`Failed to move inquiry ${inquiryId}`);
    }
  }

  return res.status(200).json(
    new ApiResponce(200, "Inquiries moved to recent successfully", {
      movedCount: movedInquiries.length,
      errors: errors.length > 0 ? errors : undefined,
      movedInquiries,
    })
  );
});

// Get recent inquiries for buyer
const getBuyerRecentInquiries = asyncHandler(async (req, res) => {
  const buyerId = req.member._id;

  // Ensure only buyers can view their recent inquiries
  if (req.userType !== "buyer") {
    throw new ApiError(403, "Only buyers can view their recent inquiries");
  }

  const recentInquiries = await RecentInquiry.find({ buyerId })
    .populate(
      "sellerId",
      "firstName lastName email CompanyName mobileNumber location natureOfBusiness licenseNumber gstNumber"
    )
    .populate({
      path: "productId",
      select: "productName productImage description specification category",
      populate: {
        path: "category",
        select: "name categoryName title",
      },
    })
    .sort({ emailSentDate: -1 });

  return res.status(200).json(
    new ApiResponce(200, "Recent inquiries fetched successfully", {
      inquiries: recentInquiries,
    })
  );
});

// Get recent inquiries for seller
const getSellerRecentInquiries = asyncHandler(async (req, res) => {
  const sellerId = req.member._id;
  if (req.userType !== "seller") {
    throw new ApiError(403, "Only sellers can view their recent inquiries");
  }

  const recentInquiries = await RecentInquiry.find({ sellerId })
    .populate(
      "buyerId",
      "firstName lastName email mobileNumber country natureOfBusiness"
    )
    .populate({
      path: "productId",
      select: "productName productImage description specification category",
      populate: {
        path: "category",
        select: "name categoryName title",
      },
    })
    .sort({ emailSentDate: -1 });

  return res.status(200).json(
    new ApiResponce(200, "Recent inquiries fetched successfully", {
      inquiries: recentInquiries,
    })
  );
});

export {
  createOrUpdateInquiry,
  getSellerInquiries,
  getBuyerInquiries,
  updateInquiryStatus,
  deleteInquiry,
  moveInquiriesToRecent,
  getBuyerRecentInquiries,
  getSellerRecentInquiries,
};
