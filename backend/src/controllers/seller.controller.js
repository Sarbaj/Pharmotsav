import { Seller } from "../models/seller.model.js";
import { OTP } from "../models/otp.model.js";
import jwt from "jsonwebtoken";
import { normalizedLocationfunc } from "../utils/userCommonMethods.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponce } from "../utils/ApiResponce.js";
import mongoose from "mongoose";
import { Product } from "../models/product.model.js";
import { sendWelcomeSMS } from "../utils/smsService.js";
import { sendPasswordResetEmail } from "../utils/emailService.js";

//genarate a tokens for seller
const genarateRefreshToken_genarateAccessToken_for_seller = async (userid) => {
  try {
    const seller = await Seller.findById(userid);
    if (!seller)
      throw new ApiError(404, "Buyer not found while genrating usertokens");

    const accessToken = await seller.generateAccessToken();
    const refreshToken = await seller.generateRefreshToken();

    seller.refreshToken = refreshToken;
    await seller.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(500, "Something went wrong while genrating usertokens");
  }
};

//register seller
const registerSeller = asyncHandler(async (req, res) => {
  const {
    firstName,
    lastName,
    email,
    mobileNumber,
    password,
    country,
    natureOfBusiness,
    CompanyName,
    licenseNumber,
    gstNumber,
    location,
  } = req.body;

  if (
    !firstName ||
    !lastName ||
    !email ||
    !mobileNumber ||
    !country ||
    !password ||
    !location ||
    !CompanyName ||
    !licenseNumber ||
    !gstNumber
  ) {
    throw new ApiError(401, "All fields are required");
  }

  // Check if mobile number is verified via OTP
  const otpRecord = await OTP.findOne({
    mobileNumber,
    isVerified: true,
  });

  if (!otpRecord) {
    throw new ApiError(
      400,
      "Mobile number must be verified with OTP before registration"
    );
  }

  // Check if OTP is still valid (not expired)
  if (new Date() > otpRecord.otpExpiry) {
    await OTP.findByIdAndDelete(otpRecord._id);
    throw new ApiError(
      400,
      "OTP verification has expired. Please verify your mobile number again."
    );
  }

  const normalizedLocation = normalizedLocationfunc(location);
  if (!normalizedLocation) {
    throw new ApiError(
      500,
      "something wrong while generationg normalizelocation"
    );
  }

  //cheak if seller already exists
  const existingSeller = await Seller.findOne({
    $or: [{ email }, { mobileNumber }, { licenseNumber }, { gstNumber }],
  });
  if (existingSeller) {
    throw new ApiError(
      409,
      "Seller with this email or mobileNumber or gstNumber or licenseNumber already exists"
    );
  }

  //create seller
  const seller = await Seller.create({
    firstName,
    lastName,
    email,
    mobileNumber,
    country,
    natureOfBusiness,
    password,
    CompanyName,
    licenseNumber,
    gstNumber,
    location: normalizedLocation,
    status: "pending",
  });

  // Send welcome SMS
  try {
    await sendWelcomeSMS(mobileNumber, firstName);
  } catch (error) {
    console.error("Failed to send welcome SMS:", error);
    // Don't fail registration if welcome SMS fails
  }

  // Clean up OTP record after successful registration
  await OTP.findByIdAndDelete(otpRecord._id);

  //see if seller is created or not
  const newSeller = await Seller.findById(seller._id).select(
    "-password -refreshToken"
  );
  if (!newSeller) {
    throw new ApiError(500, "Something went wrong while creating seller");
  }

  //return responce
  return res
    .status(201)
    .json(
      new ApiResponce(
        201,
        "Seller registered successfully and mobile number verified",
        newSeller
      )
    );
});

//login seller
const loginSeller = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  //cheak if field are provided
  if (!email || !password) {
    throw new ApiError(400, "Please provide all required fields");
  }

  //cheak if buyer exists
  const seller = await Seller.findOne({ email });
  if (!seller) {
    throw new ApiError(404, "Buyer not found with this email");
  }

  //cheak if password is correct
  const isPasswordMatched = await seller.isPasswordCorrect(password);
  if (!isPasswordMatched) {
    throw new ApiError(401, "Invalid credentials");
  }

  //genarate accessToken and refreshToken
  const { accessToken, refreshToken } =
    await genarateRefreshToken_genarateAccessToken_for_seller(seller._id);

  //return buyer
  const loggedInSeller = await Seller.findById(seller._id).select(
    "-password -refreshToken"
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("refreshToken", refreshToken, options)
    .cookie("accessToken", accessToken, options)
    .json(
      new ApiResponce(200, "Seller logged in successfully", {
        seller: loggedInSeller,
        accessToken,
        refreshToken,
      })
    );
});

