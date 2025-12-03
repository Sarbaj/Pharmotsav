import React, { useEffect, useState } from "react";
import "../CSS/ProfileDashboard.css";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import emailjs from "@emailjs/browser";
import { addBasicInfo } from "./REDUX/UserSlice";
import { API_BASE_URL, API_ENDPOINTS } from "../config/api";

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
  const [isProfileUpdateModalOpen, setIsProfileUpdateModalOpen] =
    useState(false);
  const [isPasswordChangeModalOpen, setIsPasswordChangeModalOpen] =
    useState(false);
  const [isForgotPasswordModalOpen, setIsForgotPasswordModalOpen] =
    useState(false);
  const [profileUpdateData, setProfileUpdateData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    mobileNumber: "",
    country: "",
    natureOfBusiness: "",
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [forgotPasswordData, setForgotPasswordData] = useState({
    email: "",
  });
  const [otpData, setOtpData] = useState({
    mobileNumber: "",
    otp: "",
    isOtpSent: false,
    isOtpVerified: false,
  });
  const [emailOtpData, setEmailOtpData] = useState({
    email: "",
    otp: "",
    isOtpSent: false,
    isOtpVerified: false,
  });

  const { UserInfo } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  // Function to update user data in both Redux store and localStorage
  const updateUserData = (newUserData) => {
    // Update Redux store
    dispatch(addBasicInfo(newUserData));

    // Update localStorage
    const existingUserData = JSON.parse(localStorage.getItem("user") || "null");
    if (existingUserData) {
      const updatedUserData = { ...existingUserData, ...newUserData };
      localStorage.setItem("user", JSON.stringify(updatedUserData));
    }

    // Update local state
    setUSerdata(newUserData);
  };

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
        `${API_BASE_URL}${API_ENDPOINTS.INQUIRIES.BUYER}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Pending response status:", pendingResponse.status);

      // Fetch recent inquiries
      const recentResponse = await fetch(
        `${API_BASE_URL}${API_ENDPOINTS.INQUIRIES.RECENT}`,
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
        `${API_BASE_URL}${API_ENDPOINTS.SELLERS.DETAILS}/${sellerId}`
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
          `${API_BASE_URL}${API_ENDPOINTS.INQUIRIES.MOVE_TO_RECENT}`,
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

  // Profile Update Functions
  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");

      // Update basic profile info (name, country, nature of business)
      const basicProfileData = {
        firstName: profileUpdateData.firstName,
        lastName: profileUpdateData.lastName,
        email: userdata.email, // Keep current email for basic update
        mobileNumber: userdata.mobileNumber, // Keep current mobile for basic update
        country: profileUpdateData.country,
        natureOfBusiness: profileUpdateData.natureOfBusiness,
      };

      const response = await fetch(
        `${API_BASE_URL}${API_ENDPOINTS.BUYERS.UPDATE_PROFILE}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(basicProfileData),
        }
      );

      const data = await response.json();

      if (data.success) {
        let updatedUserData = { ...data.data };

        // Update email if it was changed and verified
        if (
          profileUpdateData.email !== userdata.email &&
          emailOtpData.isOtpVerified
        ) {
          const emailResponse = await fetch(
            `${API_BASE_URL}${API_ENDPOINTS.BUYERS.UPDATE_EMAIL}`,
            {
              method: "PATCH",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({
                email: profileUpdateData.email,
                isEmailVerified: true,
              }),
            }
          );

          const emailData = await emailResponse.json();
          if (!emailData.success) {
            alert(emailData.message || "Failed to update email");
            return;
          }
          updatedUserData = { ...updatedUserData, ...emailData.data };
        }

        // Update mobile number if it was changed and verified
        if (
          profileUpdateData.mobileNumber !== userdata.mobileNumber &&
          otpData.isOtpVerified
        ) {
          const mobileResponse = await fetch(
            `${API_BASE_URL}${API_ENDPOINTS.BUYERS.UPDATE_MOBILE}`,
            {
              method: "PATCH",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({
                mobileNumber: profileUpdateData.mobileNumber,
                isMobileVerified: true,
              }),
            }
          );

          const mobileData = await mobileResponse.json();
          if (!mobileData.success) {
            alert(mobileData.message || "Failed to update mobile number");
            return;
          }
          updatedUserData = { ...updatedUserData, ...mobileData.data };
        }

        // Update user data in Redux store, localStorage, and local state
        updateUserData(updatedUserData);

        alert("Profile updated successfully!");
        setIsProfileUpdateModalOpen(false);

        // Reset form
        setProfileUpdateData({
          firstName: "",
          lastName: "",
          email: "",
          mobileNumber: "",
          country: "",
          natureOfBusiness: "",
        });
        // Reset OTP states
        setOtpData({
          mobileNumber: "",
          otp: "",
          isOtpSent: false,
          isOtpVerified: false,
        });
        setEmailOtpData({
          email: "",
          otp: "",
          isOtpSent: false,
          isOtpVerified: false,
        });
      } else {
        alert(data.message || "Failed to update profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile. Please try again.");
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert("New passwords do not match");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${API_BASE_URL}${API_ENDPOINTS.BUYERS.CHANGE_PASSWORD}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            oldPassword: passwordData.currentPassword,
            newPassword: passwordData.newPassword,
          }),
        }
      );

      const data = await response.json();

      if (data.success) {
        alert("Password changed successfully!");
        setIsPasswordChangeModalOpen(false);
        setPasswordData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      } else {
        alert(data.message || "Failed to change password");
      }
    } catch (error) {
      console.error("Error changing password:", error);
      alert("Failed to change password. Please try again.");
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    try{
      const response = await fetch(
        `${API_BASE_URL}${API_ENDPOINTS.BUYERS.FORGOT_PASSWORD}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: forgotPasswordData.email,
          }),
        }
      );

      const data = await response.json();

      if (data.success) {
        alert("Password reset email sent successfully!");
        setIsForgotPasswordModalOpen(false);
        setForgotPasswordData({ email: "" });
      } else {
        alert(data.message || "Failed to send reset email");
      }
    } catch (error) {
      console.error("Error sending reset email:", error);
      alert("Failed to send reset email. Please try again.");
    }
  };

  const sendOTPForMobileUpdate = async () => {
    try {
      console.log("Sending mobile OTP for:", userdata.mobileNumber);

      console.log("Userdata object:", userdata);

      // Send OTP to current mobile number for verification
      const response = await fetch(
        `${API_BASE_URL}${API_ENDPOINTS.OTP.BUYER_PHONE_UPDATE_INITIATE}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            mobileNumber: userdata.mobileNumber, // Send OTP to current mobile
          }),
        }
      );

      const data = await response.json();
      console.log("Mobile OTP response:", data);

      if (data.success) {
        setOtpData((prev) => ({
          ...prev,
          mobileNumber: userdata.mobileNumber, // Store current mobile for verification
          isOtpSent: true,
        }));
        alert(
          `OTP sent successfully to your current mobile: ${userdata.mobileNumber}`
        );
      } else {
        console.error("Mobile OTP error:", data);
        alert(data.message || "Failed to send OTP");
      }
    } catch (error) {
      console.error("Error sending OTP:", error);
      alert("Failed to send OTP. Please try again.");
    }
  };

  const verifyOTPForMobileUpdate = async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}${API_ENDPOINTS.OTP.BUYER_PHONE_UPDATE_VERIFY}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            mobileNumber: userdata.mobileNumber, // Verify OTP for current mobile
            otp: otpData.otp,
          }),
        }
      );

      const data = await response.json();

      if (data.success) {
        setOtpData((prev) => ({
          ...prev,
          isOtpVerified: true,
        }));
        alert(
          "Mobile verification successful! You can now change your mobile number."
        );
      } else {
        alert(data.message || "Invalid OTP");
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
      alert("Failed to verify OTP. Please try again.");
    }
  };

  const sendOTPForEmailUpdate = async () => {
    try {
      console.log("Sending email OTP for:", userdata.email);
      console.log("Userdata object:", userdata);

      // Send OTP to current email for verification
      const response = await fetch(
        `${API_BASE_URL}${API_ENDPOINTS.OTP.BUYER_EMAIL_UPDATE_INITIATE}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: userdata.email, // Send OTP to current email
          }),
        }
      );

      const data = await response.json();
      console.log("Email OTP response:", data);

      if (data.success) {
        setEmailOtpData((prev) => ({
          ...prev,
          email: userdata.email, // Store current email for verification
          isOtpSent: true,
        }));
        alert(`OTP sent successfully to your current email: ${userdata.email}`);
      } else {
        console.error("Email OTP error:", data);
        alert(data.message || "Failed to send OTP");
      }
    } catch (error) {
      console.error("Error sending email OTP:", error);
      alert("Failed to send OTP. Please try again.");
    }
  };

  const verifyOTPForEmailUpdate = async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}${API_ENDPOINTS.OTP.BUYER_EMAIL_UPDATE_VERIFY}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: userdata.email, // Verify OTP for current email
            otp: emailOtpData.otp,
          }),
        }
      );

      const data = await response.json();

      if (data.success) {
        setEmailOtpData((prev) => ({
          ...prev,
          isOtpVerified: true,
        }));
        alert(
          "Email verification successful! You can now change your email address."
        );
      } else {
        alert(data.message || "Invalid OTP");
      }
    } catch (error) {
      console.error("Error verifying email OTP:", error);
      alert("Failed to verify OTP. Please try again.");
    }
  };

  // Initialize profile data when modal opens
  const openProfileUpdateModal = () => {
    if (userdata) {
      setProfileUpdateData({
        firstName: userdata.firstName || "",
        lastName: userdata.lastName || "",
        email: userdata.email || "",
        mobileNumber: userdata.mobileNumber || "",
        country: userdata.country || "",
        natureOfBusiness: userdata.natureOfBusiness || "",
      });
    }
    setIsProfileUpdateModalOpen(true);
  };

  // Delete inquiry function
  const handleDeleteInquiry = async (productId, inquiryId) => {
    if (!window.confirm("Are you sure you want to delete this inquiry?")) {
      return;
    }

    try {
      const response = await fetch(
        `${API_BASE_URL}${API_ENDPOINTS.INQUIRIES.DELETE}/${inquiryId}`,
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
          <div className="pd-user-avatar">
            {userdata ? 
              `${userdata.firstName?.charAt(0) || ''}${userdata.lastName?.charAt(0) || ''}`.toUpperCase() 
              : 'U'}
          </div>
          <div className="pd-user-meta">
            <h2 className="pd-name">
              {userdata ? `${userdata.firstName} ${userdata.lastName || ''}` : "Loading"}
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
        <div className="pd-actions">
          <button
            className="pd-btn pd-btn--primary"
            onClick={openProfileUpdateModal}
          >
            Update Profile
          </button>
          <button
            className="pd-btn pd-btn--logout"
            onClick={() => {
              localStorage.clear();
              window.location.href = '/';
            }}
          >
            Logout
          </button>
        </div>
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

      {/* Profile Update Modal */}
      {isProfileUpdateModalOpen && (
        <div
          className="pd-modal"
          role="dialog"
          aria-modal="true"
          aria-labelledby="profileUpdateModalTitle"
        >
          <div className="pd-dialog">
            <div className="pd-dialog-head">
              <h3 id="profileUpdateModalTitle">Update Profile</h3>
              <button
                className="pd-icon-btn"
                onClick={() => setIsProfileUpdateModalOpen(false)}
                aria-label="Close"
              >
                ×
              </button>
            </div>
            <form className="pd-form" onSubmit={handleProfileUpdate}>
              <div className="pd-row">
                <label>
                  <span>First Name</span>
                  <input
                    type="text"
                    value={profileUpdateData.firstName}
                    onChange={(e) =>
                      setProfileUpdateData((prev) => ({
                        ...prev,
                        firstName: e.target.value,
                      }))
                    }
                    required
                  />
                </label>
                <label>
                  <span>Last Name</span>
                  <input
                    type="text"
                    value={profileUpdateData.lastName}
                    onChange={(e) =>
                      setProfileUpdateData((prev) => ({
                        ...prev,
                        lastName: e.target.value,
                      }))
                    }
                    required
                  />
                </label>
              </div>
              <label>
                <span>Email Address</span>
                <div
                  style={{
                    display: "flex",
                    gap: "8px",
                    alignItems: "center",
                  }}
                >
                  <input
                    type="email"
                    value={profileUpdateData.email}
                    onChange={(e) =>
                      setProfileUpdateData((prev) => ({
                        ...prev,
                        email: e.target.value,
                      }))
                    }
                    required
                    style={{ flex: 1 }}
                    readOnly={!emailOtpData.isOtpVerified}
                    className={
                      !emailOtpData.isOtpVerified ? "readonly-field" : ""
                    }
                  />
                  {!emailOtpData.isOtpVerified && (
                    <button
                      type="button"
                      className="pd-btn pd-btn--ghost"
                      onClick={sendOTPForEmailUpdate}
                      style={{ whiteSpace: "nowrap" }}
                    >
                      Change Email
                    </button>
                  )}
                </div>
                {emailOtpData.isOtpSent && !emailOtpData.isOtpVerified && (
                  <div className="pd-otp-section">
                    <div className="pd-otp-input-group">
                      <input
                        type="text"
                        placeholder="Enter OTP sent to your email"
                        value={emailOtpData.otp}
                        onChange={(e) =>
                          setEmailOtpData((prev) => ({
                            ...prev,
                            otp: e.target.value,
                          }))
                        }
                      />
                      <button
                        type="button"
                        className="pd-btn pd-btn--primary"
                        onClick={verifyOTPForEmailUpdate}
                      >
                        Verify
                      </button>
                    </div>
                  </div>
                )}
                {emailOtpData.isOtpVerified && (
                  <p className="pd-otp-verified">
                    Email verified - You can now edit
                  </p>
                )}
              </label>
              <div className="pd-row">
                <label>
                  <span>Mobile Number</span>
                  <div
                    style={{
                      display: "flex",
                      gap: "8px",
                      alignItems: "center",
                    }}
                  >
                    <input
                      type="tel"
                      value={profileUpdateData.mobileNumber}
                      onChange={(e) =>
                        setProfileUpdateData((prev) => ({
                          ...prev,
                          mobileNumber: e.target.value,
                        }))
                      }
                      required
                      style={{ flex: 1 }}
                      readOnly={!otpData.isOtpVerified}
                      className={!otpData.isOtpVerified ? "readonly-field" : ""}
                    />
                    {!otpData.isOtpVerified && (
                      <button
                        type="button"
                        className="pd-btn pd-btn--ghost"
                        onClick={sendOTPForMobileUpdate}
                        style={{ whiteSpace: "nowrap" }}
                      >
                        Change Mobile
                      </button>
                    )}
                  </div>
                  {otpData.isOtpSent && !otpData.isOtpVerified && (
                    <div className="pd-otp-section">
                      <div className="pd-otp-input-group">
                        <input
                          type="text"
                          placeholder="Enter OTP sent to your mobile"
                          value={otpData.otp}
                          onChange={(e) =>
                            setOtpData((prev) => ({
                              ...prev,
                              otp: e.target.value,
                            }))
                          }
                        />
                        <button
                          type="button"
                          className="pd-btn pd-btn--primary"
                          onClick={verifyOTPForMobileUpdate}
                        >
                          Verify
                        </button>
                      </div>
                    </div>
                  )}
                  {otpData.isOtpVerified && (
                    <p className="pd-otp-verified">
                      Mobile verified - You can now edit
                    </p>
                  )}
                </label>
                <label>
                  <span>Country</span>
                  <input
                    type="text"
                    value={profileUpdateData.country}
                    onChange={(e) =>
                      setProfileUpdateData((prev) => ({
                        ...prev,
                        country: e.target.value,
                      }))
                    }
                    required
                  />
                </label>
              </div>
              <label>
                <span>Nature of Business</span>
                <select
                  value={profileUpdateData.natureOfBusiness}
                  onChange={(e) =>
                    setProfileUpdateData((prev) => ({
                      ...prev,
                      natureOfBusiness: e.target.value,
                    }))
                  }
                  required
                >
                  <option value="">Select Business Type</option>
                  <option value="Pharmacy">Pharmacy</option>
                  <option value="Hospital">Hospital</option>
                  <option value="Agent">Agent</option>
                  <option value="Distributors">Distributors</option>
                  <option value="Manufacturer">Manufacturer</option>
                  <option value="Other">Other</option>
                </select>
              </label>
              <div className="pd-actions-inline">
                <button className="pd-btn pd-btn--primary" type="submit">
                  Update Profile
                </button>
                <button
                  className="pd-btn pd-btn--ghost"
                  type="button"
                  onClick={() => setIsProfileUpdateModalOpen(false)}
                >
                  Cancel
                </button>
              </div>
              <div className="pd-password-options">
                <h4>Password Options</h4>
                <div className="pd-actions-inline">
                  <button
                    className="pd-btn pd-btn--ghost"
                    type="button"
                    onClick={() => {
                      setIsProfileUpdateModalOpen(false);
                      setIsPasswordChangeModalOpen(true);
                    }}
                  >
                    Change Password
                  </button>
                  <button
                    className="pd-btn pd-btn--ghost"
                    type="button"
                    onClick={() => {
                      setIsProfileUpdateModalOpen(false);
                      setIsForgotPasswordModalOpen(true);
                    }}
                  >
                    Forgot Password
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Password Change Modal */}
      {isPasswordChangeModalOpen && (
        <div
          className="pd-modal"
          role="dialog"
          aria-modal="true"
          aria-labelledby="passwordChangeModalTitle"
        >
          <div className="pd-dialog">
            <div className="pd-dialog-head">
              <h3 id="passwordChangeModalTitle">Change Password</h3>
              <button
                className="pd-icon-btn"
                onClick={() => setIsPasswordChangeModalOpen(false)}
                aria-label="Close"
              >
                ×
              </button>
            </div>
            <form className="pd-form" onSubmit={handlePasswordChange}>
              <label>
                <span>Current Password</span>
                <input
                  type="password"
                  value={passwordData.currentPassword}
                  onChange={(e) =>
                    setPasswordData((prev) => ({
                      ...prev,
                      currentPassword: e.target.value,
                    }))
                  }
                  required
                />
              </label>
              <label>
                <span>New Password</span>
                <input
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) =>
                    setPasswordData((prev) => ({
                      ...prev,
                      newPassword: e.target.value,
                    }))
                  }
                  required
                  minLength="8"
                />
              </label>
              <label>
                <span>Confirm New Password</span>
                <input
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) =>
                    setPasswordData((prev) => ({
                      ...prev,
                      confirmPassword: e.target.value,
                    }))
                  }
                  required
                  minLength="8"
                />
              </label>
              <div className="pd-actions-inline">
                <button className="pd-btn pd-btn--primary" type="submit">
                  Change Password
                </button>
                <button
                  className="pd-btn pd-btn--ghost"
                  type="button"
                  onClick={() => setIsPasswordChangeModalOpen(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Forgot Password Modal */}
      {isForgotPasswordModalOpen && (
        <div
          className="pd-modal"
          role="dialog"
          aria-modal="true"
          aria-labelledby="forgotPasswordModalTitle"
        >
          <div className="pd-dialog">
            <div className="pd-dialog-head">
              <h3 id="forgotPasswordModalTitle">Reset Password</h3>
              <button
                className="pd-icon-btn"
                onClick={() => setIsForgotPasswordModalOpen(false)}
                aria-label="Close"
              >
                ×
              </button>
            </div>
            <form className="pd-form" onSubmit={handleForgotPassword}>
              <label>
                <span>Email Address</span>
                <input
                  type="email"
                  value={forgotPasswordData.email}
                  onChange={(e) =>
                    setForgotPasswordData((prev) => ({
                      ...prev,
                      email: e.target.value,
                    }))
                  }
                  required
                />
              </label>
              <p style={{ fontSize: "12px", color: "#666", margin: "8px 0" }}>
                We'll send you a password reset link to your email address.
              </p>
              <div className="pd-actions-inline">
                <button className="pd-btn pd-btn--primary" type="submit">
                  Send Reset Link
                </button>
                <button
                  className="pd-btn pd-btn--ghost"
                  type="button"
                  onClick={() => setIsForgotPasswordModalOpen(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
