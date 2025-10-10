import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(cookieParser());
app.use(express.static("public"));

//import routes
import buyerRouter from "./routes/buyer.routes.js";
import sellerRouter from "./routes/seller.routes.js";
import productRouter from "./routes/product.routes.js";
import adminRouter from "./routes/admin.routes.js";
import categoryRouter from "./routes/category.routes.js";
import inquiryRouter from "./routes/inquiry.routes.js";
import { otpRouter } from "./routes/otp.routes.js";
import { contactRouter } from "./routes/contact.routes.js";

app.use("/api/v1/buyers", buyerRouter);
app.use("/api/v1/sellers", sellerRouter);
app.use("/api/v1/products", productRouter);
app.use("/api/v1/admin", adminRouter);
app.use("/api/v1/categories", categoryRouter);
app.use("/api/v1/inquiries", inquiryRouter);
app.use("/api/v1/otp", otpRouter);
app.use("/api/v1/contact", contactRouter);

// Global error handler
app.use((err, req, res, next) => {
  console.error("Global Error Handler:", err);

  if (err.name === "ValidationError") {
    return res.status(400).json({
      success: false,
      message: "Validation Error",
      error: err.message,
    });
  }

  if (err.name === "CastError") {
    return res.status(400).json({
      success: false,
      message: "Invalid ID format",
      error: err.message,
    });
  }

  // Handle ApiError
  if (err.statusCode) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      error: err.message,
    });
  }

  // Default error
  return res.status(500).json({
    success: false,
    message: "Internal Server Error",
    error: err.message || "Something went wrong",
  });
});

export default app;
