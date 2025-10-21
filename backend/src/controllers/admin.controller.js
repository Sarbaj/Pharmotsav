import { Admin } from "../models/admin.model.js";
import { Seller } from "../models/seller.model.js";
import { Buyer } from "../models/buyer.model.js";
import { AdminNotification } from "../models/adminNotification.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponce } from "../utils/ApiResponce.js";

//function to genarate accessToken and refreshToken for admin
const genarateRefreshToken_genarateAccessToken_for_admin = async (userid) => {
  try {
    const admin = await Admin.findById(userid);
    if (!admin)
      throw new ApiError(404, "Admin not found while genrating usertokens");

    const accessToken = await admin.generateAccessToken();
    const refreshToken = await admin.generateRefreshToken();

    admin.refreshToken = refreshToken;
    await admin.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(500, "Something went wrong while genrating usertokens");
  }
};

//admin register controller
const memberRegisterController = asyncHandler(async (req, res, next) => {
  const { name, email, password } = req.body;

  //cheak if admin already exist with the email
  const existingAdmin = await Admin.findOne({ email });
  if (existingAdmin) {
    console.log(existingAdmin);
    throw new ApiError(400, "Admin already exist with this email");
  }

  //create new admin
  const newAdmin = await Admin.create({
    name,
    email,
    password,
    role: "member",
  });

  //send responce
  return res.status(201).json(
    new ApiResponce(201, "member registered successfully", {
      admin: newAdmin,
    })
  );
});

//admin login controller
const adminLoginController = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  //cheak if admin exist with the email
  const admin = await Admin.findOne({ email });
  if (!admin) throw new ApiError(404, "Admin not found with this email");
  //cheak if password is correct
  const isPasswordMatched = await admin.isPasswordCorrect(password);
  if (!isPasswordMatched) throw new ApiError(401, "Invalid credentials");
  //genarate accessToken and refreshToken for admin
  const { accessToken, refreshToken } =
    await genarateRefreshToken_genarateAccessToken_for_admin(admin._id);
  //send responce
  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("refreshToken", refreshToken, options)
    .cookie("accessToken", accessToken, options)
    .json(
      new ApiResponce(200, "admin logged in successfully", {
        admin: admin,
        accessToken,
        refreshToken,
        role: admin.role,
      })
    );
});

//admin logout controller
const adminLogoutController = asyncHandler(async (req, res, next) => {
  //find admin and remove refreshToken
  await Admin.findByIdAndUpdate(
    req.admin?._id,
    {
      $unset: {
        refreshToken: 1,
      },
    },
    { new: true }
  );

  //send responce
  const options = {
    httpOnly: true,
    secure: true,
  };
  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponce(200, "admin LoggedOut", {}));
});

//member logout controller
const memberLogoutController = asyncHandler(async (req, res, next) => {
  //find admin and remove refreshToken
  await Admin.findByIdAndUpdate(
    req.member?._id,
    {
      $unset: {
        refreshToken: 1,
      },
    },
    { new: true }
  );

  //send responce
  const options = {
    httpOnly: true,
    secure: true,
  };
  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponce(200, "member LoggedOut", {}));
});

//remove member controller
const removeMemberController = asyncHandler(async (req, res, next) => {
  const { memberId } = req.body;

  //cheak if memberId is provided
  if (!memberId) throw new ApiError(400, "Please provide memberId");

  //find member and remove
  const member = await Admin.findById(memberId);
  if (!member) throw new ApiError(404, "Member not found with this id");
  if (member.role !== "member")
    throw new ApiError(400, "You can not remove admin");

  const deleted = await Admin.findByIdAndDelete(memberId);
  if (!deleted)
    throw new ApiError(500, "Something went wrong while removing member");

  //send responce
  return res
    .status(200)
    .json(new ApiResponce(200, "Member removed successfully", {}));
});

//get all members controller
const getAllMembersController = asyncHandler(async (req, res, next) => {
  const members = await Admin.find({ role: "member" }).select(
    "-password -refreshToken"
  );
  if (!members) {
    throw new ApiError(404, "No members found");
  }
  return res
    .status(200)
    .json(
      new ApiResponce(200, "All members fetched successfully", { members })
    );
});

//get all sellers controller
const getAllSellersController = asyncHandler(async (req, res, next) => {
  const sellers = await Seller.find({}).select("-password -refreshToken");
  if (!sellers) {
    throw new ApiError(404, "No sellers found");
  }
  return res
    .status(200)
    .json(
      new ApiResponce(200, "All sellers fetched successfully", { sellers })
    );
});

