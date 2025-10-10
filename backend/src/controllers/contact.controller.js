import { Contact } from "../models/contact.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponce } from "../utils/ApiResponce.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// Create a new contact message
const createContactMessage = asyncHandler(async (req, res) => {
  const { name, email, subject, message } = req.body;

  // Validate required fields
  if (!name || !email || !message) {
    throw new ApiError(400, "Name, email, and message are required");
  }

  // Create new contact message
  const contactMessage = await Contact.create({
    name,
    email,
    subject: subject || "",
    message,
    status: "new",
    priority: "medium",
  });

  return res
    .status(201)
    .json(
      new ApiResponce(201, "Message sent successfully", { contactMessage })
    );
});

// Get all contact messages (admin only)
const getAllContactMessages = asyncHandler(async (req, res) => {
  const { status, priority, page = 1, limit = 10 } = req.query;

  // Build filter object
  const filter = {};
  if (status) filter.status = status;
  if (priority) filter.priority = priority;

  // Calculate pagination
  const skip = (parseInt(page) - 1) * parseInt(limit);

  // Get messages with pagination
  const messages = await Contact.find(filter)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit))
    .populate("repliedBy", "name email");

  // Get total count for pagination
  const totalMessages = await Contact.countDocuments(filter);

  return res.status(200).json(
    new ApiResponce(200, "Messages retrieved successfully", {
      messages,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalMessages / parseInt(limit)),
        totalMessages,
        hasNext: skip + messages.length < totalMessages,
        hasPrev: parseInt(page) > 1,
      },
    })
  );
});

// Get a single contact message by ID
const getContactMessageById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const message = await Contact.findById(id).populate(
    "repliedBy",
    "name email"
  );

  if (!message) {
    throw new ApiError(404, "Message not found");
  }

  return res
    .status(200)
    .json(new ApiResponce(200, "Message retrieved successfully", { message }));
});

// Update contact message status
const updateContactMessageStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status, adminNotes, priority } = req.body;

  const updateData = {};
  if (status) updateData.status = status;
  if (adminNotes !== undefined) updateData.adminNotes = adminNotes;
  if (priority) updateData.priority = priority;

  // If status is being changed to "replied", set repliedAt and repliedBy
  if (status === "replied") {
    updateData.repliedAt = new Date();
    updateData.repliedBy = req.admin._id;
  }

  const message = await Contact.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  }).populate("repliedBy", "name email");

  if (!message) {
    throw new ApiError(404, "Message not found");
  }

  return res
    .status(200)
    .json(new ApiResponce(200, "Message updated successfully", { message }));
});

// Delete contact message
const deleteContactMessage = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const message = await Contact.findByIdAndDelete(id);

  if (!message) {
    throw new ApiError(404, "Message not found");
  }

  return res
    .status(200)
    .json(new ApiResponce(200, "Message deleted successfully"));
});

// Get contact message statistics
const getContactStats = asyncHandler(async (req, res) => {
  const stats = await Contact.aggregate([
    {
      $group: {
        _id: "$status",
        count: { $sum: 1 },
      },
    },
  ]);

  const priorityStats = await Contact.aggregate([
    {
      $group: {
        _id: "$priority",
        count: { $sum: 1 },
      },
    },
  ]);

  const totalMessages = await Contact.countDocuments();
  const newMessages = await Contact.countDocuments({ status: "new" });

  return res.status(200).json(
    new ApiResponce(200, "Statistics retrieved successfully", {
      statusStats: stats,
      priorityStats,
      totalMessages,
      newMessages,
    })
  );
});

export {
  createContactMessage,
  getAllContactMessages,
  getContactMessageById,
  updateContactMessageStatus,
  deleteContactMessage,
  getContactStats,
};