//logout seller
const logoutSeller = asyncHandler(async (req, res) => {
  await Seller.findByIdAndUpdate(
    req.seller._id,
    {
      $unset: {
        refreshToken: 1,
      },
    },
    { new: true }
  );
  const options = {
    httpOnly: true,
    secure: true,
  };
  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponce(200, {}, "Seller LoggedOut"));
});

//refresh access token for seller
const refreshAccessTokenSeller = asyncHandler(async (req, res) => {
  //take refreshToken from request
  const incomingRefreshToken =
    req.cookies?.refreshToken || req.body?.refreshToken;
  if (!incomingRefreshToken) {
    throw new ApiError(401, "no incoming refreshToken");
  }

  try {
    //decode data from it
    const data = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    //use id to fetch the buyer
    const seller = await Seller.findById(data?._id);

    if (!seller) {
      throw new ApiError(401, "invalid refreshToken");
    }

    //cheak if the buyer have same refreshToken or not

    if (incomingRefreshToken !== seller?.refreshToken) {
      throw new ApiError(401, "refreshToken dosent match");
    }

    const options = {
      httpOnly: true,
      secure: true,
    };
    const { accessToken, refreshToken } =
      await genarateRefreshToken_genarateAccessToken_for_seller(seller._id);

    const newseller = await Seller.findById(seller._id).select(
      "-password -refreshToken"
    );
    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json(
        new ApiResponce(200, "Token refresh successfully", {
          seller,
          accessToken,
          refreshToken,
        })
      );
  } catch (error) {
    throw new ApiError(500, error?.message || "Invalid refreshToken");
  }
});

//change seller  Password
const changeSellerCurrentPassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  if (!oldPassword || !newPassword) {
    throw new ApiError(401, "Both field are required (passwords)");
  }

  const seller = await Seller.findById(req.seller?._id);

  if (!seller) {
    throw new ApiError(401, "loggedIn first to change password");
  }
  const ispasswordValid = await seller.isPasswordCorrect(oldPassword);

  if (!ispasswordValid) {
    throw new ApiError(401, "password should correct");
  }

  seller.password = newPassword;
  await seller.save({ validateBeforeSave: false });
  return res
    .status(200)
    .json(new ApiResponce(200, "password change successfully...", {}));
});

//
//change forgotten password
const changeSellerForgotedPassword = asyncHandler(async (req, res) => {
  const { newPassword, isVarified } = req.body;

  if (!isVarified) {
    throw new ApiError(401, "buyer is not varified");
  }
  if (!newPassword) {
    throw new ApiError(401, "field is required");
  }
  const seller = await Seller.findById(req.seller?._id);
  if (!seller) {
    throw new ApiError(401, "loggedIn first to change password");
  }

  seller.password = newPassword;
  await seller.save({ validateBeforeSave: false });
  return res
    .status(200)
    .json(new ApiResponce(200, "password chagne successfully..", {}));
});

//forgot password - send reset email
const forgotSellerPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email) {
    throw new ApiError(400, "Email is required");
  }

  const seller = await Seller.findOne({ email });
  if (!seller) {
    throw new ApiError(404, "Seller not found with this email");
  }

  // Generate reset token (you can use JWT or a simple random string)
  const resetToken = jwt.sign(
    { sellerId: seller._id },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "15m" }
  );

  // Save reset token to seller (you might want to add a resetToken field to the schema)
  seller.resetToken = resetToken;
  await seller.save({ validateBeforeSave: false });

  // Send reset email
  try {
    await sendPasswordResetEmail(email, seller.firstName, resetToken);
  } catch (error) {
    console.error("Failed to send password reset email:", error);
    throw new ApiError(500, "Failed to send password reset email");
  }

  return res
    .status(200)
    .json(new ApiResponce(200, "Password reset email sent successfully", {}));
});

//reset password with token
const resetSellerPassword = asyncHandler(async (req, res) => {
  const { token, newPassword } = req.body;

  if (!token || !newPassword) {
    throw new ApiError(400, "Token and new password are required");
  }

  try {
    // Verify the reset token
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    const seller = await Seller.findById(decoded.sellerId);
    if (!seller) {
      throw new ApiError(404, "Seller not found");
    }

    if (seller.resetToken !== token) {
      throw new ApiError(400, "Invalid or expired reset token");
    }

    // Update password
    seller.password = newPassword;
    seller.resetToken = undefined; // Clear the reset token
    await seller.save({ validateBeforeSave: false });

    return res
      .status(200)
      .json(new ApiResponce(200, "Password reset successfully", {}));
  } catch (error) {
    if (
      error.name === "JsonWebTokenError" ||
      error.name === "TokenExpiredError"
    ) {
      throw new ApiError(400, "Invalid or expired reset token");
    }
    throw error;
  }
});

