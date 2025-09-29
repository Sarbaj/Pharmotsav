import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import "../CSS/SellerProfile.css";

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

  const { UserInfo } = useSelector((state) => state.user);
  const navigate = useNavigate();

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
        `http://localhost:4000/api/v1/inquiries/seller`,
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
        `http://localhost:4000/api/v1/buyers/details/${buyerId}`
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
        `http://localhost:4000/api/v1/inquiries/update-status/${inquiryId}`,
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
      <div className="sp-container">
        <div className="sp-header">
          <h1>Seller Dashboard</h1>
          <p>Manage your product inquiries</p>
        </div>

        <div className="sp-content">
          <div className="sp-inquiries-section">
            <h2>Product Inquiries</h2>

            {loading ? (
              <div className="sp-loading">
                <div className="sp-spinner"></div>
                <p>Loading inquiries...</p>
              </div>
            ) : inquiries.length > 0 ? (
              <div className="sp-inquiries-list">
                {inquiries.map((inquiry) => (
                  <div key={inquiry._id} className="sp-inquiry-card">
                    <div className="sp-inquiry-header">
                      <h3>
                        Inquiry from {inquiry.buyerId.firstName}{" "}
                        {inquiry.buyerId.lastName}
                      </h3>
                      <span className={`sp-status sp-status-${inquiry.status}`}>
                        {inquiry.status}
                      </span>
                    </div>

                    <div className="sp-inquiry-details">
                      <p>
                        <strong>Email:</strong> {inquiry.buyerId.email}
                      </p>
                      <p>
                        <strong>Phone:</strong> {inquiry.buyerId.mobileNumber}
                      </p>
                      {inquiry.buyerId.country && (
                        <p>
                          <strong>Country:</strong> {inquiry.buyerId.country}
                        </p>
                      )}
                      {inquiry.buyerId.natureOfBusiness && (
                        <p>
                          <strong>Business Type:</strong>{" "}
                          {inquiry.buyerId.natureOfBusiness}
                        </p>
                      )}
                      <p>
                        <strong>Products:</strong> {inquiry.totalProducts}
                      </p>
                      <p>
                        <strong>Date:</strong>{" "}
                        {new Date(inquiry.createdAt).toLocaleDateString()}
                      </p>
                    </div>

                    <div className="sp-inquiry-actions">
                      <button
                        className="sp-btn sp-btn-primary"
                        onClick={() => handleInquiryClick(inquiry)}
                      >
                        View Details
                      </button>
                      <button
                        className="sp-btn sp-btn-secondary"
                        onClick={() => handleBuyerClick(inquiry.buyerId._id)}
                        disabled={buyerLoading}
                      >
                        {buyerLoading ? "Loading..." : "See Buyer Details"}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="sp-no-inquiries">
                <div className="sp-no-inquiries-icon">📋</div>
                <h3>No inquiries yet</h3>
                <p>Inquiries from buyers will appear here</p>
              </div>
            )}
          </div>
        </div>

        {/* Inquiry Details Modal */}
        {showInquiryModal && selectedInquiry && (
          <div className="sp-modal">
            <div className="sp-modal-content">
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
                <div className="sp-buyer-info">
                  <h4>Buyer Information</h4>
                  <p>
                    <strong>Name:</strong> {selectedInquiry.buyerId.firstName}{" "}
                    {selectedInquiry.buyerId.lastName}
                  </p>
                  <p>
                    <strong>Email:</strong> {selectedInquiry.buyerId.email}
                  </p>
                  <p>
                    <strong>Phone:</strong>{" "}
                    {selectedInquiry.buyerId.mobileNumber}
                  </p>
                  {selectedInquiry.buyerId.country && (
                    <p>
                      <strong>Country:</strong>{" "}
                      {selectedInquiry.buyerId.country}
                    </p>
                  )}
                  {selectedInquiry.buyerId.natureOfBusiness && (
                    <p>
                      <strong>Business Type:</strong>{" "}
                      {selectedInquiry.buyerId.natureOfBusiness}
                    </p>
                  )}
                </div>

                <div className="sp-products-list">
                  <h4>Requested Products</h4>
                  {selectedInquiry.products.map((product, index) => (
                    <div key={index} className="sp-product-item">
                      <div className="sp-product-info">
                        <h5>{product.productName}</h5>
                        <p>
                          <strong>Inquiry Date:</strong>{" "}
                          {new Date(product.inquiryDate).toLocaleDateString()}
                        </p>
                        <p>
                          <strong>Status:</strong>
                          <span
                            className={`sp-product-status sp-product-status-${product.status}`}
                          >
                            {product.status}
                          </span>
                        </p>
                      </div>

                      <div className="sp-product-actions">
                        {product.status === "pending" && (
                          <>
                            <button
                              className="sp-btn sp-btn-success"
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
                              className="sp-btn sp-btn-danger"
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
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Buyer Details Modal */}
        {showBuyerModal && selectedBuyer && (
          <div className="sp-modal">
            <div className="sp-modal-content">
              <div className="sp-modal-header">
                <h3>Buyer Information</h3>
                <button className="sp-modal-close" onClick={closeBuyerModal}>
                  ×
                </button>
              </div>

              <div className="sp-modal-body">
                <div className="sp-buyer-info">
                  <h4>Buyer Details</h4>
                  <p>
                    <strong>Name:</strong> {selectedBuyer.firstName}{" "}
                    {selectedBuyer.lastName}
                  </p>
                  <p>
                    <strong>Email:</strong> {selectedBuyer.email}
                  </p>
                  <p>
                    <strong>Phone:</strong> {selectedBuyer.mobileNumber}
                  </p>
                  <p>
                    <strong>Country:</strong> {selectedBuyer.country}
                  </p>
                  {selectedBuyer.natureOfBusiness && (
                    <p>
                      <strong>Business:</strong>{" "}
                      {selectedBuyer.natureOfBusiness}
                    </p>
                  )}
                </div>

                <div className="sp-buyer-actions">
                  <button
                    className="sp-btn sp-btn-primary"
                    onClick={() => {
                      // You can add contact functionality here
                      alert(
                        `Contacting ${selectedBuyer.firstName} ${selectedBuyer.lastName}`
                      );
                    }}
                  >
                    Contact Buyer
                  </button>
                  <button
                    className="sp-btn sp-btn-ghost"
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
    </div>
  );
}

export default SellerProfile;
