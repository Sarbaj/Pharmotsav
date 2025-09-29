import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../CSS/AdminDashboard.css";

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
  const navigate = useNavigate();

  // API Functions
  const fetchBuyers = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      const response = await fetch(
        "http://localhost:4000/api/v1/admin/get-all-buyers",
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();
      if (data.success) {
        setBuyers(data.data.buyers);
      }
    } catch (error) {
      console.error("Error fetching buyers:", error);
      setError("Failed to fetch buyers");
    }
  };

  const fetchSellers = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      const response = await fetch(
        "http://localhost:4000/api/v1/admin/get-all-sellers",
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();
      if (data.success) {
        setSellers(data.data.sellers);
      }
    } catch (error) {
      console.error("Error fetching sellers:", error);
      setError("Failed to fetch sellers");
    }
  };

  const approveSeller = async (sellerId, status) => {
    try {
      setLoading(true);
      const token = localStorage.getItem("adminToken");
      const response = await fetch(
        `http://localhost:4000/api/v1/admin/approve-seller/${sellerId}`,
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
      <div className="admin-container">
        {/* Header */}
        <div className="admin-header">
          <div className="admin-header-info">
            <h1 className="admin-title">Admin Dashboard</h1>
            <p className="admin-subtitle">Welcome back, {adminUser.name}</p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="admin-tabs">
          <button
            className={`admin-tab ${activeTab === "overview" ? "active" : ""}`}
            onClick={() => setActiveTab("overview")}
          >
            📊 Overview
          </button>
          <button
            className={`admin-tab ${activeTab === "users" ? "active" : ""}`}
            onClick={() => setActiveTab("users")}
          >
            👥 User Management
          </button>
          <button
            className={`admin-tab ${activeTab === "sellers" ? "active" : ""}`}
            onClick={() => setActiveTab("sellers")}
          >
            🏪 Sellers
          </button>
          <button
            className={`admin-tab ${activeTab === "buyers" ? "active" : ""}`}
            onClick={() => setActiveTab("buyers")}
          >
            🛒 Buyers
          </button>
        </div>

        {/* Content */}
        <div className="admin-content">
          {activeTab === "overview" && (
            <div className="admin-overview">
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
                </div>
              )}
            </div>
          )}

          {activeTab === "users" && (
            <div className="admin-users">
              <div className="admin-section-header">
                <h2>User Management</h2>
                <div className="admin-filters">
                  <input
                    type="text"
                    placeholder="Search users..."
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

              <div className="admin-tabs-inner">
                <button
                  className={`admin-tab-inner ${
                    activeTab === "sellers" ? "active" : ""
                  }`}
                  onClick={() => setActiveTab("sellers")}
                >
                  Sellers ({sellers.length})
                </button>
                <button
                  className={`admin-tab-inner ${
                    activeTab === "buyers" ? "active" : ""
                  }`}
                  onClick={() => setActiveTab("buyers")}
                >
                  Buyers ({buyers.length})
                </button>
              </div>
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
                        <p className="admin-user-company">
                          {seller.CompanyName}
                        </p>
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
                            backgroundColor: getStatusColor(
                              selectedUser.status
                            ),
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

        {error && (
          <div className="admin-error">
            <p>{error}</p>
            <button onClick={() => setError("")}>×</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
