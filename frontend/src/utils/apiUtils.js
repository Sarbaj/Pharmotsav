// API utility functions with automatic logout on token expiration

/**
 * Handles logout for both buyer and seller
 */
export const handleLogout = () => {
  // Clear all auth-related data from localStorage
  localStorage.removeItem("token");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("user");
  localStorage.removeItem("role");
  localStorage.removeItem("buyerId");
  
  // Redirect to login page
  window.location.href = "/login";
};

/**
 * Handles logout for admin
 */
export const handleAdminLogout = () => {
  // Clear admin auth data
  localStorage.removeItem("adminToken");
  localStorage.removeItem("adminUser");
  
  // Redirect to admin login page
  window.location.href = "/login-admin";
};

/**
 * Enhanced fetch wrapper that automatically handles token expiration
 * @param {string} url - The API endpoint URL
 * @param {object} options - Fetch options (method, headers, body, etc.)
 * @param {boolean} isAdmin - Whether this is an admin request
 * @returns {Promise<Response>} - The fetch response
 */
export const fetchWithAuth = async (url, options = {}, isAdmin = false) => {
  try {
    const response = await fetch(url, options);
    
    // Check if response indicates token expiration or unauthorized
    if (response.status === 401) {
      const data = await response.json().catch(() => ({}));
      
      // Check if the error message indicates JWT expiration
      if (
        data.message?.toLowerCase().includes("jwt expired") ||
        data.message?.toLowerCase().includes("token expired") ||
        data.message?.toLowerCase().includes("invalid token") ||
        data.message?.toLowerCase().includes("unauthorized")
      ) {
        // Auto logout based on user type
        if (isAdmin) {
          handleAdminLogout();
        } else {
          handleLogout();
        }
        
        // Throw error to prevent further processing
        throw new Error("Session expired. Please login again.");
      }
    }
    
    return response;
  } catch (error) {
    // If it's a network error, just throw it
    if (error.message === "Session expired. Please login again.") {
      throw error;
    }
    
    // For other errors, re-throw
    throw error;
  }
};

/**
 * Helper to get authorization headers
 * @param {boolean} isAdmin - Whether to get admin token
 * @returns {object} - Headers object with Authorization
 */
export const getAuthHeaders = (isAdmin = false) => {
  const token = isAdmin 
    ? localStorage.getItem("adminToken")
    : localStorage.getItem("token");
    
  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

/**
 * Check if user is authenticated
 * @param {boolean} isAdmin - Whether to check admin authentication
 * @returns {boolean} - True if authenticated
 */
export const isAuthenticated = (isAdmin = false) => {
  if (isAdmin) {
    return !!localStorage.getItem("adminToken");
  }
  return !!localStorage.getItem("token");
};
