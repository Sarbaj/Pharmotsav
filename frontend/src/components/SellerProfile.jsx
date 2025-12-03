import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import "../CSS/SellerProfile.css";
import { API_BASE_URL, API_ENDPOINTS } from "../config/api";

function SellerProfile() {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [showInquiryModal, setShowInquiryModal] = useState(false);
  const [selectedBuyer, setSelectedBuyer] = useState(null);
  const [showBuyerModal, setShowBuyerModal] = useState(false);
  const [buyerLoading, setBuyerLoading] = useState(false);
  const [sellerUser, setSellerUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [expandedInquiries, setExpandedInquiries] = useState(new Set());

  const { UserInfo } = useSelector((state) => state.user);
  const navigate = useNavigate();

  // Toggle inquiry dropdown
  const toggleInquiryDropdown = (inquiryId) => {
    setExpandedInquiries((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(inquiryId)) {
        newSet.delete(inquiryId);
      } else {
        newSet.add(inquiryId);
      }
      return newSet;
    });
  };

  // Check if inquiry is expanded
  const isInquiryExpanded = (inquiryId) => {
    return expandedInquiries.has(inquiryId);
  };

  // Separate inquiries by status
  const pendingInquiries = inquiries.filter(inq => inq.status === 'pending');
  const respondedInquiries = inquiries.filter(inq => inq.status === 'responded');
  const closedInquiries = inquiries.filter(inq => inq.status === 'closed');

  // Authentication check
  useEffect(() => {
    // Check if seller is logged in
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");

    if (!token || !userData) {
      navigate("/login");
      return;
    }

    try {
      const parsedUser = JSON.parse(userData);
      setSellerUser(parsedUser);
      setIsAuthenticated(true);
    } catch (error) {
      console.error("Error parsing user data:", error);
      navigate("/login");
    }
  }, [navigate]);

  // Handle Redux state when available
  useEffect(() => {
    if (UserInfo && !sellerUser) {
      setSellerUser(UserInfo);
      setIsAuthenticated(true);
    }
  }, [UserInfo, sellerUser]);

  // Fetch seller inquiries
  const fetchSellerInquiries = async () => {
    try {
      setLoading(true);
      const sellerId = sellerUser?._id;

      if (!sellerId) {
        console.log("No seller ID found");
        setInquiries([]);
        return;
      }

      const response = await fetch(
        `${API_ENDPOINTS.INQUIRIES.SELLER}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const data = await response.json();

      if (data.success && data.data.inquiries) {
        setInquiries(data.data.inquiries);
      } else {
        setInquiries([]);
      }
    } catch (error) {
      console.error("Error fetching seller inquiries:", error);
      setInquiries([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (sellerUser) {
      fetchSellerInquiries();
    }
  }, [sellerUser]);

  const handleInquiryClick = (inquiry) => {
    setSelectedInquiry(inquiry);
    setShowInquiryModal(true);
  };

  // Handle buyer details click
  const handleBuyerClick = async (buyerId) => {
    try {
      setBuyerLoading(true);

      const response = await fetch(
        `${API_ENDPOINTS.BUYERS.DETAILS}/${buyerId}`
      );

      const data = await response.json();

      if (data.success && data.data.buyer) {
        setSelectedBuyer(data.data.buyer);
        setShowBuyerModal(true);
      } else {
        alert("Failed to fetch buyer details");
      }
    } catch (error) {
      console.error("Error fetching buyer details:", error);
      alert("Failed to fetch buyer details");
    } finally {
      setBuyerLoading(false);
    }
  };

  // Close buyer modal
  const closeBuyerModal = () => {
    setShowBuyerModal(false);
    setSelectedBuyer(null);
  };

  const updateInquiryStatus = async (inquiryId, productId, status) => {
    try {
      const response = await fetch(
        `${API_ENDPOINTS.INQUIRIES.UPDATE_STATUS}/${inquiryId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            status,
            productId,
          }),
        }
      );

      const data = await response.json();

      if (data.success) {
        // Refresh inquiries
        fetchSellerInquiries();
        setShowInquiryModal(false);
        setSelectedInquiry(null);
      } else {
        alert("Failed to update inquiry status");
      }
    } catch (error) {
      console.error("Error updating inquiry:", error);
      alert("Failed to update inquiry status");
    }
  };

  // Show loading state while checking authentication
  if (!isAuthenticated) {
    return (
      <div className="seller-profile">
        <div className="sp-loading">
          <div className="sp-spinner"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="seller-profile">
      {/* Profile Header Section */}
      <section className="sp-header">
        <div className="sp-header-left">
          <div className="sp-user-avatar">
            {sellerUser ? 
              `${sellerUser.firstName?.charAt(0) || ''}${sellerUser.lastName?.charAt(0) || ''}`.toUpperCase() 
              : 'S'}
          </div>
          <div className="sp-user-info">
            <h2 className="sp-name">
              {sellerUser ? `${sellerUser.firstName} ${sellerUser.lastName || ''}` : "Loading"}
            </h2>
            <p className="sp-role">
              <svg className="sp-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              {sellerUser?.natureOfBusiness || "Seller"}
            </p>
            <div className="sp-tags">
              <span className="sp-tag sp-tag--verified">
                <svg className="sp-tag-icon" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Verified Seller
              </span>
              <span className="sp-tag sp-tag--business">
                <svg className="sp-tag-icon" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                Business
              </span>
            </div>
          </div>
        </div>

        <div className="sp-header-right">
          <div className="sp-company-card">
            <h3 className="sp-company-title">
              <svg className="sp-title-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Company Information
            </h3>
            <div className="sp-company-grid">
              <div className="sp-company-item">
                <svg className="sp-company-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <div>
                  <label>Email</label>
                  <p>{sellerUser?.email || "Not provided"}</p>
                </div>
              </div>
              <div className="sp-company-item">
                <svg className="sp-company-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <div>
                  <label>Phone</label>
                  <p>{sellerUser?.mobileNumber || "Not provided"}</p>
                </div>
              </div>
              <div className="sp-company-item">
                <svg className="sp-company-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <div>
                  <label>Country</label>
                  <p>{sellerUser?.country || "Not provided"}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="sp-actions">
            <button
              className="sp-btn sp-btn--primary"
              onClick={() => alert('Update profile feature coming soon!')}
            >
              <svg className="sp-btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Update Profile
            </button>
            <button
              className="sp-btn sp-btn--secondary"
              onClick={() => alert('Settings coming soon!')}
            >
              <svg className="sp-btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Settings
            </button>
            <button
              className="sp-btn sp-btn--logout"
              onClick={() => {
                localStorage.clear();
                window.location.href = '/';
              }}
            >
              <svg className="sp-btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Logout
            </button>
          </div>
        </div>
      </section>

      {/* Stats Overview */}
      <div className="sp-stats-grid">
        <div className="sp-stat-card sp-stat--pending">
          <div className="sp-stat-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="sp-stat-content">
            <span className="sp-stat-number">{pendingInquiries.length}</span>
            <span className="sp-stat-label">Pending</span>
          </div>
        </div>
        <div className="sp-stat-card sp-stat--responded">
          <div className="sp-stat-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="sp-stat-content">
            <span className="sp-stat-number">{respondedInquiries.length}</span>
            <span className="sp-stat-label">Responded</span>
          </div>
        </div>
        <div className="sp-stat-card sp-stat--closed">
          <div className="sp-stat-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div className="sp-stat-content">
            <span className="sp-stat-number">{closedInquiries.length}</span>
            <span className="sp-stat-label">Closed</span>
          </div>
        </div>
        <div className="sp-stat-card sp-stat--total">
          <div className="sp-stat-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <div className="sp-stat-content">
            <span className="sp-stat-number">{inquiries.length}</span>
            <span className="sp-stat-label">Total</span>
          </div>
        </div>
      </div>

      {/* Inquiries Section */}
      {loading ? (
        <div className="sp-loading">
          <div className="sp-spinner"></div>
          <p>Loading inquiries...</p>
        </div>
      ) : inquiries.length === 0 ? (
        <div className="sp-no-inquiries">
          <svg className="sp-no-inquiries-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h3>No inquiries yet</h3>
          <p>Inquiries from buyers will appear here</p>
        </div>
      ) : (
        <>
          {/* Pending Inquiries */}
          {pendingInquiries.length > 0 && (
            <div className="sp-inquiries-section">
              <div className="sp-section-header">
                <h3 className="sp-section-title">
                  <svg className="sp-section-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Pending Inquiries
                  <span className="sp-section-count">{pendingInquiries.length}</span>
                </h3>
              </div>
              <div className="sp-inquiries-list">
                {pendingInquiries.map((inquiry) => (
                  <div key={inquiry._id} className="sp-inquiry-card">
                    <div 
                      className="sp-card-header sp-card-header--clickable"
                      onClick={() => toggleInquiryDropdown(inquiry._id)}
                    >
                      <div className="sp-buyer-avatar">
                        {inquiry.buyerId.firstName?.charAt(0)}{inquiry.buyerId.lastName?.charAt(0)}
                      </div>
                      <div className="sp-buyer-info">
                        <h4 className="sp-buyer-name">
                          {inquiry.buyerId.firstName} {inquiry.buyerId.lastName}
                        </h4>
                        <p className="sp-inquiry-meta">
                          <svg className="sp-meta-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                          </svg>
                          {inquiry.totalProducts} product(s) • {new Date(inquiry.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="sp-card-toggle">
                        <svg className={`sp-toggle-icon ${isInquiryExpanded(inquiry._id) ? 'sp-toggle-icon--expanded' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>

                    {isInquiryExpanded(inquiry._id) && (
                      <div className="sp-card-body">
                        <div className="sp-info-grid">
                          <div className="sp-info-item">
                            <svg className="sp-info-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                            <div>
                              <span className="sp-info-label">Email</span>
                              <span className="sp-info-value">{inquiry.buyerId.email}</span>
                            </div>
                          </div>
                          <div className="sp-info-item">
                            <svg className="sp-info-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                            </svg>
                            <div>
                              <span className="sp-info-label">Phone</span>
                              <span className="sp-info-value">{inquiry.buyerId.mobileNumber}</span>
                            </div>
                          </div>
                          {inquiry.buyerId.country && (
                            <div className="sp-info-item">
                              <svg className="sp-info-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              </svg>
                              <div>
                                <span className="sp-info-label">Country</span>
                                <span className="sp-info-value">{inquiry.buyerId.country}</span>
                              </div>
                            </div>
                          )}
                          {inquiry.buyerId.natureOfBusiness && (
                            <div className="sp-info-item">
                              <svg className="sp-info-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                              </svg>
                              <div>
                                <span className="sp-info-label">Business</span>
                                <span className="sp-info-value">{inquiry.buyerId.natureOfBusiness}</span>
                              </div>
                            </div>
                          )}
                        </div>

                        <div className="sp-card-actions">
                          <button
                            className="sp-btn sp-btn--view"
                            onClick={() => handleInquiryClick(inquiry)}
                          >
                            <svg className="sp-btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                            View Products
                          </button>
                          <button
                            className="sp-btn sp-btn--contact"
                            onClick={() => handleBuyerClick(inquiry.buyerId._id)}
                            disabled={buyerLoading}
                          >
                            <svg className="sp-btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                            {buyerLoading ? "Loading..." : "Buyer Info"}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Responded Inquiries */}
          {respondedInquiries.length > 0 && (
            <div className="sp-inquiries-section">
              <div className="sp-section-header">
                <h3 className="sp-section-title">
                  <svg className="sp-section-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Responded Inquiries
                  <span className="sp-section-count">{respondedInquiries.length}</span>
                </h3>
              </div>
              <div className="sp-inquiries-list">
                {respondedInquiries.map((inquiry) => (
                  <div key={inquiry._id} className="sp-inquiry-card sp-inquiry-card--responded">
                    <div 
                      className="sp-card-header sp-card-header--clickable"
                      onClick={() => toggleInquiryDropdown(inquiry._id)}
                    >
                      <div className="sp-buyer-avatar sp-buyer-avatar--responded">
                        {inquiry.buyerId.firstName?.charAt(0)}{inquiry.buyerId.lastName?.charAt(0)}
                      </div>
                      <div className="sp-buyer-info">
                        <h4 className="sp-buyer-name">
                          {inquiry.buyerId.firstName} {inquiry.buyerId.lastName}
                        </h4>
                        <p className="sp-inquiry-meta">
                          {inquiry.totalProducts} product(s) • {new Date(inquiry.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="sp-card-toggle">
                        <svg className={`sp-toggle-icon ${isInquiryExpanded(inquiry._id) ? 'sp-toggle-icon--expanded' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>

                    {isInquiryExpanded(inquiry._id) && (
                      <div className="sp-card-body">
                        <div className="sp-info-grid">
                          <div className="sp-info-item">
                            <svg className="sp-info-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                            <div>
                              <span className="sp-info-label">Email</span>
                              <span className="sp-info-value">{inquiry.buyerId.email}</span>
                            </div>
                          </div>
                          <div className="sp-info-item">
                            <svg className="sp-info-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                            </svg>
                            <div>
                              <span className="sp-info-label">Phone</span>
                              <span className="sp-info-value">{inquiry.buyerId.mobileNumber}</span>
                            </div>
                          </div>
                        </div>

                        <div className="sp-card-actions">
                          <button
                            className="sp-btn sp-btn--view"
                            onClick={() => handleInquiryClick(inquiry)}
                          >
                            <svg className="sp-btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            View Details
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Closed Inquiries */}
          {closedInquiries.length > 0 && (
            <div className="sp-inquiries-section">
              <div className="sp-section-header">
                <h3 className="sp-section-title">
                  <svg className="sp-section-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Closed Inquiries
                  <span className="sp-section-count">{closedInquiries.length}</span>
                </h3>
              </div>
              <div className="sp-inquiries-list">
                {closedInquiries.map((inquiry) => (
                  <div key={inquiry._id} className="sp-inquiry-card sp-inquiry-card--closed">
                    <div 
                      className="sp-card-header sp-card-header--clickable"
                      onClick={() => toggleInquiryDropdown(inquiry._id)}
                    >
                      <div className="sp-buyer-avatar sp-buyer-avatar--closed">
                        {inquiry.buyerId.firstName?.charAt(0)}{inquiry.buyerId.lastName?.charAt(0)}
                      </div>
                      <div className="sp-buyer-info">
                        <h4 className="sp-buyer-name">
                          {inquiry.buyerId.firstName} {inquiry.buyerId.lastName}
                        </h4>
                        <p className="sp-inquiry-meta">
                          {inquiry.totalProducts} product(s) • {new Date(inquiry.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="sp-card-toggle">
                        <svg className={`sp-toggle-icon ${isInquiryExpanded(inquiry._id) ? 'sp-toggle-icon--expanded' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>

                    {isInquiryExpanded(inquiry._id) && (
                      <div className="sp-card-body">
                        <div className="sp-info-grid">
                          <div className="sp-info-item">
                            <svg className="sp-info-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                            <div>
                              <span className="sp-info-label">Email</span>
                              <span className="sp-info-value">{inquiry.buyerId.email}</span>
                            </div>
                          </div>
                        </div>

                        <div className="sp-card-actions">
                          <button
                            className="sp-btn sp-btn--view"
                            onClick={() => handleInquiryClick(inquiry)}
                          >
                            View Details
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {/* Inquiry Details Modal */}
      {showInquiryModal && selectedInquiry && (
        <div className="sp-modal-overlay" onClick={() => setShowInquiryModal(false)}>
          <div className="sp-modal" onClick={(e) => e.stopPropagation()}>
            <div className="sp-modal-header">
              <h3>Inquiry Details</h3>
              <button
                className="sp-modal-close"
                onClick={() => setShowInquiryModal(false)}
              >
                ×
              </button>
            </div>

            <div className="sp-modal-body">
              <div className="sp-modal-section">
                <h4 className="sp-modal-section-title">Buyer Information</h4>
                <div className="sp-modal-info-grid">
                  <div className="sp-modal-info-item">
                    <label>Name</label>
                    <p>{selectedInquiry.buyerId.firstName} {selectedInquiry.buyerId.lastName}</p>
                  </div>
                  <div className="sp-modal-info-item">
                    <label>Email</label>
                    <p>{selectedInquiry.buyerId.email}</p>
                  </div>
                  <div className="sp-modal-info-item">
                    <label>Phone</label>
                    <p>{selectedInquiry.buyerId.mobileNumber}</p>
                  </div>
                  {selectedInquiry.buyerId.country && (
                    <div className="sp-modal-info-item">
                      <label>Country</label>
                      <p>{selectedInquiry.buyerId.country}</p>
                    </div>
                  )}
                  {selectedInquiry.buyerId.natureOfBusiness && (
                    <div className="sp-modal-info-item">
                      <label>Business Type</label>
                      <p>{selectedInquiry.buyerId.natureOfBusiness}</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="sp-modal-section">
                <h4 className="sp-modal-section-title">Requested Products</h4>
                <div className="sp-products-list">
                  {selectedInquiry.products.map((product, index) => (
                    <div key={index} className="sp-product-card">
                      <div className="sp-product-header">
                        <h5>{product.productName}</h5>
                        <span className={`sp-product-status sp-product-status--${product.status}`}>
                          {product.status}
                        </span>
                      </div>
                      <p className="sp-product-date">
                        {new Date(product.inquiryDate).toLocaleDateString()}
                      </p>

                      {product.status === "pending" && (
                        <div className="sp-product-actions">
                          <button
                            className="sp-btn sp-btn--success"
                            onClick={() =>
                              updateInquiryStatus(
                                selectedInquiry._id,
                                product.productId,
                                "responded"
                              )
                            }
                          >
                            Mark as Responded
                          </button>
                          <button
                            className="sp-btn sp-btn--danger"
                            onClick={() =>
                              updateInquiryStatus(
                                selectedInquiry._id,
                                product.productId,
                                "closed"
                              )
                            }
                          >
                            Close
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Buyer Details Modal */}
      {showBuyerModal && selectedBuyer && (
        <div className="sp-modal-overlay" onClick={closeBuyerModal}>
          <div className="sp-modal" onClick={(e) => e.stopPropagation()}>
            <div className="sp-modal-header">
              <h3>Buyer Information</h3>
              <button className="sp-modal-close" onClick={closeBuyerModal}>
                ×
              </button>
            </div>

            <div className="sp-modal-body">
              <div className="sp-modal-section">
                <h4 className="sp-modal-section-title">Buyer Details</h4>
                <div className="sp-modal-info-grid">
                  <div className="sp-modal-info-item">
                    <label>Name</label>
                    <p>{selectedBuyer.firstName} {selectedBuyer.lastName}</p>
                  </div>
                  <div className="sp-modal-info-item">
                    <label>Email</label>
                    <p>{selectedBuyer.email}</p>
                  </div>
                  <div className="sp-modal-info-item">
                    <label>Phone</label>
                    <p>{selectedBuyer.mobileNumber}</p>
                  </div>
                  <div className="sp-modal-info-item">
                    <label>Country</label>
                    <p>{selectedBuyer.country}</p>
                  </div>
                  {selectedBuyer.natureOfBusiness && (
                    <div className="sp-modal-info-item">
                      <label>Business</label>
                      <p>{selectedBuyer.natureOfBusiness}</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="sp-modal-actions">
                <button
                  className="sp-btn sp-btn--primary"
                  onClick={() => {
                    window.location.href = `mailto:${selectedBuyer.email}`;
                  }}
                >
                  Contact Buyer
                </button>
                <button
                  className="sp-btn sp-btn--ghost"
                  onClick={closeBuyerModal}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default SellerProfile;

