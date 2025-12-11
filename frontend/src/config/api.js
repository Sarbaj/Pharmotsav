// API Configuration
export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:4000";

// API Endpoints - All endpoints use the base URL from environment variable
export const API_ENDPOINTS = {
  // Auth
  AUTH: {
    BUYER_LOGIN: `${API_BASE_URL}/api/v1/buyers/login-buyer`,
    SELLER_LOGIN: `${API_BASE_URL}/api/v1/sellers/login-seller`,
    BUYER_LOGIN_AFTER_REFRESH: `${API_BASE_URL}/api/v1/buyers/login-after-refresh`,
    SELLER_LOGIN_AFTER_REFRESH: `${API_BASE_URL}/api/v1/sellers/login-after-refresh`,
  },

  // Buyers
  BUYERS: {
    REGISTER: `${API_BASE_URL}/api/v1/buyers/register-buyer`,
    UPDATE_PROFILE: `${API_BASE_URL}/api/v1/buyers/update-buyer-profile`,
    CHANGE_PASSWORD: `${API_BASE_URL}/api/v1/buyers/change-password-buyer`,
    DETAILS: `${API_BASE_URL}/api/v1/buyers/details`, // Public route for buyer details
  },

  // Sellers
  SELLERS: {
    REGISTER: `${API_BASE_URL}/api/v1/sellers/register-seller`,
    UPDATE_PROFILE: `${API_BASE_URL}/api/v1/sellers/update-seller-profile`,
    UPDATE_EMAIL: `${API_BASE_URL}/api/v1/sellers/update-seller-email`,
    UPDATE_MOBILE: `${API_BASE_URL}/api/v1/sellers/update-seller-mobile`,
    CHANGE_PASSWORD: `${API_BASE_URL}/api/v1/sellers/change-password-seller`,
    FORGOT_PASSWORD: `${API_BASE_URL}/api/v1/sellers/forgot-password`,
    DETAILS: `${API_BASE_URL}/api/v1/sellers/details`,
    MY_PRODUCTS: `${API_BASE_URL}/api/v1/sellers/my-products`,
  },

  // OTP
  OTP: {
    INITIATE: `${API_BASE_URL}/api/v1/otp/initiate`,
    VERIFY: `${API_BASE_URL}/api/v1/otp/verify`,
    BUYER_PHONE_INITIATE: `${API_BASE_URL}/api/v1/otp/buyer/phone/initiate`,
    BUYER_PHONE_VERIFY: `${API_BASE_URL}/api/v1/otp/buyer/phone/verify`,
    BUYER_EMAIL_INITIATE: `${API_BASE_URL}/api/v1/otp/buyer/email/initiate`,
    BUYER_EMAIL_VERIFY: `${API_BASE_URL}/api/v1/otp/buyer/email/verify`,
    BUYER_PHONE_UPDATE_INITIATE: `${API_BASE_URL}/api/v1/otp/buyer/phone/update/initiate`,
    BUYER_PHONE_UPDATE_VERIFY: `${API_BASE_URL}/api/v1/otp/buyer/phone/update/verify`,
    BUYER_EMAIL_UPDATE_INITIATE: `${API_BASE_URL}/api/v1/otp/buyer/email/update/initiate`,
    BUYER_EMAIL_UPDATE_VERIFY: `${API_BASE_URL}/api/v1/otp/buyer/email/update/verify`,
    SELLER_EMAIL_INITIATE: `${API_BASE_URL}/api/v1/otp/seller/email/initiate`,
    SELLER_EMAIL_VERIFY: `${API_BASE_URL}/api/v1/otp/seller/email/verify`,
    SELLER_PHONE_UPDATE_INITIATE: `${API_BASE_URL}/api/v1/otp/seller/phone/update/initiate`,
    SELLER_PHONE_UPDATE_VERIFY: `${API_BASE_URL}/api/v1/otp/seller/phone/update/verify`,
    SELLER_EMAIL_UPDATE_INITIATE: `${API_BASE_URL}/api/v1/otp/seller/email/update/initiate`,
    SELLER_EMAIL_UPDATE_VERIFY: `${API_BASE_URL}/api/v1/otp/seller/email/update/verify`,
  },

  // Products
  PRODUCTS: {
    ADD: `${API_BASE_URL}/api/v1/products/add-product`,
    GET_ALL_FULL: `${API_BASE_URL}/api/v1/products/get-all-products-full`,
    GET_BY_CATEGORY_FULL: `${API_BASE_URL}/api/v1/products/get-products-by-category-full`,
  },

  // Categories
  CATEGORIES: {
    GET_ALL: `${API_BASE_URL}/api/v1/categories/get-all-categories`,
    ADD: `${API_BASE_URL}/api/v1/categories/add-category`,
    UPDATE: `${API_BASE_URL}/api/v1/categories/update-category`,
    DELETE: `${API_BASE_URL}/api/v1/categories/delete-category`,
    // Admin Category Routes
    ADMIN_GET_ALL: `${API_BASE_URL}/api/v1/admin/get-all-categories`,
    ADMIN_ADD: `${API_BASE_URL}/api/v1/admin/add-category`,
    ADMIN_UPDATE: `${API_BASE_URL}/api/v1/admin/update-category`,
    ADMIN_DELETE: `${API_BASE_URL}/api/v1/admin/delete-category`,
  },

  // Inquiries
  INQUIRIES: {
    CREATE: `${API_BASE_URL}/api/v1/inquiries/create-inquiry`,
    BUYER: `${API_BASE_URL}/api/v1/inquiries/buyer`,
    RECENT: `${API_BASE_URL}/api/v1/inquiries/recent`,
    SELLER: `${API_BASE_URL}/api/v1/inquiries/seller`,
    SELLER_RECENT: `${API_BASE_URL}/api/v1/inquiries/seller-recent`,
    UPDATE_STATUS: `${API_BASE_URL}/api/v1/inquiries/update-status`,
    DELETE: `${API_BASE_URL}/api/v1/inquiries/delete`,
    MOVE_TO_RECENT: `${API_BASE_URL}/api/v1/inquiries/move-to-recent`,
  },

  // Contact
  CONTACT: {
    SUBMIT: `${API_BASE_URL}/api/v1/contact`,
    GET_ALL: `${API_BASE_URL}/api/v1/contact`,
    UPDATE: `${API_BASE_URL}/api/v1/contact`,
    DELETE: `${API_BASE_URL}/api/v1/contact`,
    STATS: `${API_BASE_URL}/api/v1/contact/stats`,
  },

  // Admin
  ADMIN: {
    LOGIN: `${API_BASE_URL}/api/v1/admin/login-admin`,
    GET_ALL_BUYERS: `${API_BASE_URL}/api/v1/admin/get-all-buyers`,
    GET_ALL_SELLERS: `${API_BASE_URL}/api/v1/admin/get-all-sellers`,
    APPROVE_SELLER: `${API_BASE_URL}/api/v1/admin/approve-seller`,
    NOTIFICATIONS: `${API_BASE_URL}/api/v1/admin/notifications`,
    MARK_NOTIFICATION_READ: `${API_BASE_URL}/api/v1/admin/notifications`,
    MARK_ALL_NOTIFICATIONS_READ: `${API_BASE_URL}/api/v1/admin/notifications/mark-all-read`,
  },
};
