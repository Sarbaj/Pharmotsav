// API Configuration
export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:4000";

// API Endpoints
export const API_ENDPOINTS = {
  // Auth
  AUTH: {
    BUYER_LOGIN: "/api/v1/buyers/login-buyer",
    SELLER_LOGIN: "/api/v1/sellers/login-seller",
    BUYER_LOGIN_AFTER_REFRESH: "/api/v1/buyers/login-after-refresh",
    SELLER_LOGIN_AFTER_REFRESH: "/api/v1/sellers/login-after-refresh",
  },

  // Buyers
  BUYERS: {
    REGISTER: "/api/v1/buyers/register-buyer",
    UPDATE_PROFILE: "/api/v1/buyers/update-buyer-profile",
    UPDATE_EMAIL: "/api/v1/buyers/update-buyer-email",
    UPDATE_MOBILE: "/api/v1/buyers/update-buyer-mobile",
    CHANGE_PASSWORD: "/api/v1/buyers/change-password-buyer",
    FORGOT_PASSWORD: "/api/v1/buyers/forgot-password",
    DETAILS: "/api/v1/buyers/details",
  },

  // Sellers
  SELLERS: {
    REGISTER: "/api/v1/sellers/register-seller",
    UPDATE_PROFILE: "/api/v1/sellers/update-seller-profile",
    UPDATE_EMAIL: "/api/v1/sellers/update-seller-email",
    UPDATE_MOBILE: "/api/v1/sellers/update-seller-mobile",
    CHANGE_PASSWORD: "/api/v1/sellers/change-password-seller",
    FORGOT_PASSWORD: "/api/v1/sellers/forgot-password",
    DETAILS: "/api/v1/sellers/details",
  },

  // OTP
  OTP: {
    INITIATE: "/api/v1/otp/initiate",
    VERIFY: "/api/v1/otp/verify",
    BUYER_PHONE_INITIATE: "/api/v1/otp/buyer/phone/initiate",
    BUYER_PHONE_VERIFY: "/api/v1/otp/buyer/phone/verify",
    BUYER_EMAIL_INITIATE: "/api/v1/otp/buyer/email/initiate",
    BUYER_EMAIL_VERIFY: "/api/v1/otp/buyer/email/verify",
    BUYER_PHONE_UPDATE_INITIATE: "/api/v1/otp/buyer/phone/update/initiate",
    BUYER_PHONE_UPDATE_VERIFY: "/api/v1/otp/buyer/phone/update/verify",
    BUYER_EMAIL_UPDATE_INITIATE: "/api/v1/otp/buyer/email/update/initiate",
    BUYER_EMAIL_UPDATE_VERIFY: "/api/v1/otp/buyer/email/update/verify",
    SELLER_EMAIL_INITIATE: "/api/v1/otp/seller/email/initiate",
    SELLER_EMAIL_VERIFY: "/api/v1/otp/seller/email/verify",
    SELLER_PHONE_UPDATE_INITIATE: "/api/v1/otp/seller/phone/update/initiate",
    SELLER_PHONE_UPDATE_VERIFY: "/api/v1/otp/seller/phone/update/verify",
    SELLER_EMAIL_UPDATE_INITIATE: "/api/v1/otp/seller/email/update/initiate",
    SELLER_EMAIL_UPDATE_VERIFY: "/api/v1/otp/seller/email/update/verify",
  },

  // Products
  PRODUCTS: {
    ADD: "/api/v1/products/add-product",
    GET_ALL_FULL: "/api/v1/products/get-all-products-full",
    GET_BY_CATEGORY_FULL: "/api/v1/products/get-products-by-category-full",
  },

  // Categories
  CATEGORIES: {
    GET_ALL: "/api/v1/categories/get-all-categories",
    ADD: "/api/v1/categories/add-category",
    DELETE: "/api/v1/categories/delete-category",
  },

  // Inquiries
  INQUIRIES: {
    CREATE: "/api/v1/inquiries/create-inquiry",
    BUYER: "/api/v1/inquiries/buyer",
    RECENT: "/api/v1/inquiries/recent",
    SELLER: "/api/v1/inquiries/seller",
    SELLER_RECENT: "/api/v1/inquiries/seller-recent",
    UPDATE_STATUS: "/api/v1/inquiries/update-status",
    DELETE: "/api/v1/inquiries/delete",
    MOVE_TO_RECENT: "/api/v1/inquiries/move-to-recent",
  },

  // Contact
  CONTACT: {
    SUBMIT: "/api/v1/contact",
    GET_ALL: "/api/v1/contact",
    UPDATE: "/api/v1/contact",
    STATS: "/api/v1/contact/stats",
  },

  // Admin
  ADMIN: {
    LOGIN: "/api/v1/admin/login-admin",
    GET_ALL_BUYERS: "/api/v1/admin/get-all-buyers",
    GET_ALL_SELLERS: "/api/v1/admin/get-all-sellers",
    APPROVE_SELLER: "/api/v1/admin/approve-seller",
    NOTIFICATIONS: "/api/v1/admin/notifications",
    MARK_NOTIFICATION_READ: "/api/v1/admin/notifications",
    MARK_ALL_NOTIFICATIONS_READ: "/api/v1/admin/notifications/mark-all-read",
  },
};