//update seller email with OTP verification
const updateSellerEmail = asyncHandler(async (req, res) => {
  const { email, isEmailVerified } = req.body;

  if (!email) {
    throw new ApiError(400, "Email is required");
  }

  if (!isEmailVerified) {
    throw new ApiError(400, "Email must be verified with OTP before updating");
  }

  // Check if email already exists
  const existingSeller = await Seller.findOne({ email });
  if (existingSeller) {
    throw new ApiError(409, "Email already exists");
  }

  const seller = await Seller.findByIdAndUpdate(
    req.seller?._id,
    { email },
    { new: true }
  ).select("-password -refreshToken -resetToken");

  return res
    .status(200)
    .json(new ApiResponce(200, "Email updated successfully", seller));
});

//update seller mobile number with OTP verification
const updateSellerMobileNumber = asyncHandler(async (req, res) => {
  const { mobileNumber, isMobileVerified } = req.body;

  if (!mobileNumber) {
    throw new ApiError(400, "Mobile number is required");
  }

  if (!isMobileVerified) {
    throw new ApiError(
      400,
      "Mobile number must be verified with OTP before updating"
    );
  }

  // Check if mobile number already exists
  const existingSeller = await Seller.findOne({ mobileNumber });
  if (existingSeller) {
    throw new ApiError(409, "Mobile number already exists");
  }

  const seller = await Seller.findByIdAndUpdate(
    req.seller?._id,
    { mobileNumber },
    { new: true }
  ).select("-password -refreshToken -resetToken");

  return res
    .status(200)
    .json(new ApiResponce(200, "Mobile number updated successfully", seller));
});

//update seller Profile
const updateSellerProfile = asyncHandler(async (req, res) => {
  const {
    firstName,
    lastName,
    email,
    mobileNumber,
    country,
    natureOfBusiness,
    CompanyName,
    licenseNumber,
    gstNumber,
    location,
  } = req.body;

  if (
    !firstName ||
    !lastName ||
    !email ||
    !mobileNumber ||
    !country ||
    !location ||
    !CompanyName ||
    !licenseNumber ||
    !gstNumber
  ) {
    throw new ApiError(401, "All fields are required");
  }
  //normalized location
  const normalizedLocation = normalizedLocationfunc(location);

  const seller = await Seller.findByIdAndUpdate(
    req.seller?._id,
    {
      firstName,
      lastName,
      email,
      mobileNumber,
      country,
      natureOfBusiness,
      CompanyName,
      licenseNumber,
      gstNumber,
      location: normalizedLocation,
      status: "pending",
    },
    {
      new: true,
    }
  ).select("-password -refreshToken");

  return res
    .status(200)
    .json(new ApiResponce(200, "Seller profile updated successfully", seller));
});

//get current seller
const getCurrentSeller = asyncHandler(async (req, res) => {
  const seller = await Seller.findById(req.seller?._id).select(
    "-password -refreshToken"
  );

  if (!seller) {
    throw new ApiError(404, "User not found");
  }
  return res
    .status(200)
    .json(new ApiResponce(200, "Current seller fetched successfully", seller));
});

//get login after refresh for seller
const getLoginAfterRefresh = asyncHandler(async (req, res) => {
  const incomingRefreshToken =
    req.cookies?.refreshToken || req.body?.refreshToken;
  if (!incomingRefreshToken) {
    throw new ApiError(401, "no incoming refreshToken");
  }
  try {
    //decode data from it
    const data = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    //use id to fetch the seller
    const seller = await Seller.findById(data?._id);

    if (!seller) {
      throw new ApiError(401, "invalid refreshToken");
    }

    //check if the seller have same refreshToken or not
    if (incomingRefreshToken !== seller?.refreshToken) {
      throw new ApiError(401, "refreshToken dosent match");
    }

    const saveSeller = await Seller.findById(seller._id).select(
      "-password -refreshToken"
    );
    return res
      .status(200)
      .json(new ApiResponce(200, "Seller fetched successfully", saveSeller));
  } catch (error) {
    throw new ApiError(500, error?.message || "Invalid refreshToken");
  }
});

