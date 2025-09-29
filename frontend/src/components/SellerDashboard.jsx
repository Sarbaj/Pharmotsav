import React, { useEffect, useState } from "react";
import "../CSS/SellerDashboard.css";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

export default function SellerDashboard() {
  const [isCompanyModalOpen, setIsCompanyModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isExcelModalOpen, setIsExcelModalOpen] = useState(false);
  const [isFormPopulatedFromExcel, setIsFormPopulatedFromExcel] =
    useState(false);
  const [userdata, setUserdata] = useState(null);
  const [sellerUser, setSellerUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const { UserInfo } = useSelector((state) => state.user);
  const navigate = useNavigate();

  // Product form state
  const [productForm, setProductForm] = useState({
    productName: "",
    description: "",
    category: "",
    specifications: [],
    productImage: null,
  });

  // Categories for product selection
  const categories = [
    "API (Active Pharmaceutical Ingredient)",
    "Excipients",
    "Pharmaceutical Intermediates",
    "Pharmaceutical Chemicals",
    "Pharmaceutical Solvents",
    "Pharmaceutical Catalysts",
    "Pharmaceutical Reagents",
    "Pharmaceutical Additives",
    "Pharmaceutical Stabilizers",
    "Pharmaceutical Preservatives",
  ];

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
    }
  }, [UserInfo, sellerUser]);

  // Fetch inquiries when seller user is available
  useEffect(() => {
    if (sellerUser) {
      fetchSellerInquiries();
    }
  }, [sellerUser]);

  // Dynamic inquiry data from backend
  const [inquiries, setInquiries] = useState([]);
  const [inquiriesLoading, setInquiriesLoading] = useState(true);
  const [selectedBuyer, setSelectedBuyer] = useState(null);
  const [showBuyerModal, setShowBuyerModal] = useState(false);
  const [buyerLoading, setBuyerLoading] = useState(false);

  const [dateFilter, setDateFilter] = useState("all");
  const [filteredInquiries, setFilteredInquiries] = useState(inquiries);

  // Fetch seller inquiries from backend
  const fetchSellerInquiries = async () => {
    try {
      setInquiriesLoading(true);
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
        // Group inquiries by buyer
        const buyerGroups = {};

        data.data.inquiries.forEach((inquiry) => {
          const buyerId = inquiry.buyerId._id;
          const buyerName = `${inquiry.buyerId.firstName} ${inquiry.buyerId.lastName}`;

          if (!buyerGroups[buyerId]) {
            buyerGroups[buyerId] = {
              buyerId: buyerId,
              buyerName: buyerName,
              buyerEmail: inquiry.buyerId.email,
              buyerPhone: inquiry.buyerId.mobileNumber,
              buyerCountry: inquiry.buyerId.country,
              buyerBusiness: inquiry.buyerId.natureOfBusiness,
              products: [],
              totalProducts: 0,
              latestDate: null,
            };
          }

          // Add products from this inquiry
          inquiry.products.forEach((product) => {
            const specifications = product.productId.specification || [];
            const productDate = new Date(product.inquiryDate)
              .toISOString()
              .split("T")[0];

            buyerGroups[buyerId].products.push({
              id: product.productId._id || product.productId,
              productName: product.productName,
              date: productDate,
              status: product.status,
              specifications: specifications,
              inquiryType: "Product Inquiry",
            });

            buyerGroups[buyerId].totalProducts++;

            // Track latest date
            if (
              !buyerGroups[buyerId].latestDate ||
              productDate > buyerGroups[buyerId].latestDate
            ) {
              buyerGroups[buyerId].latestDate = productDate;
            }
          });
        });

        // Convert to array and sort by latest date
        const transformedInquiries = Object.values(buyerGroups).sort(
          (a, b) => new Date(b.latestDate) - new Date(a.latestDate)
        );

        setInquiries(transformedInquiries);
      } else {
        setInquiries([]);
      }
    } catch (error) {
      console.error("Error fetching seller inquiries:", error);
      setInquiries([]);
    } finally {
      setInquiriesLoading(false);
    }
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

  // Filter inquiries based on date
  useEffect(() => {
    if (dateFilter === "all") {
      setFilteredInquiries(inquiries);
    } else {
      const filtered = inquiries.filter((inquiry) => {
        const inquiryDate = new Date(inquiry.date);
        const now = new Date();

        switch (dateFilter) {
          case "today":
            return inquiryDate.toDateString() === now.toDateString();
          case "week":
            const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            return inquiryDate >= weekAgo;
          case "month":
            const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
            return inquiryDate >= monthAgo;
          default:
            return true;
        }
      });
      setFilteredInquiries(filtered);
    }
  }, [dateFilter, inquiries]);

  useEffect(() => {
    if (sellerUser) {
      setUserdata(sellerUser);
      console.log("Seller User:", sellerUser); // Check structure in devtools
    }
  }, [sellerUser]);

  // Product form handlers
  const handleProductInputChange = (e) => {
    const { name, value } = e.target;
    setProductForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setProductForm((prev) => ({
          ...prev,
          productImage: {
            file: file,
            preview: event.target.result,
          },
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setProductForm((prev) => ({
      ...prev,
      productImage: null,
    }));
  };

  // Excel upload functionality
  const handleExcelUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          // Parse CSV file (simplified approach)
          const csvText = event.target.result;
          const lines = csvText.split("\n");
          const headers = lines[0]
            .split(",")
            .map((h) => h.trim().replace(/"/g, ""));

          // Parse the first product row (simplified)
          if (lines.length > 1) {
            const firstProductRow = lines[1]
              .split(",")
              .map((cell) => cell.trim().replace(/"/g, ""));

            // Extract specifications dynamically
            const specifications = [];
            for (let i = 3; i < firstProductRow.length; i += 2) {
              if (firstProductRow[i] && firstProductRow[i + 1]) {
                specifications.push({
                  title: firstProductRow[i],
                  data: firstProductRow[i + 1],
                });
              }
            }

            // Populate the form with parsed data
            setProductForm({
              productName: firstProductRow[0] || "",
              description: firstProductRow[1] || "",
              category: firstProductRow[2] || "",
              specifications: specifications,
              productImage: null,
            });

            // Set flag to show Excel data was loaded
            setIsFormPopulatedFromExcel(true);

            // Close Excel modal and open product modal with populated data
            setIsExcelModalOpen(false);
            setIsProductModalOpen(true);

            console.log("Excel data parsed and form populated:", {
              productName: firstProductRow[0],
              description: firstProductRow[1],
              category: firstProductRow[2],
              specifications: specifications,
            });
          }
        } catch (error) {
          console.error("Error parsing Excel file:", error);
          alert(
            "Error parsing Excel file. Please check the format and try again."
          );
        }
      };

      // Read as text for CSV parsing
      reader.readAsText(file);
    }
  };

  const downloadExcelTemplate = () => {
    // Create a sample Excel template
    const templateData = [
      [
        "Product Name",
        "Description",
        "Category",
        "Specification Title 1",
        "Specification Value 1",
        "Specification Title 2",
        "Specification Value 2",
      ],
      [
        "Paracetamol API",
        "High purity pharmaceutical grade",
        "API (Active Pharmaceutical Ingredient)",
        "Purity",
        "99.5%",
        "Molecular Weight",
        "180.16 g/mol",
      ],
      [
        "Ibuprofen API",
        "Pharmaceutical grade API",
        "API (Active Pharmaceutical Ingredient)",
        "Purity",
        "99.8%",
        "CAS Number",
        "15687-27-1",
      ],
    ];

    // Convert to CSV for download (simplified approach)
    const csvContent = templateData.map((row) => row.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "product_template.csv";
    link.click();
    window.URL.revokeObjectURL(url);
  };

  const addSpecification = () => {
    setProductForm((prev) => ({
      ...prev,
      specifications: [...prev.specifications, { title: "", data: "" }],
    }));
  };

  const removeSpecification = (index) => {
    setProductForm((prev) => ({
      ...prev,
      specifications: prev.specifications.filter((_, i) => i !== index),
    }));
  };

  const updateSpecification = (index, field, value) => {
    setProductForm((prev) => ({
      ...prev,
      specifications: prev.specifications.map((spec, i) =>
        i === index ? { ...spec, [field]: value } : spec
      ),
    }));
  };

  const handleProductSubmit = (e) => {
    e.preventDefault();
    console.log("Product Form Data:", productForm);
    // Here you would typically send the data to your API
    alert("Product added successfully!");
    setIsProductModalOpen(false);
    setProductForm({
      productName: "",
      description: "",
      category: "",
      specifications: [],
      productImage: null,
    });
    setIsFormPopulatedFromExcel(false);
  };

  // Show loading state while checking authentication
  if (!isAuthenticated) {
    return (
      <div className="seller-dashboard">
        <div className="sd-loading">
          <div className="sd-spinner"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="seller-dashboard">
      <section className="sd-header">
        <div className="sd-user">
          <div className="sd-user-meta">
            <h2 className="sd-name">
              {userdata ? userdata.firstName : "Loading"}
            </h2>
            <p className="sd-role">
              {userdata ? userdata.natureOfBusiness : "Loading"}
            </p>

            <div className="sd-tags">
              <span className="sd-tag">Verified</span>
              <span className="sd-tag sd-tag--accent">Seller</span>
            </div>
          </div>

          {/* Company Details Section */}
          <div className="sd-company-details">
            <h3 className="sd-company-title">Company Information</h3>
            <div className="sd-company-grid">
              <div className="sd-company-item">
                <label>Company Name</label>
                <p>{userdata?.CompanyName || "Not provided"}</p>
              </div>
              <div className="sd-company-item">
                <label>Email</label>
                <p>{userdata?.email || "Not provided"}</p>
              </div>
              <div className="sd-company-item">
                <label>Phone</label>
                <p>{userdata?.mobileNumber || "Not provided"}</p>
              </div>
              <div className="sd-company-item">
                <label>License Number</label>
                <p>{userdata?.licenseNumber || "Not provided"}</p>
              </div>
              <div className="sd-company-item">
                <label>GST Number</label>
                <p>{userdata?.gstNumber || "Not provided"}</p>
              </div>
              <div className="sd-company-item">
                <label>Status</label>
                <p className={`sd-status ${userdata?.status || "pending"}`}>
                  {userdata?.status || "Pending"}
                </p>
              </div>
            </div>
          </div>

          {/* Location Details Section */}
          <div className="sd-location-details">
            <h3 className="sd-location-title">Location Information</h3>
            <div className="sd-location-grid">
              <div className="sd-location-item">
                <label>Address</label>
                <p>{userdata?.location?.address || "Not provided"}</p>
              </div>
              <div className="sd-location-item">
                <label>City</label>
                <p>{userdata?.location?.city || "Not provided"}</p>
              </div>
              <div className="sd-location-item">
                <label>State</label>
                <p>{userdata?.location?.state || "Not provided"}</p>
              </div>
              <div className="sd-location-item">
                <label>Country</label>
                <p>{userdata?.location?.country || "Not provided"}</p>
              </div>
              <div className="sd-location-item">
                <label>Pincode</label>
                <p>{userdata?.location?.pincode || "Not provided"}</p>
              </div>
              <div className="sd-location-item">
                <label>Full Address</label>
                <p>{userdata?.location?.formattedAddress || "Not provided"}</p>
              </div>
            </div>
          </div>
        </div>
        <div className="sd-actions">
          <button
            className="sd-btn sd-btn--primary sd-add-product-btn"
            onClick={() => setIsProductModalOpen(true)}
          >
            <span className="sd-btn-icon">+</span>
            Add Product
          </button>
          <button
            className="sd-btn sd-btn--secondary sd-excel-upload-btn"
            onClick={() => setIsExcelModalOpen(true)}
          >
            <span className="sd-btn-icon">📊</span>
            Upload Excel
          </button>
        </div>
      </section>

      {/* Inquiries Section - Integrated into first card */}
      <div className="sd-inquiries-section">
        <div className="sd-inquiries-header">
          <h3 className="sd-inquiries-title">Recent Inquiries</h3>
          <div className="sd-inquiries-controls">
            <div className="sd-total-inquiries">
              <span className="sd-total-number">
                {filteredInquiries.length}
              </span>
              <span className="sd-total-label">Inquiries</span>
            </div>
            <div className="sd-date-filter">
              <label htmlFor="dateFilter">Filter by:</label>
              <select
                id="dateFilter"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="sd-filter-select"
              >
                <option value="all">All Time</option>
                <option value="today">Today</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
              </select>
            </div>
          </div>
        </div>

        <div className="sd-inquiries-list">
          {inquiriesLoading ? (
            <div className="sd-loading">
              <div className="sd-spinner"></div>
              <p>Loading inquiries...</p>
            </div>
          ) : filteredInquiries.length > 0 ? (
            filteredInquiries.map((buyerGroup) => (
              <div key={buyerGroup.buyerId} className="sd-inquiry-item">
                <div className="sd-inquiry-header">
                  <div className="sd-inquiry-buyer">
                    <h4 className="sd-buyer-name">{buyerGroup.buyerName}</h4>
                    <p className="sd-buyer-info">
                      {buyerGroup.totalProducts} product
                      {buyerGroup.totalProducts !== 1 ? "s" : ""} • Latest:{" "}
                      {new Date(buyerGroup.latestDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="sd-inquiry-actions">
                    <button
                      className="sd-btn sd-btn-secondary"
                      onClick={() => handleBuyerClick(buyerGroup.buyerId)}
                      disabled={buyerLoading}
                    >
                      {buyerLoading ? "Loading..." : "View Buyer Details"}
                    </button>
                  </div>
                </div>

                <div className="sd-products-list">
                  {buyerGroup.products.map((product, index) => (
                    <div
                      key={`${buyerGroup.buyerId}-${product.id}-${index}`}
                      className="sd-product-item"
                    >
                      <div className="sd-product-header">
                        <h5 className="sd-product-name">
                          {product.productName}
                        </h5>
                        <span
                          className={`sd-status-badge sd-status-${product.status.toLowerCase()}`}
                        >
                          {product.status}
                        </span>
                      </div>

                      <div className="sd-product-details">
                        <div className="sd-info-item">
                          <label>Date</label>
                          <p>{new Date(product.date).toLocaleDateString()}</p>
                        </div>
                        {product.specifications &&
                          product.specifications.length > 0 &&
                          product.specifications
                            .slice(0, 3)
                            .map((spec, specIndex) => (
                              <div key={specIndex} className="sd-info-item">
                                <label>
                                  {spec.key || spec.name || "Specification"}
                                </label>
                                <p>{spec.value || spec.val || "N/A"}</p>
                              </div>
                            ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))
          ) : (
            <div className="sd-no-inquiries">
              <div className="sd-no-inquiries-icon">📋</div>
              <h3>No inquiries yet</h3>
              <p>You haven't received any product inquiries from buyers.</p>
            </div>
          )}
        </div>
      </div>

      {isCompanyModalOpen && (
        <div
          className="sd-modal"
          role="dialog"
          aria-modal="true"
          aria-labelledby="companyModalTitle"
        >
          <div className="sd-dialog">
            <div className="sd-dialog-head">
              <h3 id="companyModalTitle">Update Company Details</h3>
              <button
                className="sd-icon-btn"
                onClick={() => setIsCompanyModalOpen(false)}
                aria-label="Close"
              >
                ×
              </button>
            </div>
            <form className="sd-form" onSubmit={(e) => e.preventDefault()}>
              <label>
                <span>Company Name</span>
                <input type="text" defaultValue={userdata?.CompanyName || ""} />
              </label>
              <div className="sd-row">
                <label>
                  <span>Company Email</span>
                  <input type="email" defaultValue={userdata?.email || ""} />
                </label>
                <label>
                  <span>Phone</span>
                  <input
                    type="tel"
                    defaultValue={userdata?.mobileNumber || ""}
                  />
                </label>
              </div>
              <div className="sd-row">
                <label>
                  <span>License Number</span>
                  <input
                    type="text"
                    defaultValue={userdata?.licenseNumber || ""}
                  />
                </label>
                <label>
                  <span>GST Number</span>
                  <input type="text" defaultValue={userdata?.gstNumber || ""} />
                </label>
              </div>
              <label>
                <span>Address</span>
                <input
                  type="text"
                  defaultValue={userdata?.location?.formattedAddress || ""}
                />
              </label>
              <div className="sd-actions-inline">
                <button className="sd-btn sd-btn--primary" type="submit">
                  Save
                </button>
                <button
                  className="sd-btn sd-btn--ghost"
                  type="button"
                  onClick={() => setIsCompanyModalOpen(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isPasswordModalOpen && (
        <div
          className="sd-modal"
          role="dialog"
          aria-modal="true"
          aria-labelledby="passwordModalTitle"
        >
          <div className="sd-dialog">
            <div className="sd-dialog-head">
              <h3 id="passwordModalTitle">Change Password</h3>
              <button
                className="sd-icon-btn"
                onClick={() => setIsPasswordModalOpen(false)}
                aria-label="Close"
              >
                ×
              </button>
            </div>
            <form className="sd-form" onSubmit={(e) => e.preventDefault()}>
              <label>
                <span>Current Password</span>
                <input type="password" placeholder="••••••••" />
              </label>
              <label>
                <span>New Password</span>
                <input type="password" placeholder="At least 8 characters" />
              </label>
              <label>
                <span>Confirm New Password</span>
                <input type="password" placeholder="Re-type new password" />
              </label>
              <div className="sd-actions-inline">
                <button className="sd-btn sd-btn--primary" type="submit">
                  Update
                </button>
                <button
                  className="sd-btn sd-btn--ghost"
                  type="button"
                  onClick={() => setIsPasswordModalOpen(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Product Modal */}
      {isProductModalOpen && (
        <div
          className="sd-modal"
          role="dialog"
          aria-modal="true"
          aria-labelledby="productModalTitle"
        >
          <div className="sd-dialog sd-product-dialog">
            <div className="sd-dialog-head">
              <h3 id="productModalTitle">Add New Product</h3>
              <button
                className="sd-icon-btn"
                onClick={() => setIsProductModalOpen(false)}
                aria-label="Close"
              >
                ×
              </button>
            </div>
            {isFormPopulatedFromExcel && (
              <div className="sd-excel-notification">
                <div className="sd-notification-content">
                  <span className="sd-notification-icon">📊</span>
                  <span className="sd-notification-text">
                    Form populated from Excel file. Review and edit the data as
                    needed.
                  </span>
                </div>
              </div>
            )}
            <form
              className="sd-form sd-product-form"
              onSubmit={handleProductSubmit}
            >
              <div className="sd-form-section">
                <h4 className="sd-section-title">Basic Information</h4>
                <label>
                  <span>Product Name *</span>
                  <input
                    type="text"
                    name="productName"
                    value={productForm.productName}
                    onChange={handleProductInputChange}
                    placeholder="Enter product name"
                    required
                  />
                </label>

                <label>
                  <span>Description</span>
                  <textarea
                    name="description"
                    value={productForm.description}
                    onChange={handleProductInputChange}
                    placeholder="Enter product description"
                    rows="3"
                  />
                </label>

                <label>
                  <span>Category *</span>
                  <select
                    name="category"
                    value={productForm.category}
                    onChange={handleProductInputChange}
                    required
                  >
                    <option value="">Select Category</option>
                    {categories.map((category, index) => (
                      <option key={index} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <div className="sd-form-section">
                <h4 className="sd-section-title">Product Image</h4>
                <div className="sd-image-upload-section">
                  {!productForm.productImage ? (
                    <div className="sd-image-upload-area">
                      <input
                        type="file"
                        id="productImage"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="sd-image-input"
                      />
                      <label
                        htmlFor="productImage"
                        className="sd-image-upload-label"
                      >
                        <div className="sd-upload-icon">📷</div>
                        <span className="sd-upload-text">
                          Click to upload product image
                        </span>
                        <span className="sd-upload-hint">
                          PNG, JPG, JPEG up to 5MB
                        </span>
                      </label>
                    </div>
                  ) : (
                    <div className="sd-image-preview-container">
                      <div className="sd-image-preview">
                        <img
                          src={productForm.productImage.preview}
                          alt="Product preview"
                          className="sd-preview-image"
                        />
                        <button
                          type="button"
                          className="sd-remove-image-btn"
                          onClick={removeImage}
                          aria-label="Remove image"
                        >
                          ×
                        </button>
                      </div>
                      <div className="sd-image-info">
                        <p className="sd-image-name">
                          {productForm.productImage.file.name}
                        </p>
                        <p className="sd-image-size">
                          {(
                            productForm.productImage.file.size /
                            1024 /
                            1024
                          ).toFixed(2)}{" "}
                          MB
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="sd-form-section">
                <div className="sd-specifications-header">
                  <h4 className="sd-section-title">Product Specifications</h4>
                  <button
                    type="button"
                    className="sd-btn sd-btn--secondary sd-add-spec-btn"
                    onClick={addSpecification}
                  >
                    <span className="sd-btn-icon">+</span>
                    Add Specification
                  </button>
                </div>

                {productForm.specifications.map((spec, index) => (
                  <div key={index} className="sd-specification-item">
                    <div className="sd-spec-inputs">
                      <label>
                        <span>Title</span>
                        <input
                          type="text"
                          value={spec.title}
                          onChange={(e) =>
                            updateSpecification(index, "title", e.target.value)
                          }
                          placeholder="e.g., Purity, Molecular Weight"
                        />
                      </label>
                      <label>
                        <span>Value</span>
                        <input
                          type="text"
                          value={spec.data}
                          onChange={(e) =>
                            updateSpecification(index, "data", e.target.value)
                          }
                          placeholder="e.g., 99.5%, 180.16 g/mol"
                        />
                      </label>
                    </div>
                    <button
                      type="button"
                      className="sd-remove-spec-btn"
                      onClick={() => removeSpecification(index)}
                      aria-label="Remove specification"
                    >
                      ×
                    </button>
                  </div>
                ))}

                {productForm.specifications.length === 0 && (
                  <div className="sd-no-specifications">
                    <p>
                      No specifications added yet. Click "Add Specification" to
                      add product details.
                    </p>
                  </div>
                )}
              </div>

              <div className="sd-actions-inline">
                <button className="sd-btn sd-btn--primary" type="submit">
                  Add Product
                </button>
                <button
                  className="sd-btn sd-btn--ghost"
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Excel Upload Modal */}
      {isExcelModalOpen && (
        <div
          className="sd-modal"
          role="dialog"
          aria-modal="true"
          aria-labelledby="excelModalTitle"
        >
          <div className="sd-dialog sd-excel-dialog">
            <div className="sd-dialog-head">
              <h3 id="excelModalTitle">Bulk Upload Products</h3>
              <button
                className="sd-icon-btn"
                onClick={() => setIsExcelModalOpen(false)}
                aria-label="Close"
              >
                ×
              </button>
            </div>
            <div className="sd-excel-upload-content">
              <div className="sd-excel-instructions">
                <h4 className="sd-section-title">
                  How to Upload Products via Excel
                </h4>
                <ol className="sd-instructions-list">
                  <li>Download the Excel template below</li>
                  <li>Fill in your product details following the format</li>
                  <li>Upload the completed Excel file</li>
                  <li>Review and confirm the imported products</li>
                </ol>
              </div>

              <div className="sd-excel-template-section">
                <h4 className="sd-section-title">Excel Template</h4>
                <div className="sd-template-info">
                  <div className="sd-template-preview">
                    <h5>Required Columns:</h5>
                    <ul>
                      <li>
                        <strong>Product Name</strong> - Name of the product
                      </li>
                      <li>
                        <strong>Description</strong> - Product description
                      </li>
                      <li>
                        <strong>Category</strong> - Product category
                      </li>
                      <li>
                        <strong>Specification Title 1, 2, 3...</strong> -
                        Specification names
                      </li>
                      <li>
                        <strong>Specification Value 1, 2, 3...</strong> -
                        Specification values
                      </li>
                    </ul>
                  </div>
                  <button
                    className="sd-btn sd-btn--primary sd-download-template-btn"
                    onClick={downloadExcelTemplate}
                  >
                    <span className="sd-btn-icon">📥</span>
                    Download Template
                  </button>
                </div>
              </div>

              <div className="sd-excel-upload-section">
                <h4 className="sd-section-title">Upload Excel File</h4>
                <div className="sd-excel-upload-area">
                  <input
                    type="file"
                    id="excelFile"
                    accept=".xlsx,.xls,.csv"
                    onChange={handleExcelUpload}
                    className="sd-excel-input"
                  />
                  <label htmlFor="excelFile" className="sd-excel-upload-label">
                    <div className="sd-upload-icon">📊</div>
                    <span className="sd-upload-text">
                      Click to upload Excel file
                    </span>
                    <span className="sd-upload-hint">
                      Excel (.xlsx, .xls) or CSV files
                    </span>
                  </label>
                </div>
              </div>

              <div className="sd-excel-format-info">
                <h4 className="sd-section-title">Excel Data Format</h4>
                <div className="sd-format-example">
                  <table className="sd-format-table">
                    <thead>
                      <tr>
                        <th>Product Name</th>
                        <th>Description</th>
                        <th>Category</th>
                        <th>Spec Title 1</th>
                        <th>Spec Value 1</th>
                        <th>Spec Title 2</th>
                        <th>Spec Value 2</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>Paracetamol API</td>
                        <td>High purity pharmaceutical grade</td>
                        <td>API (Active Pharmaceutical Ingredient)</td>
                        <td>Purity</td>
                        <td>99.5%</td>
                        <td>Molecular Weight</td>
                        <td>180.16 g/mol</td>
                      </tr>
                      <tr>
                        <td>Ibuprofen API</td>
                        <td>Pharmaceutical grade API</td>
                        <td>API (Active Pharmaceutical Ingredient)</td>
                        <td>Purity</td>
                        <td>99.8%</td>
                        <td>CAS Number</td>
                        <td>15687-27-1</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="sd-actions-inline">
                <button
                  className="sd-btn sd-btn--ghost"
                  type="button"
                  onClick={() => setIsExcelModalOpen(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Buyer Details Modal */}
      {showBuyerModal && selectedBuyer && (
        <div
          className="sd-modal"
          role="dialog"
          aria-modal="true"
          aria-labelledby="buyerModalTitle"
        >
          <div className="sd-dialog">
            <div className="sd-dialog-head">
              <h3 id="buyerModalTitle">Buyer Details</h3>
              <button
                className="sd-icon-btn"
                onClick={closeBuyerModal}
                aria-label="Close"
              >
                ×
              </button>
            </div>
            <div className="sd-buyer-info">
              <div className="sd-buyer-header">
                <h4 className="sd-buyer-name">
                  {selectedBuyer.firstName} {selectedBuyer.lastName}
                </h4>
                <p className="sd-buyer-email">{selectedBuyer.email}</p>
              </div>

              <div className="sd-buyer-details">
                <div className="sd-detail-row">
                  <label>Phone:</label>
                  <p>{selectedBuyer.mobileNumber || "Not provided"}</p>
                </div>
                <div className="sd-detail-row">
                  <label>Country:</label>
                  <p>{selectedBuyer.country || "Not provided"}</p>
                </div>
                <div className="sd-detail-row">
                  <label>Business Type:</label>
                  <p>{selectedBuyer.natureOfBusiness || "Not provided"}</p>
                </div>
                <div className="sd-detail-row">
                  <label>Company:</label>
                  <p>{selectedBuyer.companyName || "Not provided"}</p>
                </div>
              </div>
            </div>

            <div className="sd-buyer-actions">
              <button
                className="sd-btn sd-btn--ghost"
                onClick={closeBuyerModal}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
