import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Buyer } from "../models/buyer.model.js";
import { Admin } from "../models/admin.model.js";
import { Seller } from "../models/seller.model.js";

//verify buyer
export const verifyJwtBuyer = asyncHandler(async (req, res, next) => {
  try {
    const Token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");
    if (!Token) {
      throw new ApiError(401, "unathorized request");
    }
    const data = await jwt.verify(Token, process.env.ACCESS_TOKEN_SECRET);

    const buyer = await Buyer.findById(data?._id).select(
      "-password -refreshToken"
    );

    if (!buyer) {
      throw new ApiError(401, "wrong jwt");
    }
    req.buyer = buyer;
    next();
  } catch (error) {
    throw new ApiError(500, error?.message || "invalid Token");
  }
});

//verify seller
export const verifyJwtSeller = asyncHandler(async (req, res, next) => {
  try {
    const Token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");
    if (!Token) {
      throw new ApiError(401, "unathorized request");
    }
    const data = await jwt.verify(Token, process.env.ACCESS_TOKEN_SECRET);

    const seller = await Seller.findById(data?._id).select(
      "-password -refreshToken"
    );

    if (!seller) {
      throw new ApiError(401, "wrong jwt");
    }
    req.seller = seller;
    next();
  } catch (error) {
    throw new ApiError(500, error?.message || "invalid Token");
  }
});

//verify admin
export const verifyJwtAdmin = asyncHandler(async (req, res, next) => {
  try {
    const Token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");
    if (!Token) {
      throw new ApiError(401, "unathorized request");
    }
    const data = await jwt.verify(Token, process.env.ACCESS_TOKEN_SECRET);

    const admin = await Admin.findById(data?._id).select(
      "-password -refreshToken"
    );
    if (!admin) {
      throw new ApiError(401, "wrong jwt");
    }
    if (admin.role !== "admin") {
      throw new ApiError(403, "forbidden request");
    }
    req.admin = admin;
    next();
  } catch (error) {
    throw new ApiError(500, error?.message || "invalid Token");
  }
});

//verify member (buyer or seller)
export const verifyJwtMember = asyncHandler(async (req, res, next) => {
  try {
    const Token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");
    if (!Token) {
      throw new ApiError(401, "unathorized request");
    }
    const data = await jwt.verify(Token, process.env.ACCESS_TOKEN_SECRET);

    // Try to find buyer first
    let user = await Buyer.findById(data?._id).select(
      "-password -refreshToken"
    );
    if (user) {
      req.member = user;
      req.userType = "buyer";
      return next();
    }

    // If not buyer, try to find seller
    user = await Seller.findById(data?._id).select("-password -refreshToken");
    if (user) {
      req.member = user;
      req.userType = "seller";
      return next();
    }

    // If neither buyer nor seller found
    throw new ApiError(401, "wrong jwt");
  } catch (error) {
    throw new ApiError(500, error?.message || "invalid Token");
  }
});
