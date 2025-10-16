import React, { useEffect, useState } from "react";
import "../CSS/SellerDashboard.css";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { addBasicInfo } from "./REDUX/UserSlice";

export default function SellerDashboard() {
  const [isCompanyModalOpen, setIsCompanyModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isExcelModalOpen, setIsExcelModalOpen] = useState(false);
  const [isProfileUpdateModalOpen, setIsProfileUpdateModalOpen] =
    useState(false);
  const [isPasswordChangeModalOpen, setIsPasswordChangeModalOpen] =
    useState(false);
  const [isForgotPasswordModalOpen, setIsForgotPasswordModalOpen] =
    useState(false);
  const [isFormPopulatedFromExcel, setIsFormPopulatedFromExcel] =
    useState(false);
  const [excelProducts, setExcelProducts] = useState([]);
  const [isBulkUploading, setIsBulkUploading] = useState(false);
  const [expandedInquiries, setExpandedInquiries] = useState(new Set());
  const [userdata, setUserdata] = useState(null);
  const [sellerUser, setSellerUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [profileUpdateData, setProfileUpdateData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    mobileNumber: "",
    country: "",
    natureOfBusiness: "",
    CompanyName: "",
    licenseNumber: "",
    gstNumber: "",
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
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Product form state
  const [productForm, setProductForm] = useState({
    productName: "",
    description: "",
    category: "",
    specifications: [],
    productImage: null,
  });

  // Categories state
  const [categories, setCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);

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

  // Fetch categories from backend
  const fetchCategories = async () => {
    try {
      setCategoriesLoading(true);
      const response = await fetch(
        "http://localhost:4000/api/v1/categories/get-all-categories"
      );
      const data = await response.json();

      if (data.success && data.data) {
        setCategories(data.data);
      } else {
        console.error("Failed to fetch categories:", data.message);
        // Fallback to hardcoded categories if API fails
        setCategories([
          { _id: "1", categoryName: "API (Active Pharmaceutical Ingredient)" },
          { _id: "2", categoryName: "Excipients" },
          { _id: "3", categoryName: "Pharmaceutical Intermediates" },
          { _id: "4", categoryName: "Pharmaceutical Chemicals" },
          { _id: "5", categoryName: "Pharmaceutical Solvents" },
          { _id: "6", categoryName: "Pharmaceutical Catalysts" },
          { _id: "7", categoryName: "Pharmaceutical Reagents" },
          { _id: "8", categoryName: "Pharmaceutical Additives" },
          { _id: "9", categoryName: "Pharmaceutical Stabilizers" },
          { _id: "10", categoryName: "Pharmaceutical Preservatives" },
        ]);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
      // Fallback to hardcoded categories
      setCategories([
        { _id: "1", categoryName: "API (Active Pharmaceutical Ingredient)" },
        { _id: "2", categoryName: "Excipients" },
        { _id: "3", categoryName: "Pharmaceutical Intermediates" },
        { _id: "4", categoryName: "Pharmaceutical Chemicals" },
        { _id: "5", categoryName: "Pharmaceutical Solvents" },
        { _id: "6", categoryName: "Pharmaceutical Catalysts" },
        { _id: "7", categoryName: "Pharmaceutical Reagents" },
        { _id: "8", categoryName: "Pharmaceutical Additives" },
        { _id: "9", categoryName: "Pharmaceutical Stabilizers" },
        { _id: "10", categoryName: "Pharmaceutical Preservatives" },
      ]);
    } finally {
      setCategoriesLoading(false);
    }
  };

  // Fetch inquiries when seller user is available
  useEffect(() => {
    if (sellerUser) {
      fetchSellerInquiries();
    }
  }, [sellerUser]);

  // Fetch categories on component mount
  useEffect(() => {
    fetchCategories();
  }, []);

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
        `http://localhost:4000/api/v1/inquiries/seller-recent`,
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

          // Add product from this inquiry (recent inquiries have single product per inquiry)
          const specifications = inquiry.productId?.specification || [];
          const productDate = new Date(
            inquiry.emailSentDate || inquiry.createdAt
          )
            .toISOString()
            .split("T")[0];

          buyerGroups[buyerId].products.push({
            id: inquiry.productId._id || inquiry.productId,
            productName: inquiry.productName,
            date: productDate,
            status: inquiry.status,
            specifications: specifications,
            inquiryType: "Recent Inquiry",
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

        // Convert to array and sort by latest date
        const transformedInquiries = Object.values(buyerGroups).sort(
          (a, b) => new Date(b.latestDate) - new Date(a.latestDate)
        );

        setInquiries(transformedInquiries);
      } else {
        setInquiries([]);
      }
    } catch (error) {
      console.error("Error fetching seller recent inquiries:", error);
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

  // Toggle inquiry dropdown
  const toggleInquiryDropdown = (buyerId) => {
    setExpandedInquiries((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(buyerId)) {
        newSet.delete(buyerId);
      } else {
        newSet.add(buyerId);
      }
      return newSet;
    });
  };

  // Check if inquiry is expanded
  const isInquiryExpanded = (buyerId) => {
    return expandedInquiries.has(buyerId);
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
          // Parse CSV file
          const csvText = event.target.result;
          const lines = csvText.split("\n").filter((line) => line.trim());
          const headers = lines[0]
            .split(",")
            .map((h) => h.trim().replace(/"/g, ""));

          // Parse all product rows
          const products = [];
          for (let i = 1; i < lines.length; i++) {
            const row = lines[i]
              .split(",")
              .map((cell) => cell.trim().replace(/"/g, ""));

            if (row[0]) {
              // Only process rows with product names
              // Extract specifications dynamically
              const specifications = [];
              for (let j = 3; j < row.length; j += 2) {
                if (row[j] && row[j + 1]) {
                  specifications.push({
                    title: row[j],
                    data: row[j + 1],
                  });
                }
              }

              // Find category ID by name
              const categoryName = row[2] || "";
              const selectedCategory = categories.find(
                (cat) => cat.categoryName === categoryName
              );
              const categoryId = selectedCategory ? selectedCategory._id : "";

              products.push({
                productName: row[0] || "",
                description: row[1] || "",
                category: categoryId,
                categoryName: categoryName,
                specifications: specifications,
                productImage: null,
                id: `excel-${i}`, // Unique ID for React key
              });
            }
          }

          setExcelProducts(products);
          // Don't close modal immediately - let user review the data
          // setIsExcelModalOpen(false);

          console.log("Excel data parsed:", products);

          // Show success message
          alert(
            `Successfully parsed ${products.length} products from Excel file!`
          );
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

  // Handle image upload for individual product in Excel data
  const handleProductImageUpload = (productId, e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setExcelProducts((prev) =>
          prev.map((product) =>
            product.id === productId
              ? {
                  ...product,
                  productImage: { file, preview: event.target.result },
                }
              : product
          )
        );
      };
      reader.readAsDataURL(file);
    }
  };

  // Remove image from product
  const removeProductImage = (productId) => {
    setExcelProducts((prev) =>
      prev.map((product) =>
        product.id === productId ? { ...product, productImage: null } : product
      )
    );
  };

  // Bulk upload all products
  const handleBulkUpload = async () => {
    if (excelProducts.length === 0) {
      alert("No products to upload!");
      return;
    }

    setIsBulkUploading(true);
    const results = [];

    for (const product of excelProducts) {
      try {
        // Validate required fields
        if (!product.productName || !product.category) {
          results.push({
            product: product.productName,
            status: "failed",
            error: "Missing required fields",
          });
          continue;
        }

        if (!product.productImage) {
          results.push({
            product: product.productName,
            status: "failed",
            error: "Image required",
          });
          continue;
        }

        // Create FormData for file upload
        const formData = new FormData();
        formData.append("productName", product.productName);
        formData.append("description", product.description || "");
        formData.append("category", product.category);

        // Transform specifications to match backend format
        const transformedSpecs = product.specifications.map((spec) => ({
          key: spec.title,
          value: spec.data,
        }));
        formData.append("specification", JSON.stringify(transformedSpecs));

        // Append image file
        formData.append("productImage", product.productImage.file);

        // Send to backend API
        const response = await fetch(
          "http://localhost:4000/api/v1/products/add-product",
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            body: formData,
          }
        );

        const data = await response.json();

        if (response.ok && data.success) {
          results.push({ product: product.productName, status: "success" });
        } else {
          results.push({
            product: product.productName,
            status: "failed",
            error: data.message || "Upload failed",
          });
        }
      } catch (error) {
        console.error("Error uploading product:", product.productName, error);
        results.push({
          product: product.productName,
          status: "failed",
          error: "Network error",
        });
      }
    }

    setIsBulkUploading(false);

    // Show results
    const successCount = results.filter((r) => r.status === "success").length;
    const failedCount = results.filter((r) => r.status === "failed").length;

    alert(
      `Bulk upload completed!\nSuccess: ${successCount}\nFailed: ${failedCount}`
    );

    // Clear Excel products
    setExcelProducts([]);
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
        categories.length > 0
          ? categories[0].categoryName
          : "API (Active Pharmaceutical Ingredient)",
        "Purity",
        "99.5%",
        "Molecular Weight",
        "180.16 g/mol",
      ],
      [
        "Ibuprofen API",
        "Pharmaceutical grade API",
        categories.length > 0
          ? categories[0].categoryName
          : "API (Active Pharmaceutical Ingredient)",
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

  const handleProductSubmit = async (e) => {
    e.preventDefault();

    try {
      // Validate required fields
      if (!productForm.productName || !productForm.category) {
        alert("Product name and category are required!");
        return;
      }

      if (!productForm.productImage) {
        alert("Product image is required!");
        return;
      }

      // Create FormData for file upload
      const formData = new FormData();
      formData.append("productName", productForm.productName);
      formData.append("description", productForm.description || "");
      formData.append("category", productForm.category);

      // Transform specifications to match backend format
      const transformedSpecs = productForm.specifications.map((spec) => ({
        key: spec.title,
        value: spec.data,
      }));
      formData.append("specification", JSON.stringify(transformedSpecs));

      // Append image file
      formData.append("productImage", productForm.productImage.file);

      console.log("Sending product data:", {
        productName: productForm.productName,
        description: productForm.description,
        category: productForm.category,
        specifications: transformedSpecs,
        imageFile: productForm.productImage.file.name,
      });

      // Send to backend API
      const response = await fetch(
        "http://localhost:4000/api/v1/products/add-product",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: formData,
        }
      );

      const data = await response.json();

      if (response.ok && data.success) {
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
      } else {
        alert(data.message || "Failed to add product. Please try again.");
      }
    } catch (error) {
      console.error("Error adding product:", error);
      alert(
        "Failed to add product. Please check your connection and try again."
      );
    }
  };

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
    setUserdata(newUserData);
  };

  // Profile Update Functions
  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");

      // Update basic profile info (name, country, nature of business, company info)
      const basicProfileData = {
        firstName: profileUpdateData.firstName,
        lastName: profileUpdateData.lastName,
        email: userdata.email, // Keep current email for basic update
        mobileNumber: userdata.mobileNumber, // Keep current mobile for basic update
        country: profileUpdateData.country,
        natureOfBusiness: profileUpdateData.natureOfBusiness,
        CompanyName: profileUpdateData.CompanyName,
        licenseNumber: profileUpdateData.licenseNumber,
        gstNumber: profileUpdateData.gstNumber,
        location: userdata.location, // Keep current location
      };

      const response = await fetch(
        "http://localhost:4000/api/v1/sellers/update-seller-profile",
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
            "http://localhost:4000/api/v1/sellers/update-seller-email",
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
            "http://localhost:4000/api/v1/sellers/update-seller-mobile",
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
          CompanyName: "",
          licenseNumber: "",
          gstNumber: "",
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
      alert("New passwords do not match!");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        "http://localhost:4000/api/v1/sellers/change-password-seller",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            currentPassword: passwordData.currentPassword,
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

    try {
      const response = await fetch(
        "http://localhost:4000/api/v1/sellers/forgot-password",
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
        "http://localhost:4000/api/v1/otp/seller/phone/update/initiate",
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
        "http://localhost:4000/api/v1/otp/seller/phone/update/verify",
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
        "http://localhost:4000/api/v1/otp/seller/email/update/initiate",
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
        "http://localhost:4000/api/v1/otp/seller/email/update/verify",
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
        CompanyName: userdata.CompanyName || "",
        licenseNumber: userdata.licenseNumber || "",
        gstNumber: userdata.gstNumber || "",
      });
    }
    setIsProfileUpdateModalOpen(true);
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
              <span className="sd-tag sd-tag--accent">Seller</span>
            </div>
          </div>

          {/* Compact Profile Info */}
          <div className="sd-profile-compact">
            <div className="sd-profile-row">
              <div className="sd-profile-item">
                <span className="sd-profile-label">Company:</span>
                <span className="sd-profile-value">
                  {userdata?.CompanyName || "Not provided"}
                </span>
              </div>
              <div className="sd-profile-item">
                <span className="sd-profile-label">Email:</span>
                <span className="sd-profile-value">
                  {userdata?.email || "Not provided"}
                </span>
              </div>
              <div className="sd-profile-item">
                <span className="sd-profile-label">Phone:</span>
                <span className="sd-profile-value">
                  {userdata?.mobileNumber || "Not provided"}
                </span>
              </div>
            </div>

            <div className="sd-profile-row">
              <div className="sd-profile-item">
                <span className="sd-profile-label">License:</span>
                <span className="sd-profile-value">
                  {userdata?.licenseNumber || "Not provided"}
                </span>
              </div>
              <div className="sd-profile-item">
                <span className="sd-profile-label">GST:</span>
                <span className="sd-profile-value">
                  {userdata?.gstNumber || "Not provided"}
                </span>
              </div>
              <div className="sd-profile-item">
                <span className="sd-profile-label">Status:</span>
                <span
                  className={`sd-profile-status sd-status-${
                    userdata?.status || "pending"
                  }`}
                >
                  {userdata?.status || "Pending"}
                </span>
              </div>
            </div>

            <div className="sd-profile-row">
              <div className="sd-profile-item sd-profile-item-full">
                <span className="sd-profile-label">Location:</span>
                <span className="sd-profile-value">
                  {userdata?.location?.formattedAddress ||
                    `${userdata?.location?.address || ""}, ${
                      userdata?.location?.city || ""
                    }, ${userdata?.location?.state || ""}, ${
                      userdata?.location?.country || ""
                    }` ||
                    "Not provided"}
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="sd-actions">
          <button
            className="sd-btn sd-btn--ghost sd-update-profile-btn"
            onClick={openProfileUpdateModal}
          >
            <span className="sd-btn-icon">✏️</span>
            Update Profile
          </button>
          {userdata?.status === "approved" ? (
            <>
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
            </>
          ) : (
            <div className="sd-pending-approval">
              <div className="sd-pending-icon">⏳</div>
              <div className="sd-pending-content">
                <h3 className="sd-pending-title">Account Pending Approval</h3>
                <p className="sd-pending-message">
                  Your seller account is currently under review. You'll be able
                  to add products and manage your inventory once your account is
                  approved.
                </p>
                <div className="sd-pending-status">
                  <span className="sd-status-badge sd-status-pending">
                    {userdata?.status || "Pending"}
                  </span>
                </div>
              </div>
            </div>
          )}
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
                <div
                  className="sd-inquiry-header sd-inquiry-header-clickable"
                  onClick={() => toggleInquiryDropdown(buyerGroup.buyerId)}
                >
                  <div className="sd-inquiry-buyer">
                    <div className="sd-inquiry-title-row">
                      <h4 className="sd-buyer-name">{buyerGroup.buyerName}</h4>
                      <div className="sd-inquiry-toggle">
                        <span className="sd-toggle-icon">
                          {isInquiryExpanded(buyerGroup.buyerId) ? "▼" : "▶"}
                        </span>
                      </div>
                    </div>
                    <p className="sd-buyer-info">
                      {buyerGroup.totalProducts} product
                      {buyerGroup.totalProducts !== 1 ? "s" : ""} • Latest:{" "}
                      {new Date(buyerGroup.latestDate).toLocaleDateString()}
                    </p>
                    <p className="sd-expand-hint">
                      {isInquiryExpanded(buyerGroup.buyerId)
                        ? "Click to collapse"
                        : "Click to expand products"}
                    </p>
                  </div>
                  <div className="sd-inquiry-actions">
                    <button
                      className="sd-btn sd-btn-secondary"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleBuyerClick(buyerGroup.buyerId);
                      }}
                      disabled={buyerLoading}
                    >
                      {buyerLoading ? "Loading..." : "View Buyer Details"}
                    </button>
                  </div>
                </div>

                {isInquiryExpanded(buyerGroup.buyerId) && (
                  <div className="sd-inquiry-dropdown">
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
                              <p>
                                {new Date(product.date).toLocaleDateString()}
                              </p>
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
                )}
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

      {/* Excel Products Display Section */}
      {excelProducts.length > 0 && (
        <div className="sd-excel-products-section">
          <div className="sd-excel-products-header">
            <h3 className="sd-excel-products-title">
              Excel Products Ready for Upload
            </h3>
            <div className="sd-excel-products-actions">
              <button
                className="sd-btn sd-btn--primary sd-bulk-upload-btn"
                onClick={handleBulkUpload}
                disabled={isBulkUploading}
              >
                {isBulkUploading ? "Uploading..." : "Bulk Upload All"}
              </button>
              <button
                className="sd-btn sd-btn--ghost"
                onClick={() => setExcelProducts([])}
              >
                Clear All
              </button>
            </div>
          </div>

          <div className="sd-excel-products-table">
            <table className="sd-excel-table">
              <thead>
                <tr>
                  <th>Product Name</th>
                  <th>Description</th>
                  <th>Category</th>
                  <th>Specifications</th>
                  <th>Image</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {excelProducts.map((product) => (
                  <tr key={product.id} className="sd-excel-product-row">
                    <td className="sd-excel-cell">
                      <strong>{product.productName}</strong>
                    </td>
                    <td className="sd-excel-cell">
                      {product.description || "No description"}
                    </td>
                    <td className="sd-excel-cell">{product.categoryName}</td>
                    <td className="sd-excel-cell">
                      <div className="sd-specs-list">
                        {product.specifications.map((spec, index) => (
                          <div key={index} className="sd-spec-item">
                            <span className="sd-spec-title">{spec.title}:</span>
                            <span className="sd-spec-value">{spec.data}</span>
                          </div>
                        ))}
                      </div>
                    </td>
                    <td className="sd-excel-cell">
                      <div className="sd-image-upload-cell">
                        {product.productImage ? (
                          <div className="sd-image-preview-cell">
                            <img
                              src={product.productImage.preview}
                              alt="Product preview"
                              className="sd-preview-image-cell"
                            />
                            <button
                              type="button"
                              className="sd-remove-image-btn-cell"
                              onClick={() => removeProductImage(product.id)}
                            >
                              ×
                            </button>
                          </div>
                        ) : (
                          <div className="sd-image-upload-area-cell">
                            <input
                              type="file"
                              id={`productImage-${product.id}`}
                              accept="image/*"
                              onChange={(e) =>
                                handleProductImageUpload(product.id, e)
                              }
                              className="sd-image-input-cell"
                            />
                            <label
                              htmlFor={`productImage-${product.id}`}
                              className="sd-image-upload-label-cell"
                            >
                              <div className="sd-upload-icon-cell">📷</div>
                              <span className="sd-upload-text-cell">
                                Add Image
                              </span>
                            </label>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="sd-excel-cell">
                      <button
                        className="sd-btn sd-btn--danger sd-remove-product-btn"
                        onClick={() =>
                          setExcelProducts((prev) =>
                            prev.filter((p) => p.id !== product.id)
                          )
                        }
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

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
                    disabled={categoriesLoading}
                  >
                    <option value="">
                      {categoriesLoading
                        ? "Loading categories..."
                        : "Select Category"}
                    </option>
                    {categories.map((category) => (
                      <option key={category._id} value={category._id}>
                        {category.categoryName}
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
                {excelProducts.length > 0 ? (
                  <div className="sd-excel-success-state">
                    <div className="sd-success-icon">✅</div>
                    <h5>Excel file processed successfully!</h5>
                    <p>
                      {excelProducts.length} products found and ready for
                      upload.
                    </p>
                    <button
                      className="sd-btn sd-btn--secondary"
                      onClick={() => {
                        const fileInput = document.getElementById("excelFile");
                        if (fileInput) fileInput.value = "";
                        setExcelProducts([]);
                      }}
                    >
                      Upload Different File
                    </button>
                  </div>
                ) : (
                  <div className="sd-excel-upload-area">
                    <input
                      type="file"
                      id="excelFile"
                      accept=".xlsx,.xls,.csv"
                      onChange={handleExcelUpload}
                      className="sd-excel-input"
                    />
                    <label
                      htmlFor="excelFile"
                      className="sd-excel-upload-label"
                    >
                      <div className="sd-upload-icon">📊</div>
                      <span className="sd-upload-text">
                        Click to upload Excel file
                      </span>
                      <span className="sd-upload-hint">
                        Excel (.xlsx, .xls) or CSV files
                      </span>
                    </label>
                  </div>
                )}
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
                {excelProducts.length > 0 && (
                  <button
                    className="sd-btn sd-btn--primary"
                    type="button"
                    onClick={() => setIsExcelModalOpen(false)}
                  >
                    View Products ({excelProducts.length})
                  </button>
                )}
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

      {/* Profile Update Modal */}
      {isProfileUpdateModalOpen && (
        <div className="sd-modal-overlay">
          <div className="sd-modal sd-profile-update-modal">
            <div className="sd-modal-header">
              <h3 className="sd-modal-title">Update Profile</h3>
              <button
                className="sd-modal-close"
                onClick={() => setIsProfileUpdateModalOpen(false)}
              >
                ×
              </button>
            </div>
            <form className="sd-form" onSubmit={handleProfileUpdate}>
              <div className="sd-row">
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
                      className="sd-btn sd-btn--ghost"
                      onClick={sendOTPForEmailUpdate}
                      style={{ whiteSpace: "nowrap" }}
                    >
                      Change Email
                    </button>
                  )}
                </div>
                {emailOtpData.isOtpSent && !emailOtpData.isOtpVerified && (
                  <div className="sd-otp-section">
                    <div className="sd-otp-input-group">
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
                        className="sd-btn sd-btn--primary"
                        onClick={verifyOTPForEmailUpdate}
                      >
                        Verify
                      </button>
                    </div>
                  </div>
                )}
                {emailOtpData.isOtpVerified && (
                  <p className="sd-otp-verified">
                    Email verified - You can now edit
                  </p>
                )}
              </label>
              <div className="sd-row">
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
                        className="sd-btn sd-btn--ghost"
                        onClick={sendOTPForMobileUpdate}
                        style={{ whiteSpace: "nowrap" }}
                      >
                        Change Mobile
                      </button>
                    )}
                  </div>
                  {otpData.isOtpSent && !otpData.isOtpVerified && (
                    <div className="sd-otp-section">
                      <div className="sd-otp-input-group">
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
                          className="sd-btn sd-btn--primary"
                          onClick={verifyOTPForMobileUpdate}
                        >
                          Verify
                        </button>
                      </div>
                    </div>
                  )}
                  {otpData.isOtpVerified && (
                    <p className="sd-otp-verified">
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
              <div className="sd-row">
                <label>
                  <span>Company Name</span>
                  <input
                    type="text"
                    value={profileUpdateData.CompanyName}
                    onChange={(e) =>
                      setProfileUpdateData((prev) => ({
                        ...prev,
                        CompanyName: e.target.value,
                      }))
                    }
                    required
                  />
                </label>
                <label>
                  <span>License Number</span>
                  <input
                    type="text"
                    value={profileUpdateData.licenseNumber}
                    onChange={(e) =>
                      setProfileUpdateData((prev) => ({
                        ...prev,
                        licenseNumber: e.target.value,
                      }))
                    }
                    required
                  />
                </label>
              </div>
              <label>
                <span>GST Number</span>
                <input
                  type="text"
                  value={profileUpdateData.gstNumber}
                  onChange={(e) =>
                    setProfileUpdateData((prev) => ({
                      ...prev,
                      gstNumber: e.target.value,
                    }))
                  }
                  required
                />
              </label>
              <div className="sd-password-options">
                <h4>Password Options</h4>
                <div className="sd-actions-inline">
                  <button
                    type="button"
                    className="sd-btn sd-btn--ghost"
                    onClick={() => {
                      setIsProfileUpdateModalOpen(false);
                      setIsPasswordChangeModalOpen(true);
                    }}
                  >
                    Change Password
                  </button>
                  <button
                    type="button"
                    className="sd-btn sd-btn--ghost"
                    onClick={() => {
                      setIsProfileUpdateModalOpen(false);
                      setIsForgotPasswordModalOpen(true);
                    }}
                  >
                    Forgot Password
                  </button>
                </div>
              </div>
              <div className="sd-actions-inline">
                <button className="sd-btn sd-btn--primary" type="submit">
                  Update Profile
                </button>
                <button
                  type="button"
                  className="sd-btn sd-btn--ghost"
                  onClick={() => setIsProfileUpdateModalOpen(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Password Change Modal */}
      {isPasswordChangeModalOpen && (
        <div className="sd-modal-overlay">
          <div className="sd-modal">
            <div className="sd-modal-header">
              <h3 className="sd-modal-title">Change Password</h3>
              <button
                className="sd-modal-close"
                onClick={() => setIsPasswordChangeModalOpen(false)}
              >
                ×
              </button>
            </div>
            <form className="sd-form" onSubmit={handlePasswordChange}>
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
                />
              </label>
              <div className="sd-actions-inline">
                <button className="sd-btn sd-btn--primary" type="submit">
                  Change Password
                </button>
                <button
                  type="button"
                  className="sd-btn sd-btn--ghost"
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
        <div className="sd-modal-overlay">
          <div className="sd-modal">
            <div className="sd-modal-header">
              <h3 className="sd-modal-title">Forgot Password</h3>
              <button
                className="sd-modal-close"
                onClick={() => setIsForgotPasswordModalOpen(false)}
              >
                ×
              </button>
            </div>
            <form className="sd-form" onSubmit={handleForgotPassword}>
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
              <div className="sd-actions-inline">
                <button className="sd-btn sd-btn--primary" type="submit">
                  Send Reset Email
                </button>
                <button
                  type="button"
                  className="sd-btn sd-btn--ghost"
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