//get seller all products
const getSellerAllProducts = asyncHandler(async (req, res) => {
  const sellerId = new mongoose.Types.ObjectId(req.seller?._id);

  const products = await Seller.aggregate([
    {
      $match: {
        _id: sellerId,
      },
    },
    {
      $lookup: {
        from: "products",
        localField: "product",
        foreignField: "_id",
        as: "productDetails",
      },
    },
    {
      $unwind: "$productDetails",
    },
    {
      $project: {
        _id: "$productDetails._id",
        name: "$productDetails.productName",
        image: "$productDetails.productImage",
      },
    },
  ]);

  return res
    .status(200)
    .json(new ApiResponce(200, "product featched successfully..", products));
});

//approve seller status
const approveSellerStatus = asyncHandler(async (req, res) => {
  const { sellerId } = req.body;
  if (!sellerId) {
    throw new ApiError(401, "sellerId dosent provided");
  }
  const seller = await Seller.findById(sellerId).select(
    "-password -refreshToken"
  );

  if (!seller) {
    throw new ApiError(401, "seller not found...");
  }
  const updatedSeller = await Seller.findByIdAndUpdate(
    sellerId,
    {
      status: "approved",
    },
    {
      new: true,
    }
  ).select("-password -refreshToken");
  return res
    .status(200)
    .json(
      new ApiResponce(200, "seller status changed successfully", updatedSeller)
    );
});

//reject seller status
const rejectSellerStatus = asyncHandler(async (req, res) => {
  const { sellerId } = req.body;
  if (!sellerId) {
    throw new ApiError(401, "sellerId dosent provided");
  }
  const seller = await Seller.findById(sellerId).select(
    "-password -refreshToken"
  );

  if (!seller) {
    throw new ApiError(401, "seller not found...");
  }
  const updatedSeller = await Seller.findByIdAndUpdate(
    sellerId,
    {
      status: "rejected",
    },
    {
      new: true,
    }
  ).select("-password -refreshToken");
  return res
    .status(200)
    .json(
      new ApiResponce(200, "seller status changed successfully", updatedSeller)
    );
});

//get all sellers (for admin)
const getAllSellers = asyncHandler(async (req, res) => {
  const sellers = await Seller.find()
    .select("-password -refreshToken")
    .sort({ createdAt: -1 });
  return res
    .status(200)
    .json(new ApiResponce(200, "All sellers fetched successfully", sellers));
});

//remove-seller
const removeSeller = asyncHandler(async (req, res, next) => {
  const { sellerId } = req.body;
  if (!sellerId) {
    throw new ApiError(400, "sellerId dosent provided");
  }
  const seller = await Seller.findById(sellerId);
  if (!seller) {
    throw new ApiError(400, "seller not found");
  }
  const deleted = await Seller.findByIdAndDelete(seller._id);
  if (!deleted) {
    throw new ApiError(500, "server error seller not deleted??");
  }
  //delete all products of this seller
  await Product.deleteMany({ sellerId: seller._id });

  return res.status(200).json(new ApiResponce(200, "seller deleted!!", {}));
});

//get seller
const getSeller = asyncHandler(async (req, res, next) => {
  const { sellerId } = req.body;
  if (!sellerId) {
    throw new ApiError(400, "sellerId dosent provided");
  }
  const seller = await Seller.findById(sellerId).select(
    "-password -refreshToken"
  );
  if (!seller) {
    throw new ApiError(400, "seller not found");
  }
  return res.status(200).json(new ApiResponce(200, "seller fetched!!", seller));
});

//get seller details by ID (for public access)
const getSellerDetails = asyncHandler(async (req, res, next) => {
  const { sellerId } = req.params;
  if (!sellerId) {
    throw new ApiError(400, "Seller ID is required");
  }

  const seller = await Seller.findById(sellerId).select(
    "-password -refreshToken"
  );
  if (!seller) {
    throw new ApiError(404, "Seller not found");
  }

  return res
    .status(200)
    .json(
      new ApiResponce(200, "Seller details fetched successfully", { seller })
    );
});

export {
  registerSeller,
  loginSeller,
  logoutSeller,
  refreshAccessTokenSeller,
  changeSellerCurrentPassword,
  changeSellerForgotedPassword,
  forgotSellerPassword,
  resetSellerPassword,
  updateSellerEmail,
  updateSellerMobileNumber,
  updateSellerProfile,
  getCurrentSeller,
  getLoginAfterRefresh,
  getSellerAllProducts,
  approveSellerStatus,
  rejectSellerStatus,
  getAllSellers,
  removeSeller,
  getSeller,
  getSellerDetails,
};
