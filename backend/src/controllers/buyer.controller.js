import { Buyer } from "../models/buyer.model.js";
import jwt from "jsonwebtoken";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponce } from "../utils/ApiResponce.js";

//genarate a tokens for buyer
const genarateRefreshToken_genarateAccessToken_for_buyer = async (userid) => {
  try {
    const buyer = await Buyer.findById(userid);
    if (!buyer)
      throw new ApiError(404, "Buyer not found while genrating usertokens");

    const accessToken = await buyer.generateAccessToken();
    const refreshToken = await buyer.generateRefreshToken();

    buyer.refreshToken = refreshToken;
    await buyer.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(500, "Something went wrong while genrating usertokens");
  }
};

//register buyer
const registerBuyer = asyncHandler(async (req, res) => {
  const {
    firstName,
    lastName,
    email,
    mobileNumber,
    password,
    country,
    natureOfBusiness,
  } = req.body;

  //cheak if field are provided
  if (
    !firstName ||
    !lastName ||
    !email ||
    !mobileNumber ||
    !password ||
    !country
  ) {
    throw new ApiError(400, "Please provide all required fields");
  }

  //cheak if buyer already exists
  const existingBuyer = await Buyer.findOne({
    $or: [{ email }, { mobileNumber }],
  });

  if (existingBuyer) {
    throw new ApiError(
      409,
      "Buyer with this email or mobile number already exists"
    );
  }

  //create new buyer
  const buyer = await Buyer.create({
    firstName,
    lastName,
    email,
    password,
    mobileNumber,
    country,
    natureOfBusiness,
  });

  //see if buyer is created or not

  const newBuyer = await Buyer.findById(buyer._id).select(
    "-password -refreshToken"
  );
  if (!newBuyer) {
    throw new ApiError(500, "Something went wrong while creating buyer");
  }

  //return buyer
  return res
    .status(201)
    .json(new ApiResponce(201, "Buyer registered successfully", newBuyer));
});

//login buyer
const loginBuyer = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  //cheak if field are provided
  if (!email || !password) {
    throw new ApiError(400, "Please provide all required fields");
  }

  //cheak if buyer exists
  const buyer = await Buyer.findOne({ email });
  if (!buyer) {
    throw new ApiError(404, "Buyer not found with this email");
  }

  //cheak if password is correct
  const isPasswordMatched = await buyer.isPasswordCorrect(password);
  if (!isPasswordMatched) {
    throw new ApiError(401, "Invalid credentials");
  }

  //genarate accessToken and refreshToken
  const { accessToken, refreshToken } =
    await genarateRefreshToken_genarateAccessToken_for_buyer(buyer._id);

  //return buyer
  const loggedInBuyer = await Buyer.findById(buyer._id).select(
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
      new ApiResponce(200, "Buyer logged in successfully", {
        buyer: loggedInBuyer,
        accessToken,
        refreshToken,
      })
    );
});

//logout buyer
const logoutBuyer = asyncHandler(async (req, res) => {
  await Buyer.findByIdAndUpdate(
    req.buyer?._id,
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
    .json(new ApiResponce(200, {}, "buyer LoggedOut"));
});

//refresh access token for buyer
const refreshAccessTokenBuyer = asyncHandler(async (req, res) => {
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
    const buyer = await Buyer.findById(data?._id);

    if (!buyer) {
      throw new ApiError(401, "invalid refreshToken");
    }

    //cheak if the buyer have same refreshToken or not

    if (incomingRefreshToken !== buyer?.refreshToken) {
      throw new ApiError(401, "refreshToken dosent match");
    }

    const options = {
      httpOnly: true,
      secure: true,
    };
    const { accessToken, refreshToken } =
      await genarateRefreshToken_genarateAccessToken_for_buyer(buyer._id);

    const savebuyer = await Buyer.findById(buyer._id).select(
      "-password -refreshToken"
    );

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json(
        new ApiResponce(200, "Token refresh successfully", {
          savebuyer,
          accessToken,
          refreshToken,
        })
      );
  } catch (error) {
    throw new ApiError(500, error?.message || "Invalid refreshToken");
  }
});

//get login after refresh
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

    //use id to fetch the buyer
    const buyer = await Buyer.findById(data?._id);

    if (!buyer) {
      throw new ApiError(401, "invalid refreshToken");
    }

    //cheak if the buyer have same refreshToken or not

    if (incomingRefreshToken !== buyer?.refreshToken) {
      throw new ApiError(401, "refreshToken dosent match");
    }

    const savebuyer = await Buyer.findById(buyer._id).select(
      "-password -refreshToken"
    );
    return res
      .status(200)
      .json(new ApiResponce(200, "Buyer fetched successfully", savebuyer));
  } catch (error) {
    throw new ApiError(500, error?.message || "Invalid refreshToken");
  }
});

