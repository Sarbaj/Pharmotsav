import express from "express";
import {
  createContactMessage,
  getAllContactMessages,
  getContactMessageById,
  updateContactMessageStatus,
  deleteContactMessage,
  getContactStats,
} from "../controllers/contact.controller.js";
import { verifyJwtAdmin } from "../middlewares/auth.middleware.js";

const contactRouter = express.Router();

// Public route - anyone can send a contact message
contactRouter.route("/").post(createContactMessage);

// Admin routes - require admin authentication
contactRouter.route("/").get(verifyJwtAdmin, getAllContactMessages);
contactRouter.route("/stats").get(verifyJwtAdmin, getContactStats);
contactRouter.route("/:id").get(verifyJwtAdmin, getContactMessageById);
contactRouter.route("/:id").put(verifyJwtAdmin, updateContactMessageStatus);
contactRouter.route("/:id").delete(verifyJwtAdmin, deleteContactMessage);

export { contactRouter };