//get all buyers controller
const getAllBuyersController = asyncHandler(async (req, res, next) => {
  const buyers = await Buyer.find({}).select("-password -refreshToken");
  if (!buyers) {
    throw new ApiError(404, "No buyers found");
  }
  return res
    .status(200)
    .json(new ApiResponce(200, "All buyers fetched successfully", { buyers }));
});

//approve seller controller
const approveSellerController = asyncHandler(async (req, res, next) => {
  const { sellerId } = req.params;
  const { status } = req.body; // 'approved' or 'rejected'

  if (!sellerId) {
    throw new ApiError(400, "Seller ID is required");
  }

  if (!status || !["approved", "rejected"].includes(status)) {
    throw new ApiError(400, "Status must be either 'approved' or 'rejected'");
  }

  const seller = await Seller.findById(sellerId);
  if (!seller) {
    throw new ApiError(404, "Seller not found");
  }

  seller.status = status;
  await seller.save();

  return res.status(200).json(
    new ApiResponce(200, `Seller ${status} successfully`, {
      seller: {
        _id: seller._id,
        firstName: seller.firstName,
        lastName: seller.lastName,
        email: seller.email,
        CompanyName: seller.CompanyName,
        status: seller.status,
      },
    })
  );
});

//get seller by ID controller
const getSellerByIdController = asyncHandler(async (req, res, next) => {
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
    .json(new ApiResponce(200, "Seller fetched successfully", { seller }));
});

//get buyer by ID controller
const getBuyerByIdController = asyncHandler(async (req, res, next) => {
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
    .json(new ApiResponce(200, "Buyer fetched successfully", { buyer }));
});

//get sellers by status controller
const getSellersByStatusController = asyncHandler(async (req, res, next) => {
  const { status } = req.params; // 'pending', 'approved', 'rejected'

  if (!status || !["pending", "approved", "rejected"].includes(status)) {
    throw new ApiError(
      400,
      "Status must be 'pending', 'approved', or 'rejected'"
    );
  }

  const sellers = await Seller.find({ status }).select(
    "-password -refreshToken"
  );

  return res.status(200).json(
    new ApiResponce(
      200,
      `Sellers with status '${status}' fetched successfully`,
      {
        sellers,
        count: sellers.length,
      }
    )
  );
});

// Get all admin notifications (inquiry tracking)
const getAdminNotificationsController = asyncHandler(async (req, res, next) => {
  const { status, limit = 50 } = req.query;

  let query = { isActive: true };
  if (status && ["unread", "read"].includes(status)) {
    query.status = status;
  }

  const notifications = await AdminNotification.find(query)
    .populate(
      "buyerId",
      "firstName lastName email mobileNumber country natureOfBusiness"
    )
    .populate(
      "sellerId",
      "firstName lastName email CompanyName mobileNumber location"
    )
    .populate("productId", "productName productImage description")
    .populate("inquiryId", "status createdAt")
    .sort({ createdAt: -1 })
    .limit(parseInt(limit));

  const totalCount = await AdminNotification.countDocuments({ isActive: true });
  const unreadCount = await AdminNotification.countDocuments({
    status: "unread",
    isActive: true,
  });

  return res.status(200).json(
    new ApiResponce(200, "Admin notifications fetched successfully", {
      notifications,
      stats: {
        total: totalCount,
        unread: unreadCount,
        read: totalCount - unreadCount,
      },
    })
  );
});

// Mark notification as read
const markNotificationAsReadController = asyncHandler(
  async (req, res, next) => {
    const { notificationId } = req.params;

    if (!notificationId) {
      throw new ApiError(400, "Notification ID is required");
    }

    const notification = await AdminNotification.findById(notificationId);
    if (!notification) {
      throw new ApiError(404, "Notification not found");
    }

    notification.status = "read";
    await notification.save();

    return res
      .status(200)
      .json(
        new ApiResponce(200, "Notification marked as read", { notification })
      );
  }
);

// Mark all notifications as read
const markAllNotificationsAsReadController = asyncHandler(
  async (req, res, next) => {
    await AdminNotification.updateMany(
      { status: "unread", isActive: true },
      { status: "read" }
    );

    return res
      .status(200)
      .json(new ApiResponce(200, "All notifications marked as read", {}));
  }
);

export {
  memberRegisterController,
  adminLoginController,
  adminLogoutController,
  removeMemberController,
  getAllMembersController,
  memberLogoutController,
  getAllSellersController,
  getAllBuyersController,
  approveSellerController,
  getSellerByIdController,
  getBuyerByIdController,
  getSellersByStatusController,
  getAdminNotificationsController,
  markNotificationAsReadController,
  markAllNotificationsAsReadController,
};