//change buyer  Password
const changeBuyerCurrentPassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  if (!oldPassword || !newPassword) {
    throw new ApiError(401, "Both field are required (passwords)");
  }

  const buyer = await Buyer.findById(req.buyer?._id);

  if (!buyer) {
    throw new ApiError(401, "loggedIn first to change password");
  }
  const ispasswordValid = await buyer.isPasswordCorrect(oldPassword);

  if (!ispasswordValid) {
    throw new ApiError(401, "password should correct");
  }

  buyer.password = newPassword;
  await buyer.save({ validateBeforeSave: false });
  return res
    .status(200)
    .json(new ApiResponce(200, "password change successfully...", {}));
});

//change forgotten password
const changeBuyerForgotedPassword = asyncHandler(async (req, res) => {
  const { newPassword, isVarified } = req.body;

  if (!isVarified) {
    throw new ApiError(401, "buyer is not varified");
  }
  if (!newPassword) {
    throw new ApiError(401, "field is required");
  }
  const buyer = await Buyer.findById(req.buyer?._id);
  if (!buyer) {
    throw new ApiError(401, "loggedIn first to change password");
  }

  buyer.password = newPassword;
  await buyer.save({ validateBeforeSave: false });
  return res
    .status(200)
    .json(new ApiResponce(200, "password chagne successfully..", {}));
});

//update buyer profile
const updateBuyerProfile = asyncHandler(async (req, res) => {
  const {
    firstName,
    lastName,
    email,
    mobileNumber,
    country,
    natureOfBuisness,
  } = req.body;

  if (!firstName || !lastName || !email || !mobileNumber || !country) {
    throw new ApiError(400, "Please provide all required fields");
  }

  const buyer = await Buyer.findByIdAndUpdate(
    req.buyer?._id,
    {
      firstName,
      lastName,
      email,
      mobileNumber,
      country,
      natureOfBuisness,
    },
    {
      new: true,
    }
  ).select("-password -refreshToken");

  return res
    .status(200)
    .json(new ApiResponce(200, "User profile updated successfully", buyer));
});

//get current buyer
const getCurrentBuyer = asyncHandler(async (req, res) => {
  const buyer = await Buyer.findById(req.buyer?._id).select(
    "-password -refreshToken"
  );

  if (!buyer) {
    throw new ApiError(404, "User not found");
  }
  return res
    .status(200)
    .json(new ApiResponce(200, "Current buyer fetched successfully", buyer));
});

//get all buyers
const getAllBuyers = asyncHandler(async (req, res) => {
  const buyers = await Buyer.find().select("-password -refreshToken");

  return res
    .status(200)
    .json(new ApiResponce(200, "All buyers fetched successfully", buyers));
});

//remove buyer
const removeBuyer = asyncHandler(async (req, res) => {
  const { buyerId } = req.body;
  if (!buyerId) {
    throw new ApiError(400, "buyerId is required");
  }
  const deleted = await Buyer.findByIdAndDelete(buyerId);

  if (!deleted) {
    throw new ApiError(404, "User not found");
  }
  return res
    .status(200)
    .json(new ApiResponce(200, "Buyer removed successfully", {}));
});

//get buyer
const getBuyer = asyncHandler(async (req, res) => {
  const { buyerId } = req.body;
  if (!buyerId) {
    throw new ApiError(400, "buyerId is required");
  }
  const buyer = await Buyer.findById(buyerId).select("-password -refreshToken");

  if (!buyer) {
    throw new ApiError(404, "User not found");
  }
  return res
    .status(200)
    .json(new ApiResponce(200, "Buyer fetched successfully", buyer));
});

//get buyer details by ID (for public access)
const getBuyerDetails = asyncHandler(async (req, res, next) => {
  const { buyerId } = req.params;
  if (!buyerId) {
    throw new ApiError(400, "Buyer ID is required");
  }

  const buyer = await Buyer.findById(buyerId).select("-password -refreshToken");
  if (!buyer) {
    throw new ApiError(404, "Buyer not found");
  }

  return res
    .status(200)
    .json(
      new ApiResponce(200, "Buyer details fetched successfully", { buyer })
    );
});

export {
  registerBuyer,
  loginBuyer,
  logoutBuyer,
  refreshAccessTokenBuyer,
  changeBuyerCurrentPassword,
  changeBuyerForgotedPassword,
  updateBuyerProfile,
  getCurrentBuyer,
  getAllBuyers,
  removeBuyer,
  getBuyer,
  getLoginAfterRefresh,
  getBuyerDetails,
};
