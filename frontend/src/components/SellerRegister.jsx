import React, { useState, useEffect } from "react";
import "../CSS/SellerRegister.css";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { API_BASE_URL, API_ENDPOINTS } from "../config/api";

export default function SellerRegister() {
  const navigate = useNavigate();
  const { isLogin } = useSelector((state) => state.user);

  // Check if user is already logged in
  useEffect(() => {
    const token = localStorage.getItem("token");
    const isLoggedIn = isLogin || token;

    if (isLoggedIn) {
      alert("You are already logged in!");
      navigate("/");
      return;
    }
  }, [isLogin, navigate]);

  const steps = [
    { 
      id: 1, 
      title: "Personal Info", 
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
      )
    },
    { 
      id: 2, 
      title: "Company Details", 
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <path d="M3 9h18" />
          <path d="M9 21V9" />
        </svg>
      )
    },
    { 
      id: 3, 
      title: "Address", 
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
          <circle cx="12" cy="10" r="3" />
        </svg>
      )
    },
  ];

  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    countryCode: "+1",
    mobileNumber: "",
    password: "",
    confirmPassword: "",
    CompanyName: "",
    natureOfBusiness: "",
    licenseNumber: "",
    gstNumber: "",
    address: "",
    city: "",
    state: "",
    country: "",
    pincode: "",
    formattedAddress: "",
    source: "manual",
  });

  // OTP states
  const [mobileVerified, setMobileVerified] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);
  const [showMobileOTP, setShowMobileOTP] = useState(false);
  const [showEmailOTP, setShowEmailOTP] = useState(false);
  const [mobileOtp, setMobileOtp] = useState("");
  const [emailOtp, setEmailOtp] = useState("");
  const [otpLoading, setOtpLoading] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const natureOfBusinesses = [
    "Pharmacy",
    "Hospital",
    "Agent",
    "Distributors",
    "Manufacturer",
    "Other",
  ];

  const countryCodes = [
    { code: "+1", country: "US/Canada", flag: "🇺🇸" },
    { code: "+91", country: "India", flag: "🇮🇳" },
    { code: "+44", country: "UK", flag: "🇬🇧" },
    { code: "+86", country: "China", flag: "🇨🇳" },
    { code: "+81", country: "Japan", flag: "🇯🇵" },
    { code: "+49", country: "Germany", flag: "🇩🇪" },
    { code: "+33", country: "France", flag: "🇫🇷" },
    { code: "+39", country: "Italy", flag: "🇮🇹" },
    { code: "+34", country: "Spain", flag: "🇪🇸" },
    { code: "+61", country: "Australia", flag: "🇦🇺" },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  // Send MOBILE OTP only - TEST SYSTEM (No API call)
  const sendMobileOTP = async () => {
    if (!formData.mobileNumber) {
      setError("Please enter mobile number first");
      return;
    }

    setOtpLoading(true);
    setError("");

    // Simulate API delay
    setTimeout(() => {
      alert("TEST MODE: Click 'Verify Phone' button to verify (no OTP needed)");
      setOtpLoading(false);
    }, 500);

    /* COMMENTED OUT - Real API call
    try {
      const fullMobileNumber = `${formData.countryCode}${formData.mobileNumber}`;
      const response = await fetch(`${API_ENDPOINTS.OTP.INITIATE}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mobileNumber: fullMobileNumber,
          userData: formData,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        alert("OTP sent to your mobile number!");
        setShowMobileOTP(true);
      } else {
        setError(data.message || "Failed to send OTP");
      }
    } catch (error) {
      setError("Network error. Please try again.");
    } finally {
      setOtpLoading(false);
    }
    */
  };

  // Verify MOBILE OTP - TEST SYSTEM (Auto verify)
  const verifyMobileOTP = async () => {
    setOtpLoading(true);
    setError("");

    // Simulate verification delay
    setTimeout(() => {
      alert("Mobile number verified successfully!");
      setMobileVerified(true);
      setShowMobileOTP(false);
      setMobileOtp("");
      setOtpLoading(false);
    }, 500);

    /* COMMENTED OUT - Real API call
    if (!mobileOtp) {
      setError("Please enter OTP");
      return;
    }

    try {
      const response = await fetch(`${API_ENDPOINTS.OTP.VERIFY}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mobileNumber: `${formData.countryCode}${formData.mobileNumber}`,
          otp: mobileOtp,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        alert("Mobile number verified successfully!");
        setMobileVerified(true);
        setShowMobileOTP(false);
        setMobileOtp("");
      } else {
        setError(data.message || "Invalid OTP");
      }
    } catch (error) {
      setError("Network error. Please try again.");
    } finally {
      setOtpLoading(false);
    }
    */
  };

  // Send EMAIL OTP only
  const sendEmailOTP = async () => {
    if (!formData.email) {
      setError("Please enter email address first");
      return;
    }

    setOtpLoading(true);
    setError("");

    try {
      const response = await fetch(
        `${API_ENDPOINTS.OTP.SELLER_EMAIL_INITIATE}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: formData.email,
            userData: {
              firstName: formData.firstName,
              lastName: formData.lastName,
              mobileNumber: formData.mobileNumber,
            },
          }),
        }
      );

      const data = await response.json();
      if (response.ok) {
        alert("Verification email sent!");
        setShowEmailOTP(true);
      } else {
        setError(data.message || "Failed to send verification email");
      }
    } catch (error) {
      setError("Network error. Please try again.");
    } finally {
      setOtpLoading(false);
    }
  };

  // Verify EMAIL OTP
  const verifyEmailOTP = async () => {
    if (!emailOtp) {
      setError("Please enter OTP");
      return;
    }

    setOtpLoading(true);
    setError("");

    try {
      const response = await fetch(
        `${API_ENDPOINTS.OTP.SELLER_EMAIL_VERIFY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: formData.email,
            otp: emailOtp,
          }),
        }
      );

      const data = await response.json();
      if (response.ok) {
        alert("Email verified successfully!");
        setEmailVerified(true);
        setShowEmailOTP(false);
        setEmailOtp("");
      } else {
        setError(data.message || "Invalid OTP");
      }
    } catch (error) {
      setError("Network error. Please try again.");
    } finally {
      setOtpLoading(false);
    }
  };

  const validateStep = () => {
    if (currentStep === 1) {
      if (
        !formData.firstName ||
        !formData.lastName ||
        !formData.email ||
        !formData.mobileNumber ||
        !formData.password ||
        !formData.confirmPassword
      ) {
        return "All fields are required";
      }
      if (formData.password !== formData.confirmPassword) {
        return "Passwords do not match";
      }
      if (formData.password.length < 6) {
        return "Password must be at least 6 characters";
      }
      // TEMPORARILY COMMENTED - Mobile verification check (for testing)
      // if (!mobileVerified) {
      //   return "Please verify your mobile number";
      // }
      if (!emailVerified) {
        return "Please verify your email address";
      }
    }
    if (currentStep === 2) {
      if (
        !formData.CompanyName ||
        !formData.natureOfBusiness ||
        !formData.licenseNumber ||
        !formData.gstNumber
      ) {
        return "All company fields are required";
      }
    }
    if (currentStep === 3) {
      if (
        !formData.address ||
        !formData.city ||
        !formData.state ||
        !formData.country ||
        !formData.pincode
      ) {
        return "All address fields are required";
      }
    }
    return "";
  };

  const handleNext = () => {
    const validationError = validateStep();
    if (validationError) {
      setError(validationError);
      return;
    }
    setError("");
    if (currentStep < 3) {
      setCurrentStep((prev) => prev + 1);
    } else {
      handleSubmit();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
      setError("");
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError("");

    try {
      const dataToSend = { ...formData };
      delete dataToSend.confirmPassword;

      dataToSend.location = {
        address: formData.address || "",
        city: formData.city || "",
        state: formData.state || "",
        country: formData.country || "",
        pincode: formData.pincode || "",
        formattedAddress: formData.formattedAddress || formData.address || "",
        coordinates: formData.coordinates || { lat: null, lng: null },
        source: formData.source || "manual",
      };

      delete dataToSend.city;
      delete dataToSend.state;
      delete dataToSend.pincode;
      delete dataToSend.address;
      delete dataToSend.formattedAddress;

      const response = await fetch(
        `${API_ENDPOINTS.SELLERS.REGISTER}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(dataToSend),
        }
      );

      if (response.ok) {
        alert("Seller Registration Successful!");
        navigate("/");
      } else {
        const errorData = await response.json();
        setError(errorData.message || "Registration failed. Try again.");
      }
    } catch (err) {
      setError("Network error. Please check your connection.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGetLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords;

        try {
          const response = await fetch(
            `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=AIzaSyBHyo1FsE8xNyZEdYaklOo_QYl5-erpOXM`
          );

          const data = await response.json();

          if (data.status === "OK") {
            const result = data.results[0];
            const addressComponents = result.address_components;

            const getComponent = (type) =>
              addressComponents.find((c) => c.types.includes(type))?.long_name || "";

            setFormData((prev) => ({
              ...prev,
              formattedAddress: result.formatted_address,
              address: `${getComponent("street_number")} ${getComponent("route")}`.trim(),
              city: getComponent("locality"),
              state: getComponent("administrative_area_level_1"),
              country: getComponent("country"),
              pincode: getComponent("postal_code"),
              coordinates: { lat: latitude, lng: longitude },
              source: "google",
            }));
          } else {
            alert("Unable to fetch address from Google Maps");
          }
        } catch (error) {
          console.error("Error fetching location:", error);
        }
      });
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="seller-form-grid">
            <div className="seller-form-column">
              <div className="seller-form-group">
                <label>First Name*</label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="Enter your first name"
                />
              </div>

              <div className="seller-form-group">
                <label>Last Name*</label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Enter your last name"
                />
              </div>

              <div className="seller-form-group">
                <label>Email Address*</label>
                <div className="seller-input-with-verify">
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="your.email@example.com"
                    disabled={emailVerified}
                    className={emailVerified ? "verified-input" : ""}
                  />
                  <button
                    type="button"
                    onClick={sendEmailOTP}
                    disabled={otpLoading || !formData.email || emailVerified}
                    className={`seller-verify-btn ${emailVerified ? "verified" : ""}`}
                  >
                    {emailVerified ? "✓ Verified" : "Verify Email"}
                  </button>
                </div>
                {emailVerified && (
                  <span className="seller-verified-badge">Email verified successfully</span>
                )}
                {showEmailOTP && !emailVerified && (
                  <div className="seller-otp-box">
                    <input
                      type="text"
                      placeholder="Enter 6-digit OTP"
                      value={emailOtp}
                      onChange={(e) => setEmailOtp(e.target.value)}
                      maxLength="6"
                      className="seller-otp-input"
                    />
                    <button
                      type="button"
                      onClick={verifyEmailOTP}
                      disabled={otpLoading || !emailOtp}
                      className="seller-verify-otp-btn"
                    >
                      {otpLoading ? "Verifying..." : "Verify OTP"}
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="seller-form-column">
              <div className="seller-form-group">
                <label>Mobile Number* (Test Mode)</label>
                <div className="seller-mobile-container">
                  <select
                    name="countryCode"
                    value={formData.countryCode}
                    onChange={handleChange}
                    className="seller-country-code"
                    disabled={mobileVerified}
                  >
                    {countryCodes.map((country, index) => (
                      <option key={index} value={country.code}>
                        {country.flag} {country.code}
                      </option>
                    ))}
                  </select>
                  <input
                    type="tel"
                    name="mobileNumber"
                    value={formData.mobileNumber}
                    onChange={handleChange}
                    placeholder="Enter mobile number"
                    disabled={mobileVerified}
                    className={mobileVerified ? "verified-input" : ""}
                  />
                  <button
                    type="button"
                    onClick={verifyMobileOTP}
                    disabled={otpLoading || !formData.mobileNumber || mobileVerified}
                    className={`seller-verify-btn ${mobileVerified ? "verified" : ""}`}
                  >
                    {otpLoading ? "Verifying..." : mobileVerified ? "✓ Verified" : "Verify Phone"}
                  </button>
                </div>
                {mobileVerified && (
                  <span className="seller-verified-badge">Phone verified successfully</span>
                )}
                {!mobileVerified && (
                  <small className="seller-hint">Test mode: Just click verify button</small>
                )}
              </div>

              <div className="seller-form-group">
                <label>Password*</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Create a strong password"
                />
                <small className="seller-hint">Min 6 characters</small>
              </div>

              <div className="seller-form-group">
                <label>Confirm Password*</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Re-enter your password"
                />
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="seller-form-grid">
            <div className="seller-form-column">
              <div className="seller-form-group">
                <label>Company Name*</label>
                <input
                  type="text"
                  name="CompanyName"
                  value={formData.CompanyName}
                  onChange={handleChange}
                  placeholder="Enter company name"
                />
              </div>

              <div className="seller-form-group">
                <label>Nature of Business*</label>
                <select
                  name="natureOfBusiness"
                  value={formData.natureOfBusiness}
                  onChange={handleChange}
                >
                  <option value="">Select business type</option>
                  {natureOfBusinesses.map((business, index) => (
                    <option key={index} value={business}>
                      {business}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="seller-form-column">
              <div className="seller-form-group">
                <label>License Number*</label>
                <input
                  type="text"
                  name="licenseNumber"
                  value={formData.licenseNumber}
                  onChange={handleChange}
                  placeholder="Enter license number"
                />
              </div>

              <div className="seller-form-group">
                <label>GST Number*</label>
                <input
                  type="text"
                  name="gstNumber"
                  value={formData.gstNumber}
                  onChange={handleChange}
                  placeholder="Enter GST number"
                />
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="seller-form-grid">
            <div className="seller-form-column">
              <div className="seller-form-group">
                <label>Address*</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Street address"
                  readOnly={formData.source === "google"}
                />
              </div>

              <div className="seller-form-group">
                <label>City*</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="City"
                  readOnly={formData.source === "google"}
                />
              </div>

              <div className="seller-form-group">
                <label>State*</label>
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  placeholder="State"
                  readOnly={formData.source === "google"}
                />
              </div>
            </div>

            <div className="seller-form-column">
              <div className="seller-form-group">
                <label>Country*</label>
                <input
                  type="text"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  placeholder="Country"
                  readOnly={formData.source === "google"}
                />
              </div>

              <div className="seller-form-group">
                <label>Pincode*</label>
                <input
                  type="text"
                  name="pincode"
                  value={formData.pincode}
                  onChange={handleChange}
                  placeholder="Pincode"
                  readOnly={formData.source === "google"}
                />
              </div>

              <button
                type="button"
                onClick={handleGetLocation}
                className="seller-location-btn"
              >
                📍 Use My Current Location
              </button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="seller-register-wrapper">
      <div className="seller-register-container">
        <div className="seller-register-header">
          <h1>Create <span className="seller-highlight">Seller</span> Account</h1>
          <p>Join Saathsource and connect with verified buyers worldwide</p>
        </div>

        {/* Step Progress */}
        <div className="seller-steps-progress">
          {steps.map((step) => (
            <div
              key={step.id}
              className={`seller-step-item ${
                currentStep >= step.id ? "active" : ""
              } ${currentStep === step.id ? "current" : ""}`}
            >
              <div className="seller-step-circle">
                <div className="seller-step-icon">{step.icon}</div>
              </div>
              <span className="seller-step-title">{step.title}</span>
            </div>
          ))}
        </div>

        <form className="seller-register-form">
          {renderStepContent()}

          {error && <div className="seller-error-message">{error}</div>}

          <div className="seller-form-actions">
            {currentStep > 1 && (
              <button
                type="button"
                onClick={handlePrevious}
                className="seller-back-btn"
              >
                ← Back
              </button>
            )}
            <button
              type="button"
              onClick={handleNext}
              disabled={isSubmitting}
              className="seller-next-btn"
            >
              {isSubmitting
                ? "Creating Account..."
                : currentStep === 3
                ? "Create Account"
                : "Next →"}
            </button>
          </div>
        </form>

        <p className="seller-login-link">
          Already have an account? <a href="/login">Sign in</a>
        </p>
      </div>
    </div>
  );
}

