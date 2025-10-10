import React, { useEffect, useState } from "react";
import "../CSS/ProfileDashboard.css";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import emailjs from "@emailjs/browser";

export default function ProfileDashboard() {
  const [isCompanyModalOpen, setIsCompanyModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isSellerModalOpen, setIsSellerModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedSeller, setSelectedSeller] = useState(null);
  const [sellerLoading, setSellerLoading] = useState(false);
  const [userdata, setUSerdata] = useState(null);
  const [inquiries, setInquiries] = useState([]);
  const [pendingInquiries, setPendingInquiries] = useState([]);
  const [recentInquiries, setRecentInquiries] = useState([]);
  const [inquiriesLoading, setInquiriesLoading] = useState(true);
  const [selectedInquiries, setSelectedInquiries] = useState([]);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [currentSellerGroup, setCurrentSellerGroup] = useState(null);
  const [expandedInquiries, setExpandedInquiries] = useState(new Set());

  const { UserInfo } = useSelector((state) => state.user);

  // Fetch inquiries from API
  const fetchInquiries = async () => {
    try {
      setInquiriesLoading(true);
      const buyerId =
        UserInfo?._id || JSON.parse(localStorage.getItem("user"))?._id;

      console.log("UserInfo:", UserInfo);
      console.log(
        "LocalStorage user:",
        JSON.parse(localStorage.getItem("user") || "null")
      );
      console.log("Buyer ID:", buyerId);

      if (!buyerId) {
        console.log("No buyer ID found");
        setInquiries([]);
        setPendingInquiries([]);
        setRecentInquiries([]);
        return;
      }

      const token = localStorage.getItem("token");
      console.log("Token:", token);

      if (!token) {
        console.log("No token found");
        setInquiries([]);
        setPendingInquiries([]);
        setRecentInquiries([]);
        return;
      }

      // Fetch pending inquiries
      const pendingResponse = await fetch(
        `http://localhost:4000/api/v1/inquiries/buyer`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Pending response status:", pendingResponse.status);

      // Fetch recent inquiries
      const recentResponse = await fetch(
        `http://localhost:4000/api/v1/inquiries/recent`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Recent response status:", recentResponse.status);

      const pendingData = await pendingResponse.json();
      const recentData = await recentResponse.json();

      console.log("Pending inquiries response:", pendingData);
      console.log("Recent inquiries response:", recentData);

      // Additional debugging
      if (pendingData.success && pendingData.data.inquiries) {
        console.log(
          "Number of pending inquiries:",
          pendingData.data.inquiries.length
        );
        console.log("First pending inquiry:", pendingData.data.inquiries[0]);
      }

      if (recentData.success && recentData.data.inquiries) {
        console.log(
          "Number of recent inquiries:",
          recentData.data.inquiries.length
        );
        console.log("First recent inquiry:", recentData.data.inquiries[0]);
      }

      if (!pendingResponse.ok) {
        console.error(
          "Pending inquiries API error:",
          pendingResponse.status,
          pendingResponse.statusText
        );
      }

      if (!recentResponse.ok) {
        console.error(
          "Recent inquiries API error:",
          recentResponse.status,
          recentResponse.statusText
        );
      }

      // Process pending inquiries
      if (pendingData.success && pendingData.data.inquiries) {
        const transformedPending = pendingData.data.inquiries.map((inquiry) => {
          // Create specifications object from the specification array
          const specifications = {};
          if (
            inquiry.productId.specification &&
            Array.isArray(inquiry.productId.specification)
          ) {
            inquiry.productId.specification.forEach((spec) => {
              specifications[spec.key] = spec.value;
            });
          }

          return {
            id: inquiry.productId._id,
            inquiryId: inquiry._id, // Store the actual inquiry ID for deletion
            productName: inquiry.productName,
            sellerName:
              inquiry.sellerId.firstName + " " + inquiry.sellerId.lastName,
            sellerEmail: inquiry.sellerId.email,
            sellerId: inquiry.sellerId._id,
            date: new Date(inquiry.createdAt || inquiry.inquiryDate)
              .toISOString()
              .split("T")[0],
            status: inquiry.status,
            productDetails: {
              description:
                inquiry.productId.description ||
                `High-quality ${inquiry.productName} from verified supplier`,
              category:
                inquiry.productId.category?.name ||
                inquiry.productId.category?.categoryName ||
                inquiry.productId.category?.title ||
                "General",
              purity:
                specifications.Purity ||
                specifications.purity ||
                "Contact for details",
              molecularWeight:
                specifications["Molecular Weight"] ||
                specifications.molecularWeight ||
                "Contact for details",
              casNumber:
                specifications["CAS Number"] ||
                specifications.casNumber ||
                "Contact for details",
              storage:
                specifications.Storage ||
                specifications.storage ||
                "Contact for details",
              packaging:
                specifications.Packaging ||
                specifications.packaging ||
                "Contact for details",
              price:
                specifications.Price ||
                specifications.price ||
                "Contact for Price",
              minimumOrder:
                specifications["Minimum Order"] ||
                specifications.minimumOrder ||
                "Contact Supplier",
              availability:
                specifications.Availability ||
                specifications.availability ||
                "Contact for availability",
              particleSize:
                specifications["Particle Size"] || specifications.particleSize,
              ...specifications,
            },
          };
        });

        console.log("Transformed pending inquiries:", transformedPending);
        console.log(
          "Setting pending inquiries count:",
          transformedPending.length
        );
        setPendingInquiries(transformedPending);
      } else {
        console.log("No pending inquiries found or API error");
        setPendingInquiries([]);
      }

      // Process recent inquiries
      if (recentData.success && recentData.data.inquiries) {
        const transformedRecent = recentData.data.inquiries.map((inquiry) => {
          const specifications = {};
          if (
            inquiry.productId.specification &&
            Array.isArray(inquiry.productId.specification)
          ) {
            inquiry.productId.specification.forEach((spec) => {
              specifications[spec.key] = spec.value;
            });
          }

          return {
            id: inquiry.productId._id,
            inquiryId: inquiry._id,
            productName: inquiry.productName,
            sellerName:
              inquiry.sellerId.firstName + " " + inquiry.sellerId.lastName,
            sellerEmail: inquiry.sellerId.email,
            sellerId: inquiry.sellerId._id,
            date: new Date(inquiry.emailSentDate).toISOString().split("T")[0],
            status: inquiry.status,
            productDetails: {
              description:
                inquiry.productId.description ||
                `High-quality ${inquiry.productName} from verified supplier`,
              category:
                inquiry.productId.category?.name ||
                inquiry.productId.category?.categoryName ||
                inquiry.productId.category?.title ||
                "General",
              purity:
                specifications.Purity ||
                specifications.purity ||
                "Contact for details",
              molecularWeight:
                specifications["Molecular Weight"] ||
                specifications.molecularWeight ||
                "Contact for details",
              casNumber:
                specifications["CAS Number"] ||
                specifications.casNumber ||
                "Contact for details",
              storage:
                specifications.Storage ||
                specifications.storage ||
                "Contact for details",
              packaging:
                specifications.Packaging ||
                specifications.packaging ||
                "Contact for details",
              price:
                specifications.Price ||
                specifications.price ||
                "Contact for Price",
              minimumOrder:
                specifications["Minimum Order"] ||
                specifications.minimumOrder ||
                "Contact Supplier",
              availability:
                specifications.Availability ||
                specifications.availability ||
                "Contact for availability",
              particleSize:
                specifications["Particle Size"] || specifications.particleSize,
              ...specifications,
            },
          };
        });

        console.log("Transformed recent inquiries:", transformedRecent);
        console.log(
          "Setting recent inquiries count:",
          transformedRecent.length
        );
        setRecentInquiries(transformedRecent);
      } else {
        console.log("No recent inquiries found or API error");
        setRecentInquiries([]);
      }

      // Note: setInquiries will be updated via useEffect when pendingInquiries and recentInquiries change
    } catch (error) {
      console.error("Error fetching inquiries:", error);
      console.error("Error details:", error.message);
      setInquiries([]);
      setPendingInquiries([]);
      setRecentInquiries([]);
    } finally {
      setInquiriesLoading(false);
    }
  };

  // Sample inquiry data - fallback
  const [sampleInquiries] = useState([
    {
      id: 1,
      productName: "Paracetamol API",
      sellerName: "MediChem Labs",
      date: "2025-09-26",
      productDetails: {
        description:
          "High purity Paracetamol Active Pharmaceutical Ingredient (API) suitable for pharmaceutical manufacturing. Meets USP/BP/EP standards.",
        category: "Analgesic API",
        purity: "99.5% min",
        molecularWeight: "151.16 g/mol",
        casNumber: "103-90-2",
        storage: "Store in cool, dry place",
        packaging: "25kg HDPE drums",
        price: "₹2,500/kg",
        minimumOrder: "100kg",
        availability: "In Stock",
      },
    },
    {
      id: 2,
      productName: "Microcrystalline Cellulose",
      sellerName: "MediChem Labs",
      date: "2024-01-12",
      productDetails: {
        description:
          "Premium grade Microcrystalline Cellulose (MCC) for tablet and capsule manufacturing. Excellent compressibility and flow properties.",
        category: "Excipient",
        purity: "99.0% min",
        particleSize: "50-100 μm",
        casNumber: "9004-34-6",
        storage: "Store in dry conditions",
        packaging: "25kg multi-wall bags",
        price: "₹1,200/kg",
        minimumOrder: "50kg",
        availability: "In Stock",
      },
    },
    {
      id: 3,
      productName: "Ibuprofen API",
      sellerName: "MediChem Labs",
      date: "2024-01-10",
      productDetails: {
        description:
          "Pharmaceutical grade Ibuprofen API for anti-inflammatory drug manufacturing. Complies with international pharmacopoeia standards.",
        category: "NSAID API",
        purity: "99.8% min",
        molecularWeight: "206.29 g/mol",
        casNumber: "15687-27-1",
        storage: "Store below 25°C",
        packaging: "25kg HDPE drums",
        price: "₹3,200/kg",
        minimumOrder: "25kg",
        availability: "In Stock",
      },
    },
    {
      id: 4,
      productName: "Titanium Dioxide",
      sellerName: "PharmaExcipients",
      date: "2024-01-08",
      productDetails: {
        description:
          "Food and pharmaceutical grade Titanium Dioxide for use as a white pigment in pharmaceutical formulations and food products.",
        category: "Pigment/Excipient",
        purity: "99.0% min",
        particleSize: "0.2-0.3 μm",
        casNumber: "13463-67-7",
        storage: "Store in dry place",
        packaging: "25kg HDPE bags",
        price: "₹800/kg",
        minimumOrder: "200kg",
        availability: "In Stock",
      },
    },
    {
      id: 5,
      productName: "Sodium Starch Glycolate",
      sellerName: "PharmaExcipients",
      date: "2024-01-05",
      productDetails: {
        description:
          "Super disintegrant for pharmaceutical tablets. Provides excellent disintegration properties and improved drug release.",
        category: "Super Disintegrant",
        purity: "99.0% min",
        particleSize: "100-200 μm",
        casNumber: "9063-38-1",
        storage: "Store in cool, dry place",
        packaging: "25kg multi-wall bags",
        price: "₹1,500/kg",
        minimumOrder: "50kg",
        availability: "In Stock",
      },
    },
  ]);

  const [dateFilter, setDateFilter] = useState("all");
  const [filteredInquiries, setFilteredInquiries] = useState(inquiries);
  const [filteredPendingInquiries, setFilteredPendingInquiries] = useState([]);
  const [filteredRecentInquiries, setFilteredRecentInquiries] = useState([]);

  // Group inquiries by seller
  const groupInquiriesBySeller = (inquiriesList) => {
    const grouped = {};
    inquiriesList.forEach((inquiry) => {
      if (!grouped[inquiry.sellerName]) {
        grouped[inquiry.sellerName] = [];
      }
      grouped[inquiry.sellerName].push(inquiry);
    });
    return grouped;
  };

  // Handle product click to open popup
  const handleProductClick = (inquiry) => {
    setSelectedProduct(inquiry);
    setIsProductModalOpen(true);
  };

  // Close product popup
  const closeProductModal = () => {
    setIsProductModalOpen(false);
    setSelectedProduct(null);
  };

  // Handle seller details click
  const handleSellerClick = async (sellerInquiries) => {
    try {
      setSellerLoading(true);
      // Get seller ID from the first inquiry (all inquiries in this group have same seller)
      const sellerId = sellerInquiries[0].sellerId;

      const response = await fetch(
        `http://localhost:4000/api/v1/sellers/details/${sellerId}`
      );

      const data = await response.json();

      if (data.success && data.data.seller) {
        setSelectedSeller(data.data.seller);
        setIsSellerModalOpen(true);
      } else {
        alert("Failed to fetch seller details");
      }
    } catch (error) {
      console.error("Error fetching seller details:", error);
      alert("Failed to fetch seller details");
    } finally {
      setSellerLoading(false);
    }
  };

  // Close seller popup
  const closeSellerModal = () => {
    setIsSellerModalOpen(false);
    setSelectedSeller(null);
  };

  // Toggle inquiry dropdown
  const toggleInquiryDropdown = (sellerName, sectionType) => {
    const uniqueKey = `${sectionType}-${sellerName}`;
    setExpandedInquiries((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(uniqueKey)) {
        newSet.delete(uniqueKey);
      } else {
        newSet.add(uniqueKey);
      }
      return newSet;
    });
  };

  // Check if inquiry is expanded
  const isInquiryExpanded = (sellerName, sectionType) => {
    const uniqueKey = `${sectionType}-${sellerName}`;
    return expandedInquiries.has(uniqueKey);
  };

  // Handle inquiry selection
  const handleInquirySelection = (inquiry, isSelected) => {
    if (isSelected) {
      setSelectedInquiries((prev) => [...prev, inquiry]);
    } else {
      setSelectedInquiries((prev) =>
        prev.filter((item) => item.id !== inquiry.id)
      );
    }
  };

  // Handle send mail button click
  const handleSendMail = (sellerInquiries) => {
    const sellerPendingInquiries = sellerInquiries.filter((inquiry) =>
      pendingInquiries.some((pending) => pending.id === inquiry.id)
    );

    if (sellerPendingInquiries.length === 0) {
      alert("No pending inquiries found for this seller");
      return;
    }

    setCurrentSellerGroup(sellerInquiries);
    setSelectedInquiries([]);
    setIsEmailModalOpen(true);
  };

  // Send email using EmailJS
  const sendEmailToSeller = async () => {
    if (selectedInquiries.length === 0) {
      alert("Please select at least one inquiry to send");
      return;
    }

    try {
      const seller = currentSellerGroup[0];

      // Generate a unique order ID for this inquiry
      const orderId = `INQ-${Date.now()}-${Math.random()
        .toString(36)
        .substr(2, 9)}`;

      // Format orders array for your EmailJS template
      const orders = selectedInquiries.map((inquiry) => ({
        name: inquiry.productName,
        units: "1", // You can modify this if you want to allow quantity selection
      }));

      // Template parameters including seller details
      const templateParams = {
        order_id: orderId,
        orders: orders, // Array of {name, units} objects for {{#orders}} loop
        email:
          seller.sellerEmail ||
          selectedSeller?.email ||
          "sarbajmalek3456@gmail.com",
        // Buyer details (person making the inquiry)
        buyer_name: userdata?.firstName + " " + userdata?.lastName || "Buyer",
        buyer_email: userdata?.email || "buyer@example.com",
        buyer_phone: userdata?.mobileNumber || "Contact for phone",
        buyer_country: userdata?.country || "Country not provided",
        // Seller details (recipient)
        seller_name: seller.sellerName || "Seller",
        seller_email:
          seller.sellerEmail || selectedSeller?.email || "seller@example.com",
      };

      console.log("Sending email with params:", templateParams);
      console.log("Orders array:", JSON.stringify(orders, null, 2));

      // Send email using EmailJS with proper options format
      const response = await emailjs.send(
        "service_hjz2pqr", // Your EmailJS service ID
        "template_hq7t1cb", // Your EmailJS template ID
        templateParams,
        {
          publicKey: "ZpEEdREOAAWs3Qh0r", // Your EmailJS public key in options object
        }
      );

      console.log("EmailJS response:", response);

      // Move selected inquiries from pending to recent via API
      try {
        const moveResponse = await fetch(
          "http://localhost:4000/api/v1/inquiries/move-to-recent",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            body: JSON.stringify({
              inquiryIds: selectedInquiries.map((inquiry) => inquiry.inquiryId),
              emailContent: `Email sent to ${currentSellerGroup[0].sellerName}`,
            }),
          }
        );

        const moveData = await moveResponse.json();

        if (moveData.success) {
          // Update local state
          const updatedPending = pendingInquiries.filter(
            (inquiry) =>
              !selectedInquiries.some((selected) => selected.id === inquiry.id)
          );
          const movedInquiries = selectedInquiries.map((inquiry) => ({
            ...inquiry,
            status: "responded",
          }));
          const updatedRecent = [...recentInquiries, ...movedInquiries];

          setPendingInquiries(updatedPending);
          setRecentInquiries(updatedRecent);
          setSelectedInquiries([]);
          setIsEmailModalOpen(false);
          setCurrentSellerGroup(null);

          alert("Email sent successfully! Inquiries moved to recent section.");
        } else {
          alert("Email sent but failed to move inquiries to recent section.");
        }
      } catch (moveError) {
        console.error("Error moving inquiries to recent:", moveError);
        alert("Email sent but failed to move inquiries to recent section.");
      }
    } catch (error) {
      console.error("Error sending email:", error);
      console.error("Error details:", error.response || error.message);

      let errorMessage = "Failed to send email. ";
      if (error.status === 422) {
        errorMessage +=
          "Template parameter error. Please check console for details.";
      } else if (error.status === 400) {
        errorMessage +=
          "Invalid request. Please check your EmailJS configuration.";
      } else {
        errorMessage += "Please try again.";
      }

      alert(errorMessage);
    }
  };

  // Close email modal
  const closeEmailModal = () => {
    setIsEmailModalOpen(false);
    setSelectedInquiries([]);
    setCurrentSellerGroup(null);
  };

  // Delete inquiry function
  const handleDeleteInquiry = async (productId, inquiryId) => {
    if (!window.confirm("Are you sure you want to delete this inquiry?")) {
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:4000/api/v1/inquiries/delete/${inquiryId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const data = await response.json();

      if (data.success) {
        // Remove from pending inquiries
        setPendingInquiries((prev) =>
          prev.filter((inquiry) => inquiry.id !== productId)
        );
        // Also remove from all inquiries
        setInquiries((prev) =>
          prev.filter((inquiry) => inquiry.id !== productId)
        );
        alert("Inquiry deleted successfully!");
      } else {
        alert(data.message || "Failed to delete inquiry");
      }
    } catch (error) {
      console.error("Error deleting inquiry:", error);
      alert("Failed to delete inquiry. Please try again.");
    }
  };

  // Filter inquiries based on date
  useEffect(() => {
    const filterByDate = (inquiriesList) => {
      if (dateFilter === "all") {
        return inquiriesList;
      } else {
        return inquiriesList.filter((inquiry) => {
          const inquiryDate = new Date(inquiry.date);
          const now = new Date();

          switch (dateFilter) {
            case "today":
              return inquiryDate.toDateString() === now.toDateString();
            case "week":
              const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
              return inquiryDate >= weekAgo;
            case "month":
              const monthAgo = new Date(
                now.getTime() - 30 * 24 * 60 * 60 * 1000
              );
              return inquiryDate >= monthAgo;
            default:
              return true;
          }
        });
      }
    };

    setFilteredInquiries(filterByDate(inquiries));
    setFilteredPendingInquiries(filterByDate(pendingInquiries));
    setFilteredRecentInquiries(filterByDate(recentInquiries));
  }, [dateFilter, inquiries, pendingInquiries, recentInquiries]);

  useEffect(() => {
    if (UserInfo) {
      setUSerdata(UserInfo);
      console.log("UserInfo:", UserInfo); // Check structure in devtools
    }
  }, [UserInfo]);

  useEffect(() => {
    fetchInquiries();
  }, [UserInfo]);

  // Combine pending and recent inquiries when they change
  useEffect(() => {
    const combinedInquiries = [...pendingInquiries, ...recentInquiries];
    console.log(
      "Combining inquiries - Pending:",
      pendingInquiries.length,
      "Recent:",
      recentInquiries.length,
      "Total:",
      combinedInquiries.length
    );
    setInquiries(combinedInquiries);
  }, [pendingInquiries, recentInquiries]);

  return (
    <div className="profile-dashboard">
      <section className="pd-header">
        <div className="pd-user">
          <div className="pd-user-meta">
            <h2 className="pd-name">
              {userdata ? userdata.firstName : "Loading"}
            </h2>
            <p className="pd-role">
              {userdata ? userdata.natureOfBuisness : "Loading"}
            </p>

            <div className="pd-tags">
              <span className="pd-tag">Verified</span>
              <span className="pd-tag pd-tag--accent">Business</span>
            </div>
          </div>

          {/* Company Details Section */}
          <div className="pd-company-details">
            <h3 className="pd-company-title">Company Information</h3>
            <div className="pd-company-grid">
              <div className="pd-company-item">
                <label>Email</label>
                <p>{userdata?.email || "Not provided"}</p>
              </div>
              <div className="pd-company-item">
                <label>Phone</label>
                <p>{userdata?.mobileNumber || "Not provided"}</p>
              </div>
              <div className="pd-company-item">
                <label>Country</label>
                <p>{userdata?.country || "Not provided"}</p>
              </div>
            </div>
          </div>
        </div>
        <div className="pd-actions">{/* actions reserved */}</div>
      </section>

      {/* Pending Inquiries Section */}
      <div className="pd-inquiries-section">
        <div className="pd-inquiries-header">
          <h3 className="pd-inquiries-title">Pending Inquiries</h3>
          <div className="pd-inquiries-controls">
            <div className="pd-total-inquiries">
              <span className="pd-total-number">
                {filteredPendingInquiries.length}
              </span>
              <span className="pd-total-label">Pending</span>
            </div>
            <div className="pd-date-filter">
              <label htmlFor="dateFilter">Filter by:</label>
              <select
                id="dateFilter"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="pd-filter-select"
              >
                <option value="all">All Time</option>
                <option value="today">Today</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
              </select>
            </div>
          </div>
        </div>

        <div className="pd-inquiries-list">
          {Object.entries(groupInquiriesBySeller(filteredPendingInquiries)).map(
            ([sellerName, sellerInquiries]) => (
              <div key={sellerName} className="pd-seller-group">
                <div
                  className="pd-seller-header pd-seller-header-clickable"
                  onClick={() => toggleInquiryDropdown(sellerName, "pending")}
                >
                  <div className="pd-seller-info">
                    <div className="pd-seller-title-row">
                      <h4 className="pd-seller-name">{sellerName}</h4>
                      <div className="pd-inquiry-toggle">
                        <span className="pd-toggle-icon">
                          {isInquiryExpanded(sellerName, "pending") ? "▼" : "▶"}
                        </span>
                      </div>
                    </div>
                    <span className="pd-product-count">
                      {sellerInquiries.length} product(s)
                    </span>
                    <p className="pd-expand-hint">
                      {isInquiryExpanded(sellerName, "pending")
                        ? "Click to collapse"
                        : "Click to expand products"}
                    </p>
                  </div>
                  <div className="pd-seller-actions">
                    <button
                      className="pd-seller-details-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSellerClick(sellerInquiries);
                      }}
                      disabled={sellerLoading}
                    >
                      {sellerLoading ? "Loading..." : "See Seller Details"}
                    </button>
                    <button
                      className="pd-send-mail-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSendMail(sellerInquiries);
                      }}
                    >
                      Send Mail
                    </button>
                  </div>
                </div>
                {isInquiryExpanded(sellerName, "pending") && (
                  <div className="pd-inquiry-dropdown">
                    <div className="pd-seller-products">
                      {sellerInquiries.map((inquiry) => (
                        <div key={inquiry.id} className="pd-inquiry-item">
                          <div
                            className="pd-inquiry-content pd-clickable"
                            onClick={() => handleProductClick(inquiry)}
                          >
                            <h5 className="pd-product-name">
                              {inquiry.productName}
                            </h5>
                            <p className="pd-inquiry-date">
                              {new Date(inquiry.date).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="pd-inquiry-actions">
                            <button
                              className="pd-delete-btn"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteInquiry(
                                  inquiry.id,
                                  inquiry.inquiryId
                                );
                              }}
                              title="Delete inquiry"
                            >
                              🗑️
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )
          )}
        </div>
      </div>

      {/* Recent Inquiries Section */}
      <div className="pd-inquiries-section">
        <div className="pd-inquiries-header">
          <h3 className="pd-inquiries-title">Recent Inquiries</h3>
          <div className="pd-inquiries-controls">
            <div className="pd-total-inquiries">
              <span className="pd-total-number">
                {filteredRecentInquiries.length}
              </span>
              <span className="pd-total-label">Recent</span>
            </div>
          </div>
        </div>

        <div className="pd-inquiries-list">
          {Object.entries(groupInquiriesBySeller(filteredRecentInquiries)).map(
            ([sellerName, sellerInquiries]) => (
              <div key={sellerName} className="pd-seller-group">
                <div
                  className="pd-seller-header pd-seller-header-clickable"
                  onClick={() => toggleInquiryDropdown(sellerName, "recent")}
                >
                  <div className="pd-seller-info">
                    <div className="pd-seller-title-row">
                      <h4 className="pd-seller-name">{sellerName}</h4>
                      <div className="pd-inquiry-toggle">
                        <span className="pd-toggle-icon">
                          {isInquiryExpanded(sellerName, "recent") ? "▼" : "▶"}
                        </span>
                      </div>
                    </div>
                    <span className="pd-product-count">
                      {sellerInquiries.length} product(s)
                    </span>
                    <p className="pd-expand-hint">
                      {isInquiryExpanded(sellerName, "recent")
                        ? "Click to collapse"
                        : "Click to expand products"}
                    </p>
                  </div>
                  <button
                    className="pd-seller-details-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSellerClick(sellerInquiries);
                    }}
                    disabled={sellerLoading}
                  >
                    {sellerLoading ? "Loading..." : "See Seller Details"}
                  </button>
                </div>
                {isInquiryExpanded(sellerName, "recent") && (
                  <div className="pd-inquiry-dropdown">
                    <div className="pd-seller-products">
                      {sellerInquiries.map((inquiry) => (
                        <div
                          key={inquiry.id}
                          className="pd-inquiry-item pd-clickable"
                          onClick={() => handleProductClick(inquiry)}
                        >
                          <div className="pd-inquiry-content">
                            <h5 className="pd-product-name">
                              {inquiry.productName}
                            </h5>
                            <p className="pd-inquiry-date">
                              {new Date(inquiry.date).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )
          )}
        </div>
      </div>

      {isCompanyModalOpen && (
        <div
          className="pd-modal"
          role="dialog"
          aria-modal="true"
          aria-labelledby="companyModalTitle"
        >
          <div className="pd-dialog">
            <div className="pd-dialog-head">
              <h3 id="companyModalTitle">Update Company Details</h3>
              <button
                className="pd-icon-btn"
                onClick={() => setIsCompanyModalOpen(false)}
                aria-label="Close"
              >
                ×
              </button>
            </div>
            <form className="pd-form" onSubmit={(e) => e.preventDefault()}>
              <div className="pd-row">
                <label>
                  <span>Company Email</span>
                  <input type="email" defaultValue="contact@acmepharma.com" />
                </label>
                <label>
                  <span>Phone</span>
                  <input type="tel" defaultValue="+91 98765 43210" />
                </label>
              </div>
              <div className="pd-row">
                <label>
                  <span>City</span>
                  <input type="text" defaultValue="Mumbai" />
                </label>
                <label>
                  <span>State</span>
                  <input type="text" defaultValue="Maharashtra" />
                </label>
              </div>
              <div className="pd-row">
                <label>
                  <span>Postal Code</span>
                  <input type="text" defaultValue="400001" />
                </label>
                <label>
                  <span>GST Number</span>
                  <input type="text" defaultValue="27ABCDE1234F1Z5" />
                </label>
              </div>
              <div className="pd-actions-inline">
                <button className="pd-btn pd-btn--primary" type="submit">
                  Save
                </button>
                <button
                  className="pd-btn pd-btn--ghost"
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
          className="pd-modal"
          role="dialog"
          aria-modal="true"
          aria-labelledby="passwordModalTitle"
        >
          <div className="pd-dialog">
            <div className="pd-dialog-head">
              <h3 id="passwordModalTitle">Change Password</h3>
              <button
                className="pd-icon-btn"
                onClick={() => setIsPasswordModalOpen(false)}
                aria-label="Close"
              >
                ×
              </button>
            </div>
            <form className="pd-form" onSubmit={(e) => e.preventDefault()}>
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
              <div className="pd-actions-inline">
                <button className="pd-btn pd-btn--primary" type="submit">
                  Update
                </button>
                <button
                  className="pd-btn pd-btn--ghost"
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

      {/* Product Info Modal */}
      {isProductModalOpen && selectedProduct && (
        <div
          className="pd-modal"
          role="dialog"
          aria-modal="true"
          aria-labelledby="productModalTitle"
        >
          <div className="pd-dialog pd-product-dialog">
            <div className="pd-dialog-head">
              <h3 id="productModalTitle">Product Information</h3>
              <button
                className="pd-icon-btn"
                onClick={closeProductModal}
                aria-label="Close"
              >
                ×
              </button>
            </div>
            <div className="pd-product-content">
              <div className="pd-product-header">
                <h4 className="pd-product-title">
                  {selectedProduct.productName}
                </h4>
                <p className="pd-product-seller">
                  Seller: {selectedProduct.sellerName}
                </p>
                <p className="pd-product-date">
                  Inquiry Date:{" "}
                  {new Date(selectedProduct.date).toLocaleDateString()}
                </p>
              </div>

              <div className="pd-product-details">
                <div className="pd-detail-section">
                  <h5 className="pd-section-title">Description</h5>
                  <p className="pd-description">
                    {selectedProduct.productDetails.description}
                  </p>
                </div>

                <div className="pd-detail-grid">
                  <div className="pd-detail-item">
                    <label>Category</label>
                    <p>{selectedProduct.productDetails.category}</p>
                  </div>
                  {Object.entries(selectedProduct.productDetails)
                    .filter(
                      ([key, value]) =>
                        key !== "description" &&
                        key !== "category" &&
                        value &&
                        value !== "Contact for details" &&
                        value !== "Contact for Price" &&
                        value !== "Contact Supplier" &&
                        value !== "Contact for availability"
                    )
                    .slice(0, 4)
                    .map(([key, value]) => (
                      <div key={key} className="pd-detail-item">
                        <label>
                          {key.charAt(0).toUpperCase() +
                            key.slice(1).replace(/([A-Z])/g, " $1")}
                        </label>
                        <p>{value}</p>
                      </div>
                    ))}
                </div>

                {Object.entries(selectedProduct.productDetails).filter(
                  ([key, value]) =>
                    key !== "description" &&
                    key !== "category" &&
                    value &&
                    value !== "Contact for details" &&
                    value !== "Contact for Price" &&
                    value !== "Contact Supplier" &&
                    value !== "Contact for availability"
                ).length > 4 && (
                  <div className="pd-detail-grid">
                    {Object.entries(selectedProduct.productDetails)
                      .filter(
                        ([key, value]) =>
                          key !== "description" &&
                          key !== "category" &&
                          value &&
                          value !== "Contact for details" &&
                          value !== "Contact for Price" &&
                          value !== "Contact Supplier" &&
                          value !== "Contact for availability"
                      )
                      .slice(4)
                      .map(([key, value]) => (
                        <div key={key} className="pd-detail-item">
                          <label>
                            {key.charAt(0).toUpperCase() +
                              key.slice(1).replace(/([A-Z])/g, " $1")}
                          </label>
                          <p>{value}</p>
                        </div>
                      ))}
                  </div>
                )}
              </div>

              <div className="pd-product-actions">
                <button
                  className="pd-btn pd-btn--primary"
                  onClick={() => {
                    // Add to cart or contact seller functionality
                    console.log(
                      "Contact seller for:",
                      selectedProduct.productName
                    );
                  }}
                >
                  Contact Seller
                </button>
                <button
                  className="pd-btn pd-btn--ghost"
                  onClick={closeProductModal}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Seller Details Modal */}
      {isSellerModalOpen && selectedSeller && (
        <div
          className="pd-modal"
          role="dialog"
          aria-modal="true"
          aria-labelledby="sellerModalTitle"
        >
          <div className="pd-dialog pd-seller-dialog">
            <div className="pd-dialog-head">
              <h3 id="sellerModalTitle">Seller Information</h3>
              <button
                className="pd-icon-btn"
                onClick={closeSellerModal}
                aria-label="Close"
              >
                ×
              </button>
            </div>
            <div className="pd-seller-content">
              <div className="pd-seller-header-info">
                <h4 className="pd-seller-name-title">
                  {selectedSeller.firstName} {selectedSeller.lastName}
                </h4>
                {selectedSeller.CompanyName && (
                  <p className="pd-company-name">
                    {selectedSeller.CompanyName}
                  </p>
                )}
              </div>

              <div className="pd-seller-details">
                <div className="pd-detail-row">
                  <span className="pd-detail-label">Email:</span>
                  <span className="pd-detail-value">
                    {selectedSeller.email}
                  </span>
                </div>
                <div className="pd-detail-row">
                  <span className="pd-detail-label">Phone:</span>
                  <span className="pd-detail-value">
                    {selectedSeller.mobileNumber}
                  </span>
                </div>
                <div className="pd-detail-row">
                  <span className="pd-detail-label">Address:</span>
                  <span className="pd-detail-value">
                    {selectedSeller.location?.address || "Address not provided"}
                  </span>
                </div>
                <div className="pd-detail-row">
                  <span className="pd-detail-label">City:</span>
                  <span className="pd-detail-value">
                    {selectedSeller.location?.city || "City not provided"}
                  </span>
                </div>
                <div className="pd-detail-row">
                  <span className="pd-detail-label">State:</span>
                  <span className="pd-detail-value">
                    {selectedSeller.location?.state || "State not provided"}
                  </span>
                </div>
                <div className="pd-detail-row">
                  <span className="pd-detail-label">Pincode:</span>
                  <span className="pd-detail-value">
                    {selectedSeller.location?.pincode || "Pincode not provided"}
                  </span>
                </div>
                {selectedSeller.natureOfBusiness && (
                  <div className="pd-detail-row">
                    <span className="pd-detail-label">Business:</span>
                    <span className="pd-detail-value">
                      {selectedSeller.natureOfBusiness}
                    </span>
                  </div>
                )}
                {selectedSeller.licenseNumber && (
                  <div className="pd-detail-row">
                    <span className="pd-detail-label">License:</span>
                    <span className="pd-detail-value">
                      {selectedSeller.licenseNumber}
                    </span>
                  </div>
                )}
                {selectedSeller.gstNumber && (
                  <div className="pd-detail-row">
                    <span className="pd-detail-label">GST:</span>
                    <span className="pd-detail-value">
                      {selectedSeller.gstNumber}
                    </span>
                  </div>
                )}
              </div>

              <div className="pd-seller-actions">
                <button
                  className="pd-btn pd-btn--primary"
                  onClick={() => {
                    // You can add contact functionality here
                    alert(
                      `Contacting ${selectedSeller.firstName} ${selectedSeller.lastName}`
                    );
                  }}
                >
                  Contact Seller
                </button>
                <button
                  className="pd-btn pd-btn--ghost"
                  onClick={closeSellerModal}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Email Selection Modal */}
      {isEmailModalOpen && currentSellerGroup && (
        <div
          className="pd-modal"
          role="dialog"
          aria-modal="true"
          aria-labelledby="emailModalTitle"
        >
          <div className="pd-dialog pd-email-dialog">
            <div className="pd-dialog-head">
              <h3 id="emailModalTitle">Select Products to Send Email</h3>
              <button
                className="pd-icon-btn"
                onClick={closeEmailModal}
                aria-label="Close"
              >
                ×
              </button>
            </div>
            <div className="pd-email-content">
              <div className="pd-seller-info-header">
                <h4>Sending to: {currentSellerGroup[0]?.sellerName}</h4>
                <p>Select the products you want to inquire about:</p>
              </div>

              <div className="pd-product-selection">
                {currentSellerGroup
                  .filter((inquiry) =>
                    pendingInquiries.some(
                      (pending) => pending.id === inquiry.id
                    )
                  )
                  .map((inquiry) => (
                    <div key={inquiry.id} className="pd-selectable-inquiry">
                      <label className="pd-checkbox-label">
                        <input
                          type="checkbox"
                          checked={selectedInquiries.some(
                            (selected) => selected.id === inquiry.id
                          )}
                          onChange={(e) =>
                            handleInquirySelection(inquiry, e.target.checked)
                          }
                          className="pd-checkbox"
                        />
                        <div className="pd-inquiry-details">
                          <h5 className="pd-product-name">
                            {inquiry.productName}
                          </h5>
                          <p className="pd-inquiry-date">
                            Inquiry Date:{" "}
                            {new Date(inquiry.date).toLocaleDateString()}
                          </p>
                        </div>
                      </label>
                    </div>
                  ))}
              </div>

              <div className="pd-email-actions">
                <button
                  className="pd-btn pd-btn--primary"
                  onClick={sendEmailToSeller}
                  disabled={selectedInquiries.length === 0}
                >
                  Send Email ({selectedInquiries.length} selected)
                </button>
                <button
                  className="pd-btn pd-btn--ghost"
                  onClick={closeEmailModal}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
