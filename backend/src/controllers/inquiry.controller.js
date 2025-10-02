import { Inquiry } from "../models/inquiry.model.js";
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

  const sellerId = product.sellerId._id;

  // Check if inquiry already exists for this buyer-seller combination
  let inquiry = await Inquiry.findOne({ buyerId, sellerId });

  if (inquiry) {
    // Check if product already exists in inquiry
    const existingProduct = inquiry.products.find(
      (p) => p.productId.toString() === productId
    );

    if (existingProduct) {
      return res
        .status(200)
        .json(new ApiResponce(200, "Product already in inquiry", { inquiry }));
    }

    // Add new product to existing inquiry
    inquiry.products.push({
      productId,
      productName: product.productName,
      inquiryDate: new Date(),
      status: "pending",
    });

    inquiry.totalProducts = inquiry.products.length;
    await inquiry.save();
  } else {
    // Create new inquiry
    inquiry = await Inquiry.create({
      buyerId,
      sellerId,
      products: [
        {
          productId,
          productName: product.productName,
          inquiryDate: new Date(),
          status: "pending",
        },
      ],
      totalProducts: 1,
    });
  }

  return res
    .status(201)
    .json(
      new ApiResponce(201, "Inquiry created/updated successfully", { inquiry })
    );
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
    .populate("products.productId", "productName productImage specification")
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
      path: "products.productId",
      select: "productName productImage description specification category",
      populate: {
        path: "category",
        select: "name categoryName title",
      },
    })
    .sort({ createdAt: -1 });

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

// Remove product from inquiry
const removeProductFromInquiry = asyncHandler(async (req, res) => {
  const { inquiryId, productId } = req.params;

  if (!inquiryId || !productId) {
    throw new ApiError(400, "Inquiry ID and Product ID are required");
  }

  const inquiry = await Inquiry.findById(inquiryId);
  if (!inquiry) {
    throw new ApiError(404, "Inquiry not found");
  }

  // Remove product from inquiry
  inquiry.products = inquiry.products.filter(
    (p) => p.productId.toString() !== productId
  );
  inquiry.totalProducts = inquiry.products.length;

  // If no products left, delete the inquiry
  if (inquiry.products.length === 0) {
    await Inquiry.findByIdAndDelete(inquiryId);
    return res
      .status(200)
      .json(new ApiResponce(200, "Inquiry deleted as no products remain", {}));
  }

  await inquiry.save();

  return res.status(200).json(
    new ApiResponce(200, "Product removed from inquiry successfully", {
      inquiry,
    })
  );
});

export {
  createOrUpdateInquiry,
  getSellerInquiries,
  getBuyerInquiries,
  updateInquiryStatus,
  removeProductFromInquiry,
};
