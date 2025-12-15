import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../CSS/AdminDashboard.css";
import { API_BASE_URL, API_ENDPOINTS } from "../config/api";
import {
  fetchWithAuth,
  getAuthHeaders,
  handleAdminLogout,
} from "../utils/apiUtils";

const AdminDashboard = () => {
  const [adminUser, setAdminUser] = useState(null);
  const [buyers, setBuyers] = useState([]);
  const [sellers, setSellers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categories, setCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [categoryForm, setCategoryForm] = useState({
    categoryName: "",
    description: "",
  });
  const [messages, setMessages] = useState([]);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [messageStats, setMessageStats] = useState({});
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [inquiryNotifications, setInquiryNotifications] = useState([]);
  const [inquiryLoading, setInquiryLoading] = useState(false);
  const [inquiryStats, setInquiryStats] = useState({
    total: 0,
    unread: 0,
    read: 0,
  });
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const navigate = useNavigate();

  // Logout function
  const handleLogout = () => {
    handleAdminLogout();
    navigate("/admin-login");
  };

  // JWT Error Handler - Auto logout on invalid/expired token
  const handleJWTError = (response, data) => {
    if (response.status === 401 || response.status === 403 || 
        (data && (data.message?.includes('jwt') || data.message?.includes('token') || 
                  data.message?.includes('unauthorized') || data.message?.includes('expired')))) {
      console.log("JWT token invalid or expired, logging out...");
      setError("Session expired. Please login again.");
      setTimeout(() => {
        handleAdminLogout();
        navigate("/admin-login");
      }, 2000);
      return true;
    }
    return false;
  };

  // API Functions
  const fetchBuyers = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      if (!token) {
        setError("No authentication token found. Please login again.");
        handleLogout();
        return;
      }

      const response = await fetch(`${API_ENDPOINTS.ADMIN.GET_ALL_BUYERS}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      
      // Check for JWT errors first
      if (handleJWTError(response, data)) {
        return;
      }
      
      if (data.success) {
        setBuyers(data.data.buyers);
      } else {
        setError(data.message || "Failed to fetch buyers");
      }
    } catch (error) {
      console.error("Error fetching buyers:", error);
      setError("Failed to fetch buyers");
    }
  };

  const fetchSellers = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      if (!token) {
        setError("No authentication token found. Please login again.");
        handleLogout();
        return;
      }

      const response = await fetch(`${API_ENDPOINTS.ADMIN.GET_ALL_SELLERS}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      
      // Check for JWT errors first
      if (handleJWTError(response, data)) {
        return;
      }
      
      if (data.success) {
        setSellers(data.data.sellers);
      } else {
        setError(data.message || "Failed to fetch sellers");
      }
    } catch (error) {
      console.error("Error fetching sellers:", error);
      setError("Failed to fetch sellers");
    }
  };

  // Category Management Functions
  const fetchCategories = async () => {
    try {
      setCategoriesLoading(true);
      const token = localStorage.getItem("adminToken");
      if (!token) {
        setError("No authentication token found. Please login again.");
        handleLogout();
        return;
      }

      console.log("Fetching categories from:", API_ENDPOINTS.CATEGORIES.ADMIN_GET_ALL);
      console.log("Using token:", token ? "Token exists" : "No token");
      
      const response = await fetch(`${API_ENDPOINTS.CATEGORIES.ADMIN_GET_ALL}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      
      console.log("Response status:", response.status);
      console.log("Response headers:", response.headers);
      
      if (!response.ok) {
        console.error("Response not OK:", response.status, response.statusText);
        if (response.status === 404) {
          setError("Admin categories endpoint not found. Please check if the backend server is running.");
          return;
        }
      }
      
      const data = await response.json();
      console.log("Categories response data:", data);
      
      // Check for JWT errors first
      if (handleJWTError(response, data)) {
        return;
      }
      
      if (data.success) {
        setCategories(data.data);
      } else {
        setError(data.message || "Failed to fetch categories");
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
      
      // Fallback: Try the regular categories endpoint
      try {
        console.log("Trying fallback categories endpoint...");
        const fallbackResponse = await fetch(`${API_ENDPOINTS.CATEGORIES.GET_ALL}`);
        const fallbackData = await fallbackResponse.json();
        
        if (fallbackData.success) {
          console.log("Fallback successful, using regular categories endpoint");
          setCategories(fallbackData.data);
          return;
        }
      } catch (fallbackError) {
        console.error("Fallback also failed:", fallbackError);
      }
      
      setError("Failed to fetch categories. Please check if the backend server is running.");
    } finally {
      setCategoriesLoading(false);
    }
  };

  const addCategory = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("adminToken");
      console.log("Admin token:", token ? "Token exists" : "No token found");
      
      if (!token) {
        setError("No authentication token found. Please login again.");
        handleLogout();
        return;
      }

      console.log("Making request to:", `${API_ENDPOINTS.CATEGORIES.ADMIN_ADD}`);
      console.log("Category form data:", categoryForm);

      const response = await fetch(`${API_ENDPOINTS.CATEGORIES.ADMIN_ADD}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(categoryForm),
      });
      
      console.log("Response status:", response.status);
      const data = await response.json();
      console.log("Response data:", data);
      
      // Check for JWT errors first
      if (handleJWTError(response, data)) {
        return;
      }
      
      if (data.success) {
        setShowCategoryModal(false);
        setCategoryForm({ categoryName: "", description: "" });
        fetchCategories(); // Refresh categories list
        alert("Category added successfully!");
      } else {
        setError(data.message || "Failed to add category");
      }
    } catch (error) {
      console.error("Error adding category:", error);
      setError("Failed to add category. Please try again.");
    }
  };

  const deleteCategory = async (categoryId) => {
    if (!window.confirm("Are you sure you want to delete this category? This action cannot be undone.")) {
      return;
    }
    
    try {
      const token = localStorage.getItem("adminToken");
      console.log("Deleting category:", categoryId);
      
      if (!token) {
        setError("No authentication token found. Please login again.");
        handleLogout();
        return;
      }

      const response = await fetch(
        `${API_ENDPOINTS.CATEGORIES.ADMIN_DELETE}/${categoryId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      
      console.log("Delete response status:", response.status);
      const data = await response.json();
      console.log("Delete response data:", data);
      
      // Check for JWT errors first
      if (handleJWTError(response, data)) {
        return;
      }
      
      if (data.success) {
        fetchCategories(); // Refresh categories list
        alert("Category deleted successfully!");
      } else {
        setError(data.message || "Failed to delete category");
      }
    } catch (error) {
      console.error("Error deleting category:", error);
      setError("Failed to delete category. Please try again.");
    }
  };

  // Message Management Functions
  const fetchMessages = async () => {
    setMessagesLoading(true);
    try {
      const token = localStorage.getItem("adminToken");
      const response = await fetch(`${API_ENDPOINTS.CONTACT.GET_ALL}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      if (data.success) {
        setMessages(data.data.messages);
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
      setError("Failed to fetch messages");
    } finally {
      setMessagesLoading(false);
    }
  };

  const fetchMessageStats = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      const response = await fetch(`${API_ENDPOINTS.CONTACT.STATS}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      if (data.success) {
        setMessageStats(data.data);
      }
    } catch (error) {
      console.error("Error fetching message stats:", error);
    }
  };

  const updateMessageStatus = async (messageId, status, adminNotes = "") => {
    try {
      const token = localStorage.getItem("adminToken");
      const response = await fetch(
        `${API_ENDPOINTS.CONTACT.UPDATE}/${messageId}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status, adminNotes }),
        }
      );
      const data = await response.json();
      if (data.success) {
        // Refresh messages
        fetchMessages();
        fetchMessageStats();
        setShowMessageModal(false);
        setSelectedMessage(null);
      } else {
        alert(data.message || "Failed to update message");
      }
    } catch (error) {
      console.error("Error updating message:", error);
      alert("Failed to update message");
    }
  };

  const deleteMessage = async (messageId) => {
    if (!window.confirm("Are you sure you want to delete this message? This action cannot be undone.")) {
      return;
    }
    
    try {
      const token = localStorage.getItem("adminToken");
      console.log("Deleting message:", messageId);
      
      if (!token) {
        setError("No authentication token found. Please login again.");
        handleLogout();
        return;
      }

      const response = await fetch(
        `${API_ENDPOINTS.CONTACT.DELETE}/${messageId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      
      console.log("Delete message response status:", response.status);
      const data = await response.json();
      console.log("Delete message response data:", data);
      
      // Check for JWT errors first
      if (handleJWTError(response, data)) {
        return;
      }
      
      if (data.success) {
        // Refresh messages and close modal if open
        fetchMessages();
        fetchMessageStats();
        setShowMessageModal(false);
        setSelectedMessage(null);
        alert("Message deleted successfully!");
      } else {
        setError(data.message || "Failed to delete message");
      }
    } catch (error) {
      console.error("Error deleting message:", error);
      setError("Failed to delete message. Please try again.");
    }
  };

  // Inquiry Notification Functions
  const fetchInquiryNotifications = async () => {
    setInquiryLoading(true);
    try {
      const token = localStorage.getItem("adminToken");
      const response = await fetch(`${API_ENDPOINTS.ADMIN.NOTIFICATIONS}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      if (data.success) {
        setInquiryNotifications(data.data.notifications);
        setInquiryStats(data.data.stats);
      }
    } catch (error) {
      console.error("Error fetching inquiry notifications:", error);
      setError("Failed to fetch inquiry notifications");
    } finally {
      setInquiryLoading(false);
    }
  };

  const markNotificationAsRead = async (notificationId) => {
    try {
      console.log("Marking notification as read:", notificationId);
      setLoading(true);
      const token = localStorage.getItem("adminToken");
      if (!token) {
        setError("No authentication token found. Please login again.");
        handleLogout();
        return;
      }

      const response = await fetch(
        `${API_ENDPOINTS.ADMIN.MARK_NOTIFICATION_READ}/${notificationId}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      
      console.log("Response status:", response.status);
      const data = await response.json();
      console.log("Response data:", data);
      
      // Check for JWT errors first
      if (handleJWTError(response, data)) {
        return;
      }
      
      if (data.success) {
        // Refresh notifications
        await fetchInquiryNotifications();
        console.log("Notification marked as read successfully");
      } else {
        console.error("Failed to mark notification as read:", data.message);
        setError(data.message || "Failed to mark notification as read");
      }
    } catch (error) {
      console.error("Error marking notification as read:", error);
      setError("Failed to mark notification as read");
    } finally {
      setLoading(false);
    }
  };

  const markAllNotificationsAsRead = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      const response = await fetch(
        `${API_ENDPOINTS.ADMIN.MARK_ALL_NOTIFICATIONS_READ}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();
      if (data.success) {
        // Refresh notifications
        fetchInquiryNotifications();
      }
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
    }
  };

  const approveSeller = async (sellerId, status) => {
    try {
      setLoading(true);
      const token = localStorage.getItem("adminToken");
      const response = await fetch(
        `${API_ENDPOINTS.ADMIN.APPROVE_SELLER}/${sellerId}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status }),
        }
      );
      const data = await response.json();
      if (data.success) {
        // Refresh sellers list
        fetchSellers();
        alert(`Seller ${status} successfully!`);
      } else {
        setError(data.message || "Failed to update seller status");
      }
    } catch (error) {
      console.error("Error updating seller:", error);
      setError("Failed to update seller status");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Check if admin is logged in
    const adminToken = localStorage.getItem("adminToken");
    const adminUserData = localStorage.getItem("adminUser");

    if (!adminToken || !adminUserData) {
      navigate("/login-admin");
      return;
    }

    try {
      setAdminUser(JSON.parse(adminUserData));
    } catch (error) {
      console.error("Error parsing admin user data:", error);
      navigate("/login-admin");
    }
  }, [navigate]);

  useEffect(() => {
    if (adminUser) {
      fetchBuyers();
      fetchSellers();
      fetchCategories();
      fetchMessages();
      fetchMessageStats();
      fetchInquiryNotifications();
    }
  }, [adminUser]);

  const openUserModal = (user, type) => {
    setSelectedUser({ ...user, type });
    setShowUserModal(true);
  };

  const closeUserModal = () => {
    setShowUserModal(false);
    setSelectedUser(null);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "approved":
        return "#28a745";
      case "pending":
        return "#ffc107";
      case "rejected":
        return "#dc3545";
      default:
        return "#6c757d";
    }
  };

  const filteredSellers = sellers.filter((seller) => {
    const matchesSearch =
      seller.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      seller.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      seller.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      seller.CompanyName?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || seller.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const filteredBuyers = buyers.filter((buyer) => {
    const matchesSearch =
      buyer.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      buyer.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      buyer.email?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  if (!adminUser) {
    return (
      <div className="admin-loading">
        <div className="admin-loading-spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      {/* Sidebar */}
      <div className="ad-sidebar">
        <div className="ad-sidebar-nav">
          <button
            className={`ad-sidebar-btn ${
              activeTab === "overview" ? "active" : ""
            }`}
            onClick={() => setActiveTab("overview")}
          >
            <svg
              className="ad-sidebar-icon"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
            Overview
          </button>

          <button
            className={`ad-sidebar-btn ${
              activeTab === "sellers" ? "active" : ""
            }`}
            onClick={() => setActiveTab("sellers")}
          >
            <svg
              className="ad-sidebar-icon"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
              />
            </svg>
            Sellers
          </button>

          <button
            className={`ad-sidebar-btn ${
              activeTab === "buyers" ? "active" : ""
            }`}
            onClick={() => setActiveTab("buyers")}
          >
            <svg
              className="ad-sidebar-icon"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
            Buyers
          </button>

          <button
            className={`ad-sidebar-btn ${
              activeTab === "categories" ? "active" : ""
            }`}
            onClick={() => setActiveTab("categories")}
          >
            <svg
              className="ad-sidebar-icon"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
              />
            </svg>
            Categories
          </button>

          <button
            className={`ad-sidebar-btn ${
              activeTab === "messages" ? "active" : ""
            }`}
            onClick={() => setActiveTab("messages")}
          >
            <svg
              className="ad-sidebar-icon"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
            Messages
          </button>

          <button
            className={`ad-sidebar-btn ${
              activeTab === "inquiries" ? "active" : ""
            }`}
            onClick={() => setActiveTab("inquiries")}
          >
            <svg
              className="ad-sidebar-icon"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 17h5l-5 5v-5zM9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            Inquiries
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="ad-main-content">
        {/* Header Section */}
        {activeTab === "overview" && (
          <div className="ad-header">
            <div className="ad-header-top">
              <div className="ad-user">
                <div className="ad-user-avatar">
                  {adminUser.name?.charAt(0).toUpperCase() || "A"}
                </div>
                <div className="ad-user-meta">
                  <h1 className="ad-name">Admin Dashboard</h1>
                  <p className="ad-role">Welcome back, {adminUser.name}</p>
                </div>
              </div>
              <div className="ad-actions">
                <button className="ad-logout-btn" onClick={handleLogout}>
                  Logout
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Content Sections */}
        {activeTab === "overview" && (
          <div className="ad-content-section">
            {loading ? (
              <div className="admin-loading">
                <div className="admin-loading-spinner"></div>
                <p>Loading dashboard data...</p>
              </div>
            ) : (
              <div className="admin-stats">
                <div className="admin-stat-card">
                  <h3>Total Buyers</h3>
                  <p className="stat-number">{buyers.length}</p>
                </div>
                <div className="admin-stat-card">
                  <h3>Total Sellers</h3>
                  <p className="stat-number">{sellers.length}</p>
                </div>
                <div className="admin-stat-card">
                  <h3>Pending Sellers</h3>
                  <p className="stat-number">
                    {sellers.filter((s) => s.status === "pending").length}
                  </p>
                </div>
                <div className="admin-stat-card">
                  <h3>Approved Sellers</h3>
                  <p className="stat-number">
                    {sellers.filter((s) => s.status === "approved").length}
                  </p>
                </div>
                <div className="admin-stat-card">
                  <h3>Total Messages</h3>
                  <p className="stat-number">
                    {messageStats.totalMessages || 0}
                  </p>
                </div>
                <div className="admin-stat-card">
                  <h3>New Messages</h3>
                  <p className="stat-number">{messageStats.newMessages || 0}</p>
                </div>
                <div className="admin-stat-card">
                  <h3>Total Inquiries</h3>
                  <p className="stat-number">{inquiryStats.total || 0}</p>
                </div>
                <div className="admin-stat-card">
                  <h3>Unread Inquiries</h3>
                  <p className="stat-number">{inquiryStats.unread || 0}</p>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === "sellers" && (
          <div className="admin-sellers">
            <div className="admin-section-header">
              <h2>Sellers Management</h2>
              <div className="admin-filters">
                <input
                  type="text"
                  placeholder="Search sellers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="admin-search"
                />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="admin-filter"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
            </div>

            <div className="admin-users-list">
              {loading ? (
                <div className="admin-loading">
                  <div className="admin-loading-spinner"></div>
                  <p>Loading sellers...</p>
                </div>
              ) : (
                filteredSellers.map((seller) => (
                  <div key={seller._id} className="admin-user-card">
                    <div className="admin-user-info">
                      <h3>
                        {seller.firstName} {seller.lastName}
                      </h3>
                      <p className="admin-user-email">{seller.email}</p>
                      <p className="admin-user-company">{seller.CompanyName}</p>
                      <div className="admin-user-status">
                        <span
                          className="status-badge"
                          style={{
                            backgroundColor: getStatusColor(seller.status),
                          }}
                        >
                          {seller.status}
                        </span>
                      </div>
                    </div>
                    <div className="admin-user-actions">
                      <button
                        className="admin-btn admin-btn-primary"
                        onClick={() => openUserModal(seller, "seller")}
                      >
                        View Details
                      </button>
                      <div className="admin-approval-buttons">
                        {seller.status === "pending" && (
                          <>
                            <button
                              className="admin-btn admin-btn-success"
                              onClick={() =>
                                approveSeller(seller._id, "approved")
                              }
                              disabled={loading}
                            >
                              Approve
                            </button>
                            <button
                              className="admin-btn admin-btn-danger"
                              onClick={() =>
                                approveSeller(seller._id, "rejected")
                              }
                              disabled={loading}
                            >
                              Reject
                            </button>
                          </>
                        )}
                        {seller.status === "approved" && (
                          <button
                            className="admin-btn admin-btn-danger"
                            onClick={() =>
                              approveSeller(seller._id, "rejected")
                            }
                            disabled={loading}
                          >
                            Reject
                          </button>
                        )}
                        {seller.status === "rejected" && (
                          <button
                            className="admin-btn admin-btn-success"
                            onClick={() =>
                              approveSeller(seller._id, "approved")
                            }
                            disabled={loading}
                          >
                            Approve
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {activeTab === "buyers" && (
          <div className="admin-buyers">
            <div className="admin-section-header">
              <h2>Buyers Management</h2>
              <div className="admin-filters">
                <input
                  type="text"
                  placeholder="Search buyers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="admin-search"
                />
              </div>
            </div>

            <div className="admin-users-list">
              {loading ? (
                <div className="admin-loading">
                  <div className="admin-loading-spinner"></div>
                  <p>Loading buyers...</p>
                </div>
              ) : (
                filteredBuyers.map((buyer) => (
                  <div key={buyer._id} className="admin-user-card">
                    <div className="admin-user-info">
                      <h3>
                        {buyer.firstName} {buyer.lastName}
                      </h3>
                      <p className="admin-user-email">{buyer.email}</p>
                      <p className="admin-user-business">
                        {buyer.natureOfBusiness}
                      </p>
                    </div>
                    <div className="admin-user-actions">
                      <button
                        className="admin-btn admin-btn-primary"
                        onClick={() => openUserModal(buyer, "buyer")}
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {activeTab === "categories" && (
          <div className="admin-categories">
            <div className="admin-section-header">
              <h2>Category Management</h2>
              <button
                className="admin-btn admin-btn-primary"
                onClick={() => setShowCategoryModal(true)}
              >
                <svg
                  className="admin-btn-icon"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  width="16"
                  height="16"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
                Add Category
              </button>
            </div>

            <div className="admin-categories-list">
              {categoriesLoading ? (
                <div className="admin-loading">
                  <div className="admin-loading-spinner"></div>
                  <p>Loading categories...</p>
                </div>
              ) : (
                categories.map((category) => (
                  <div key={category._id} className="admin-category-card">
                    <div className="admin-category-info">
                      <h3>{category.categoryName}</h3>
                      <p className="admin-category-description">
                        {category.description || "No description"}
                      </p>
                      <p className="admin-category-date">
                        Created:{" "}
                        {new Date(category.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="admin-category-actions">
                      <button
                        className="admin-btn admin-btn-danger"
                        onClick={() => deleteCategory(category._id)}
                      >
                        <svg
                          className="admin-btn-icon"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          width="16"
                          height="16"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                        Delete
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {activeTab === "messages" && (
          <div className="admin-messages">
            <div className="admin-section-header">
              <h2>Contact Messages</h2>
              <div className="admin-message-stats">
                <span className="stat-badge">
                  Total: {messageStats.totalMessages || 0}
                </span>
                <span className="stat-badge new">
                  New: {messageStats.newMessages || 0}
                </span>
              </div>
            </div>

            <div className="admin-messages-list">
              {messagesLoading ? (
                <div className="admin-loading">
                  <div className="admin-loading-spinner"></div>
                  <p>Loading messages...</p>
                </div>
              ) : (
                messages.map((message) => (
                  <div key={message._id} className="admin-message-card">
                    <div className="admin-message-info">
                      <div className="message-header">
                        <h3>{message.name}</h3>
                        <span className="message-email">{message.email}</span>
                      </div>
                      {message.subject && (
                        <p className="message-subject">{message.subject}</p>
                      )}
                      <p className="message-content">{message.message}</p>
                      <div className="message-meta">
                        <span className="message-date">
                          {new Date(message.createdAt).toLocaleDateString()}
                        </span>
                        <span
                          className={`status-badge ${
                            message.status === "new" ? "new" : ""
                          }`}
                        >
                          {message.status}
                        </span>

                      </div>
                    </div>
                    <div className="admin-message-actions">
                      <button
                        className="admin-btn admin-btn-primary"
                        onClick={() => {
                          setSelectedMessage(message);
                          setShowMessageModal(true);
                        }}
                      >
                        <svg
                          className="admin-btn-icon"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          width="16"
                          height="16"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                          />
                        </svg>
                        View
                      </button>
                      {message.status !== "read" && (
                        <button
                          className="admin-btn admin-btn-success"
                          onClick={() => updateMessageStatus(message._id, "read")}
                        >
                          <svg
                            className="admin-btn-icon"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            width="16"
                            height="16"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                          Mark Read
                        </button>
                      )}
                      <button
                        className="admin-btn admin-btn-danger"
                        onClick={() => deleteMessage(message._id)}
                      >
                        <svg
                          className="admin-btn-icon"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          width="16"
                          height="16"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                        Delete
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {activeTab === "inquiries" && (
          <div className="admin-inquiries">
            <div className="admin-section-header">
              <h2>Buyer-Seller Inquiries Tracking</h2>
              <div className="admin-inquiry-stats">
                <span className="stat-badge">
                  Total: {inquiryStats.total || 0}
                </span>
                <span className="stat-badge new">
                  Unread: {inquiryStats.unread || 0}
                </span>
                <span className="stat-badge">
                  Read: {inquiryStats.read || 0}
                </span>
                {inquiryStats.unread > 0 && (
                  <button
                    className="admin-btn admin-btn-primary"
                    onClick={markAllNotificationsAsRead}
                  >
                    Mark All Read
                  </button>
                )}
              </div>
            </div>

            <div className="admin-inquiries-list">
              {inquiryLoading ? (
                <div className="admin-loading">
                  <div className="admin-loading-spinner"></div>
                  <p>Loading inquiry notifications...</p>
                </div>
              ) : inquiryNotifications.length === 0 ? (
                <div className="admin-empty-state">
                  <p>No inquiry notifications found.</p>
                </div>
              ) : (
                inquiryNotifications.map((notification) => (
                  <div key={notification._id} className="admin-inquiry-card">
                    <div className="admin-inquiry-info">
                      <div className="inquiry-header">
                        <h3>
                          {notification.buyerId?.firstName}{" "}
                          {notification.buyerId?.lastName}
                        </h3>
                        <span className="inquiry-arrow">→</span>
                        <h3>
                          {notification.sellerId?.firstName}{" "}
                          {notification.sellerId?.lastName}
                          {notification.sellerId?.CompanyName && (
                            <span className="company-name">
                              {" "}
                              ({notification.sellerId.CompanyName})
                            </span>
                          )}
                        </h3>
                        <span
                          className={`status-badge ${
                            notification.status === "unread" ? "unread" : "read"
                          }`}
                        >
                          {notification.status}
                        </span>
                      </div>
                      <p className="inquiry-message">{notification.message}</p>
                      <div className="inquiry-meta">
                        <span className="inquiry-date">
                          {new Date(notification.createdAt).toLocaleString()}
                        </span>
                        <span className="inquiry-product">
                          Product: {notification.productName}
                        </span>
                        {notification.inquiryId?.status && (
                          <span className="inquiry-status">
                            Status: {notification.inquiryId.status}
                          </span>
                        )}
                      </div>
                      <div className="inquiry-details">
                        <div className="buyer-details">
                          <strong>Buyer:</strong> {notification.buyerId?.email}{" "}
                          | {notification.buyerId?.mobileNumber}
                        </div>
                        <div className="seller-details">
                          <strong>Seller:</strong>{" "}
                          {notification.sellerId?.email} |{" "}
                          {notification.sellerId?.mobileNumber}
                        </div>
                      </div>
                    </div>
                    <div className="admin-inquiry-actions">
                      <button
                        className="admin-btn admin-btn-primary"
                        onClick={() => {
                          setSelectedNotification(notification);
                          setShowNotificationModal(true);
                        }}
                      >
                        <svg
                          className="admin-btn-icon"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          width="16"
                          height="16"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                          />
                        </svg>
                        View Details
                      </button>
                      {notification.status === "unread" && (
                        <button
                          className="admin-btn admin-btn-success"
                          onClick={() =>
                            markNotificationAsRead(notification._id)
                          }
                          disabled={loading}
                        >
                          <svg
                            className="admin-btn-icon"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            width="16"
                            height="16"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                          Mark Read
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      {/* User Details Modal */}
      {showUserModal && selectedUser && (
        <div className="admin-modal">
          <div className="admin-modal-content">
            <div className="admin-modal-header">
              <h3>
                {selectedUser.type === "seller" ? "Seller" : "Buyer"} Details
              </h3>
              <button onClick={closeUserModal} className="admin-modal-close">
                ×
              </button>
            </div>
            <div className="admin-modal-body">
              <div className="admin-user-details">
                <div className="detail-row">
                  <strong>Name:</strong> {selectedUser.firstName}{" "}
                  {selectedUser.lastName}
                </div>
                <div className="detail-row">
                  <strong>Email:</strong> {selectedUser.email}
                </div>
                <div className="detail-row">
                  <strong>Phone:</strong> {selectedUser.mobileNumber}
                </div>
                <div className="detail-row">
                  <strong>Country:</strong> {selectedUser.country}
                </div>
                <div className="detail-row">
                  <strong>Business Type:</strong>{" "}
                  {selectedUser.natureOfBusiness}
                </div>
                {selectedUser.type === "seller" && (
                  <>
                    <div className="detail-row">
                      <strong>Company:</strong> {selectedUser.CompanyName}
                    </div>
                    <div className="detail-row">
                      <strong>License Number:</strong>{" "}
                      {selectedUser.licenseNumber || "Not provided"}
                    </div>
                    <div className="detail-row">
                      <strong>GST Number:</strong>{" "}
                      {selectedUser.gstNumber || "Not provided"}
                    </div>
                    <div className="detail-row">
                      <strong>Status:</strong>
                      <span
                        className="status-badge"
                        style={{
                          backgroundColor: getStatusColor(selectedUser.status),
                        }}
                      >
                        {selectedUser.status}
                      </span>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Category Modal */}
      {showCategoryModal && (
        <div className="admin-modal">
          <div className="admin-modal-content">
            <div className="admin-modal-header">
              <h3>Add New Category</h3>
              <button
                className="admin-modal-close"
                onClick={() => setShowCategoryModal(false)}
              >
                ×
              </button>
            </div>
            <form onSubmit={addCategory} className="admin-form">
              <div className="admin-form-group">
                <label htmlFor="categoryName">Category Name *</label>
                <input
                  type="text"
                  id="categoryName"
                  value={categoryForm.categoryName}
                  onChange={(e) =>
                    setCategoryForm({
                      ...categoryForm,
                      categoryName: e.target.value,
                    })
                  }
                  required
                  placeholder="Enter category name"
                />
              </div>
              <div className="admin-form-group">
                <label htmlFor="description">Description</label>
                <textarea
                  id="description"
                  value={categoryForm.description}
                  onChange={(e) =>
                    setCategoryForm({
                      ...categoryForm,
                      description: e.target.value,
                    })
                  }
                  placeholder="Enter category description"
                  rows="3"
                />
              </div>
              <div className="admin-form-actions">
                <button
                  type="button"
                  className="admin-btn admin-btn-secondary"
                  onClick={() => setShowCategoryModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="admin-btn admin-btn-primary">
                  Add Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Message Modal */}
      {showMessageModal && selectedMessage && (
        <div className="admin-modal">
          <div className="admin-modal-content">
            <div className="admin-modal-header">
              <h3>Message Details</h3>
              <button
                className="admin-modal-close"
                onClick={() => {
                  setShowMessageModal(false);
                  setSelectedMessage(null);
                }}
              >
                ×
              </button>
            </div>
            <div className="admin-modal-body">
              <div className="message-details">
                <div className="detail-row">
                  <strong>From:</strong> {selectedMessage.name}
                </div>
                <div className="detail-row">
                  <strong>Email:</strong> {selectedMessage.email}
                </div>
                {selectedMessage.subject && (
                  <div className="detail-row">
                    <strong>Subject:</strong> {selectedMessage.subject}
                  </div>
                )}
                <div className="detail-row">
                  <strong>Date:</strong>{" "}
                  {new Date(selectedMessage.createdAt).toLocaleString()}
                </div>
                <div className="detail-row">
                  <strong>Status:</strong>{" "}
                  <span className={`status-badge ${selectedMessage.status}`}>
                    {selectedMessage.status}
                  </span>
                </div>

                <div className="detail-row">
                  <strong>Message:</strong>
                  <div className="message-text">{selectedMessage.message}</div>
                </div>
                {selectedMessage.adminNotes && (
                  <div className="detail-row">
                    <strong>Admin Notes:</strong>
                    <div className="admin-notes">
                      {selectedMessage.adminNotes}
                    </div>
                  </div>
                )}
              </div>
              <div className="admin-message-actions">
                {selectedMessage.status !== "read" && (
                  <button
                    className="admin-btn admin-btn-success"
                    onClick={() =>
                      updateMessageStatus(selectedMessage._id, "read")
                    }
                  >
                    <svg
                      className="admin-btn-icon"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      width="16"
                      height="16"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    Mark Read
                  </button>
                )}
                <button
                  className="admin-btn admin-btn-danger"
                  onClick={() => deleteMessage(selectedMessage._id)}
                >
                  <svg
                    className="admin-btn-icon"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    width="16"
                    height="16"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                  Delete
                </button>

              </div>
            </div>
          </div>
        </div>
      )}

      {/* Notification Detail Modal */}
      {showNotificationModal && selectedNotification && (
        <div className="admin-inquiry-modal">
          <div className="admin-inquiry-modal-content">
            <div className="admin-inquiry-modal-header">
              <h3>Inquiry Notification Details</h3>
              <button
                className="admin-inquiry-modal-close"
                onClick={() => {
                  setShowNotificationModal(false);
                  setSelectedNotification(null);
                }}
              >
                ×
              </button>
            </div>
            <div className="admin-inquiry-modal-body">
              <div className="inquiry-notification-details">
                <div className="detail-row">
                  <strong>Notification Type:</strong>{" "}
                  {selectedNotification.type}
                </div>
                <div className="detail-row">
                  <strong>Date:</strong>{" "}
                  {new Date(selectedNotification.createdAt).toLocaleString()}
                </div>
                <div className="detail-row">
                  <strong>Notification Status:</strong>{" "}
                  <span
                    className={`status-badge ${selectedNotification.status}`}
                  >
                    {selectedNotification.status}
                  </span>
                </div>
                <div className="detail-row">
                  <strong>Message:</strong>
                  <div className="notification-message">
                    {selectedNotification.message}
                  </div>
                </div>

                <div className="participant-section">
                  <h4>Buyer Information</h4>
                  <div className="detail-row">
                    <strong>Name:</strong>{" "}
                    {selectedNotification.buyerId?.firstName}{" "}
                    {selectedNotification.buyerId?.lastName}
                  </div>
                  <div className="detail-row">
                    <strong>Email:</strong>{" "}
                    {selectedNotification.buyerId?.email}
                  </div>
                  <div className="detail-row">
                    <strong>Phone:</strong>{" "}
                    {selectedNotification.buyerId?.mobileNumber}
                  </div>
                  <div className="detail-row">
                    <strong>Country:</strong>{" "}
                    {selectedNotification.buyerId?.country}
                  </div>
                  <div className="detail-row">
                    <strong>Business Type:</strong>{" "}
                    {selectedNotification.buyerId?.natureOfBusiness}
                  </div>
                </div>

                <div className="participant-section">
                  <h4>Seller Information</h4>
                  <div className="detail-row">
                    <strong>Name:</strong>{" "}
                    {selectedNotification.sellerId?.firstName}{" "}
                    {selectedNotification.sellerId?.lastName}
                  </div>
                  <div className="detail-row">
                    <strong>Email:</strong>{" "}
                    {selectedNotification.sellerId?.email}
                  </div>
                  <div className="detail-row">
                    <strong>Phone:</strong>{" "}
                    {selectedNotification.sellerId?.mobileNumber}
                  </div>
                  <div className="detail-row">
                    <strong>Company:</strong>{" "}
                    {selectedNotification.sellerId?.CompanyName}
                  </div>
                  <div className="detail-row">
                    <strong>Location:</strong>{" "}
                    {selectedNotification.sellerId?.location
                      ? typeof selectedNotification.sellerId.location === 'object'
                        ? selectedNotification.sellerId.location.formattedAddress ||
                          `${selectedNotification.sellerId.location.city || ''}, ${selectedNotification.sellerId.location.state || ''}, ${selectedNotification.sellerId.location.country || ''}`.replace(/^,\s*|,\s*$/g, '').replace(/,\s*,/g, ',') ||
                          'Location not available'
                        : selectedNotification.sellerId.location
                      : 'Location not available'}
                  </div>
                </div>

                <div className="participant-section">
                  <h4>Product Information</h4>
                  <div className="detail-row">
                    <strong>Product Name:</strong>{" "}
                    {selectedNotification.productName}
                  </div>
                  {selectedNotification.productId && (
                    <>
                      <div className="detail-row">
                        <strong>Description:</strong>{" "}
                        {selectedNotification.productId?.description ||
                          "No description available"}
                      </div>
                    </>
                  )}
                </div>


              </div>
              <div className="admin-notification-actions">
                {selectedNotification.status === "unread" && (
                  <button
                    className="admin-btn admin-btn-success"
                    onClick={() => {
                      markNotificationAsRead(selectedNotification._id);
                      setShowNotificationModal(false);
                      setSelectedNotification(null);
                    }}
                  >
                    <svg
                      className="admin-btn-icon"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      width="16"
                      height="16"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    Mark as Read
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="admin-error">
          <p>{error}</p>
          <button onClick={() => setError("")}>×</button>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
