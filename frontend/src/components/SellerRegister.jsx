import React, { useState, useEffect } from "react";
import "../CSS/SellerRegister.css";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import sellerImage from "../assets/seller-image.png";

export default function SellerRegister() {
  const navigate = useNavigate();
  const { isLogin } = useSelector((state) => state.user);
  const imogis = ["👤", "🏢", "📍"];

  // Check if user is already logged in
  useEffect(() => {
    const token = localStorage.getItem("token");
    const isLoggedIn = isLogin || token;

    if (isLoggedIn) {
      alert("You are already logged in!");
      navigate("/"); // Redirect to home page
      return;
    }
  }, [isLogin, navigate]);

  const steps = ["Basic Info", "Company Info", "Address"];
  const [currentStep, setCurrentStep] = useState(0);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    countryCode: "+1", // Default to US
    mobileNumber: "",
    password: "",
    confirmPassword: "",
    country: "",
    natureOfBusiness: "",
    CompanyName: "",
    licenseNumber: "",
    gstNumber: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    formattedAddress: "",
    source: "manual",
  });

  // OTP verification states
  const [mobileVerified, setMobileVerified] = useState(false);
  const [showMobileOTP, setShowMobileOTP] = useState(false);
  const [mobileOtp, setMobileOtp] = useState("");
  const [emailVerified, setEmailVerified] = useState(false);
  const [showEmailOTP, setShowEmailOTP] = useState(false);
  const [emailOtp, setEmailOtp] = useState("");
  const [otpLoading, setOtpLoading] = useState(false);
  const [otpError, setOtpError] = useState("");
  const [otpSuccess, setOtpSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const natureOfBusinesses = [
    "Pharmacy",
    "Hospital",
    "Agent",
    "Distributors",
    "Manufacturer",
    "Other",
  ];

  // Country codes for mobile numbers
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
    { code: "+55", country: "Brazil", flag: "🇧🇷" },
    { code: "+7", country: "Russia", flag: "🇷🇺" },
    { code: "+82", country: "South Korea", flag: "🇰🇷" },
    { code: "+65", country: "Singapore", flag: "🇸🇬" },
    { code: "+971", country: "UAE", flag: "🇦🇪" },
    { code: "+966", country: "Saudi Arabia", flag: "🇸🇦" },
    { code: "+20", country: "Egypt", flag: "🇪🇬" },
    { code: "+27", country: "South Africa", flag: "🇿🇦" },
    { code: "+52", country: "Mexico", flag: "🇲🇽" },
    { code: "+54", country: "Argentina", flag: "🇦🇷" },
  ];

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear OTP error when user types
    if (otpError) setOtpError("");
  };

  // Send mobile OTP
  const sendMobileOTP = async () => {
    if (!formData.mobileNumber) {
      setOtpError("Please enter mobile number first");
      return;
    }

    setOtpLoading(true);
    setOtpError("");
    setOtpSuccess("");

    try {
      const fullMobileNumber = `${formData.countryCode}${formData.mobileNumber}`;
      const response = await fetch(
        "http://localhost:4000/api/v1/otp/initiate",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            mobileNumber: fullMobileNumber,
            userData: formData,
          }),
        }
      );

      const data = await response.json();
      console.log("Send OTP Response:", { status: response.status, data });

      if (response.ok) {
        setOtpSuccess("OTP sent successfully to your mobile number");
        setShowMobileOTP(true);
      } else {
        // Display the actual error message from backend
        setOtpError(data.message || data.error || "Failed to send OTP");
      }
    } catch (error) {
      console.error("Send OTP error:", error);
      setOtpError("Network error. Please check your connection and try again.");
    } finally {
      setOtpLoading(false);
    }
  };

  // Verify mobile OTP
  const verifyMobileOTP = async () => {
    if (!mobileOtp) {
      setOtpError("Please enter OTP");
      return;
    }

    setOtpLoading(true);
    setOtpError("");

    try {
      const response = await fetch("http://localhost:4000/api/v1/otp/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          mobileNumber: `${formData.countryCode}${formData.mobileNumber}`,
          otp: mobileOtp,
        }),
      });

      const data = await response.json();
      console.log("OTP Verification Response:", {
        status: response.status,
        data,
      });

      if (response.ok) {
        setOtpSuccess("Mobile number verified successfully!");
        setMobileVerified(true);
        setShowMobileOTP(false);
        // Don't auto-proceed - let user continue manually
      } else {
        // Display the actual error message from backend
        setOtpError(data.message || data.error || "Verification failed");
      }
    } catch (error) {
      console.error("OTP verification error:", error);
      setOtpError("Network error. Please check your connection and try again.");
    } finally {
      setOtpLoading(false);
    }
  };

  // Resend mobile OTP
  const resendMobileOTP = async () => {
    setOtpLoading(true);
    setOtpError("");
    setOtpSuccess("");

    try {
      const response = await fetch("http://localhost:4000/api/v1/otp/resend", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          mobileNumber: `${formData.countryCode}${formData.mobileNumber}`,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setOtpSuccess("OTP resent successfully");
      } else {
        // Display the actual error message from backend
        setOtpError(data.message || data.error || "Failed to resend OTP");
      }
    } catch (error) {
      console.error("Resend OTP error:", error);
      setOtpError("Network error. Please check your connection and try again.");
    } finally {
      setOtpLoading(false);
    }
  };

  // Email OTP functions
  const sendEmailOTP = async () => {
    if (!formData.email) {
      setOtpError("Please enter email address first");
      return;
    }

    setOtpLoading(true);
    setOtpError("");
    setOtpSuccess("");

    try {
      const response = await fetch(
        "http://localhost:4000/api/v1/otp/buyer/email/initiate",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
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
        setOtpSuccess("Verification email sent to your email address!");
        setShowEmailOTP(true);
      } else {
        setOtpError(
          data.message || data.error || "Failed to send verification email"
        );
      }
    } catch (error) {
      console.error("Send email OTP error:", error);
      setOtpError("Network error. Please check your connection and try again.");
    } finally {
      setOtpLoading(false);
    }
  };

  const verifyEmailOTP = async () => {
    if (!emailOtp) {
      setOtpError("Please enter OTP");
      return;
    }

    setOtpLoading(true);
    setOtpError("");
    setOtpSuccess("");

    try {
      const response = await fetch(
        "http://localhost:4000/api/v1/otp/buyer/email/verify",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: formData.email,
            otp: emailOtp,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setOtpSuccess("Email verified successfully!");
        setEmailVerified(true);
        setShowEmailOTP(false);
        setEmailOtp("");
      } else {
        setOtpError(data.message || data.error || "Invalid OTP");
      }
    } catch (error) {
      console.error("Verify email OTP error:", error);
      setOtpError("Network error. Please check your connection and try again.");
    } finally {
      setOtpLoading(false);
    }
  };

  const resendEmailOTP = async () => {
    setOtpLoading(true);
    setOtpError("");
    setOtpSuccess("");

    try {
      const response = await fetch(
        "http://localhost:4000/api/v1/otp/buyer/email/resend",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: formData.email,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setOtpSuccess("Verification email resent successfully!");
      } else {
        setOtpError(
          data.message || data.error || "Failed to resend verification email"
        );
      }
    } catch (error) {
      console.error("Resend email OTP error:", error);
      setOtpError("Network error. Please check your connection and try again.");
    } finally {
      setOtpLoading(false);
    }
  };

  // Validate step before moving next
  const validateStep = () => {
    if (currentStep === 0) {
      if (
        !formData.firstName ||
        !formData.lastName ||
        !formData.email ||
        !formData.mobileNumber ||
        !formData.password ||
        !formData.confirmPassword
      ) {
        return "All fields are required in Basic Info";
      }
      if (formData.password !== formData.confirmPassword) {
        return "Passwords do not match";
      }
      if (!mobileVerified) {
        return "Please verify your mobile number with OTP";
      }
      if (!emailVerified) {
        return "Please verify your email address with OTP";
      }
    }
    if (currentStep === 1) {
      if (
        !formData.CompanyName ||
        !formData.natureOfBusiness ||
        !formData.licenseNumber ||
        !formData.gstNumber
      ) {
        return "All fields are required in Company Info";
      }
    }
    if (currentStep === 2) {
      if (
        !formData.address ||
        !formData.city ||
        !formData.state ||
        !formData.pincode ||
        !formData.country
      ) {
        return "All fields are required in Address";
      }
    }
    return "";
  };

  const [error, setError] = useState("");

  const handleNext = () => {
    const validationError = validateStep();
    if (validationError) {
      setError(validationError);
      return;
    }
    setError("");
    if (currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      handleSubmit();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
      setError(""); // Clear any errors when going back
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError(""); // Clear any previous errors
    try {
      const dataToSend = { ...formData };
      delete dataToSend.confirmPassword;

      // Ensure location is always in correct format
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

      // 🔥 Remove accidental root city/state/pincode
      delete dataToSend.city;
      delete dataToSend.state;
      delete dataToSend.pincode;
      delete dataToSend.address;
      delete dataToSend.formattedAddress;

      console.log("Sending data:", JSON.stringify(dataToSend, null, 2));

      const response = await fetch(
        "http://localhost:4000/api/v1/sellers/register-seller",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(dataToSend),
        }
      );

      console.log("Registration Response:", {
        status: response.status,
        statusText: response.statusText,
      });

      if (response.ok) {
        alert("Seller Registration Successful!");
        navigate("/");
      } else {
        try {
          const errorData = await response.json();
          console.log("Error Data:", errorData);
          const errorMessage =
            errorData.message || errorData.error || errorData.success === false
              ? errorData.message
              : "Registration failed. Try again.";
          setError(errorMessage); // Display error in the form instead of alert
        } catch (parseError) {
          console.error("Error parsing response:", parseError);
          setError(
            `Registration failed with status ${response.status}. Please try again.`
          );
        }
      }
    } catch (err) {
      console.error(err);
      setError("Network error. Please check your connection and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGetLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords;

        try {
          // Call Google Maps API
          const response = await fetch(
            `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=AIzaSyBHyo1FsE8xNyZEdYaklOo_QYl5-erpOXM`
          );

          const data = await response.json();

          if (data.status === "OK") {
            const result = data.results[0];
            const addressComponents = result.address_components;

            // Helper function
            const getComponent = (type) =>
              addressComponents.find((c) => c.types.includes(type))
                ?.long_name || "";

            setFormData((prev) => ({
              ...prev,
              formattedAddress: result.formatted_address,
              address: `${getComponent("street_number")} ${getComponent(
                "route"
              )}`.trim(),
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

  // Form step UI
  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <>
            <label>
              First Name*{" "}
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
              />
            </label>
            <label>
              Last Name*{" "}
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
              />
            </label>
            <label>
              Email*{" "}
              <div className="input-with-button">
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={emailVerified}
                  style={{
                    backgroundColor: emailVerified ? "#f8f9fa" : "white",
                    cursor: emailVerified ? "not-allowed" : "text",
                    opacity: emailVerified ? 0.7 : 1,
                  }}
                />
                <button
                  type="button"
                  onClick={sendEmailOTP}
                  disabled={otpLoading || !formData.email || emailVerified}
                  style={{
                    padding: "5px 10px",
                    backgroundColor: emailVerified ? "#28a745" : "#007bff",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    cursor: emailVerified ? "default" : "pointer",
                    fontSize: "12px",
                    opacity: otpLoading ? 0.7 : 1,
                  }}
                >
                  {emailVerified
                    ? "✓ Verified"
                    : otpLoading
                    ? "Sending..."
                    : "Send OTP"}
                </button>
              </div>
              {emailVerified && (
                <small
                  style={{
                    color: "#6c757d",
                    fontSize: "12px",
                    marginTop: "5px",
                    display: "block",
                  }}
                >
                  Email is verified and cannot be changed
                </small>
              )}
            </label>
            <label>
              Mobile Number*{" "}
              <div className="mobile-input-container">
                <div className="country-code-selector">
                  <select
                    name="countryCode"
                    value={formData.countryCode}
                    onChange={handleChange}
                    className="country-code-select"
                    disabled={mobileVerified}
                    style={{
                      backgroundColor: mobileVerified ? "#f8f9fa" : "white",
                      cursor: mobileVerified ? "not-allowed" : "pointer",
                      opacity: mobileVerified ? 0.7 : 1,
                    }}
                  >
                    {countryCodes.map((country, index) => (
                      <option key={index} value={country.code}>
                        {country.flag} {country.code}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="mobile-number-input">
                  <input
                    type="tel"
                    name="mobileNumber"
                    value={formData.mobileNumber}
                    onChange={handleChange}
                    placeholder="Enter mobile number"
                    disabled={mobileVerified}
                    style={{
                      backgroundColor: mobileVerified ? "#f8f9fa" : "white",
                      cursor: mobileVerified ? "not-allowed" : "text",
                      opacity: mobileVerified ? 0.7 : 1,
                    }}
                  />
                </div>
              </div>
              {mobileVerified && (
                <span style={{ color: "green", fontSize: "12px" }}>
                  ✓ Verified
                </span>
              )}
              {mobileVerified && (
                <small
                  style={{
                    color: "#6c757d",
                    fontSize: "12px",
                    marginTop: "5px",
                    display: "block",
                  }}
                >
                  Mobile number is verified and cannot be changed
                </small>
              )}
            </label>

            {/* Mobile OTP Section */}
            {!mobileVerified && (
              <div
                style={{
                  margin: "10px 0",
                  padding: "10px",
                  border: "1px solid #ddd",
                  borderRadius: "5px",
                }}
              >
                <p style={{ fontSize: "14px", marginBottom: "10px" }}>
                  Verify your mobile number to continue
                </p>

                {!showMobileOTP ? (
                  <button
                    type="button"
                    onClick={sendMobileOTP}
                    disabled={otpLoading || !formData.mobileNumber}
                    style={{
                      padding: "5px 10px",
                      backgroundColor: "#007bff",
                      color: "white",
                      border: "none",
                      borderRadius: "3px",
                      cursor:
                        otpLoading || !formData.mobileNumber
                          ? "not-allowed"
                          : "pointer",
                      opacity: otpLoading || !formData.mobileNumber ? 0.6 : 1,
                    }}
                  >
                    {otpLoading ? "Sending..." : "Send OTP"}
                  </button>
                ) : (
                  <div>
                    <input
                      type="text"
                      placeholder="Enter 6-digit OTP"
                      value={mobileOtp}
                      onChange={(e) => setMobileOtp(e.target.value)}
                      maxLength="6"
                      style={{
                        padding: "8px",
                        marginRight: "10px",
                        border: "1px solid #ccc",
                        borderRadius: "3px",
                        width: "150px",
                      }}
                    />
                    <button
                      type="button"
                      onClick={verifyMobileOTP}
                      disabled={otpLoading || !mobileOtp}
                      style={{
                        padding: "8px 15px",
                        backgroundColor: "#28a745",
                        color: "white",
                        border: "none",
                        borderRadius: "3px",
                        cursor:
                          otpLoading || !mobileOtp ? "not-allowed" : "pointer",
                        opacity: otpLoading || !mobileOtp ? 0.6 : 1,
                        marginRight: "10px",
                      }}
                    >
                      {otpLoading ? "Verifying..." : "Verify"}
                    </button>
                    <button
                      type="button"
                      onClick={resendMobileOTP}
                      disabled={otpLoading}
                      style={{
                        padding: "8px 15px",
                        backgroundColor: "#6c757d",
                        color: "white",
                        border: "none",
                        borderRadius: "3px",
                        cursor: otpLoading ? "not-allowed" : "pointer",
                        opacity: otpLoading ? 0.6 : 1,
                      }}
                    >
                      Resend
                    </button>
                  </div>
                )}

                {/* OTP Status Messages */}
                {otpError && (
                  <div
                    style={{
                      color: "red",
                      fontSize: "12px",
                      marginTop: "5px",
                      padding: "8px",
                      backgroundColor: "#ffe6e6",
                      border: "1px solid #ffcccc",
                      borderRadius: "4px",
                      fontWeight: "500",
                    }}
                  >
                    ⚠️ {otpError}
                  </div>
                )}
                {otpSuccess && (
                  <div
                    style={{
                      color: "green",
                      fontSize: "12px",
                      marginTop: "5px",
                      padding: "8px",
                      backgroundColor: "#e6ffe6",
                      border: "1px solid #ccffcc",
                      borderRadius: "4px",
                      fontWeight: "500",
                    }}
                  >
                    ✅ {otpSuccess}
                  </div>
                )}
              </div>
            )}

            {/* Show success message after OTP verification */}
            {mobileVerified && (
              <div
                style={{
                  margin: "10px 0",
                  padding: "10px",
                  backgroundColor: "#e6ffe6",
                  border: "1px solid #ccffcc",
                  borderRadius: "5px",
                  color: "green",
                  fontSize: "14px",
                  fontWeight: "500",
                }}
              >
                ✅ Mobile number verified! You can now proceed to the next step.
              </div>
            )}

            {/* Email OTP Verification Section */}
            {!emailVerified && (
              <div
                style={{
                  margin: "10px 0",
                  padding: "15px",
                  backgroundColor: "#f8f9fa",
                  border: "1px solid #ddd",
                  borderRadius: "5px",
                }}
              >
                <p style={{ fontSize: "14px", marginBottom: "10px" }}>
                  Verify your email address to continue
                </p>

                {!showEmailOTP ? (
                  <button
                    type="button"
                    onClick={sendEmailOTP}
                    disabled={otpLoading || !formData.email}
                    style={{
                      padding: "5px 10px",
                      backgroundColor: "#007bff",
                      color: "white",
                      border: "none",
                      borderRadius: "3px",
                      cursor:
                        otpLoading || !formData.email
                          ? "not-allowed"
                          : "pointer",
                      opacity: otpLoading || !formData.email ? 0.6 : 1,
                    }}
                  >
                    {otpLoading ? "Sending..." : "Send Email OTP"}
                  </button>
                ) : (
                  <div>
                    <input
                      type="text"
                      placeholder="Enter 6-digit OTP"
                      value={emailOtp}
                      onChange={(e) => setEmailOtp(e.target.value)}
                      maxLength="6"
                      style={{
                        padding: "8px",
                        marginRight: "10px",
                        border: "1px solid #ccc",
                        borderRadius: "3px",
                        width: "150px",
                      }}
                    />
                    <button
                      type="button"
                      onClick={verifyEmailOTP}
                      disabled={otpLoading || !emailOtp}
                      style={{
                        padding: "8px 15px",
                        backgroundColor: "#28a745",
                        color: "white",
                        border: "none",
                        borderRadius: "3px",
                        cursor:
                          otpLoading || !emailOtp ? "not-allowed" : "pointer",
                        opacity: otpLoading || !emailOtp ? 0.6 : 1,
                      }}
                    >
                      {otpLoading ? "Verifying..." : "Verify"}
                    </button>
                    <button
                      type="button"
                      onClick={resendEmailOTP}
                      disabled={otpLoading}
                      style={{
                        padding: "8px 15px",
                        backgroundColor: "#6c757d",
                        color: "white",
                        border: "none",
                        borderRadius: "3px",
                        cursor: otpLoading ? "not-allowed" : "pointer",
                        opacity: otpLoading ? 0.6 : 1,
                      }}
                    >
                      Resend
                    </button>
                  </div>
                )}

                {/* OTP Status Messages */}
                {otpError && (
                  <div
                    style={{
                      color: "red",
                      fontSize: "12px",
                      marginTop: "5px",
                      padding: "8px",
                      backgroundColor: "#ffe6e6",
                      border: "1px solid #ffcccc",
                      borderRadius: "4px",
                      fontWeight: "500",
                    }}
                  >
                    ⚠️ {otpError}
                  </div>
                )}
                {otpSuccess && (
                  <div
                    style={{
                      color: "green",
                      fontSize: "12px",
                      marginTop: "5px",
                      padding: "8px",
                      backgroundColor: "#e6ffe6",
                      border: "1px solid #ccffcc",
                      borderRadius: "4px",
                      fontWeight: "500",
                    }}
                  >
                    ✅ {otpSuccess}
                  </div>
                )}
              </div>
            )}

            {/* Show success message after email OTP verification */}
            {emailVerified && (
              <div
                style={{
                  margin: "10px 0",
                  padding: "10px",
                  backgroundColor: "#e6ffe6",
                  border: "1px solid #ccffcc",
                  borderRadius: "5px",
                  color: "green",
                  fontSize: "14px",
                  fontWeight: "500",
                }}
              >
                ✅ Email address verified successfully!
              </div>
            )}

            <label>
              Password*{" "}
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
              />
            </label>
            <label>
              Confirm Password*{" "}
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
              />
            </label>
          </>
        );
      case 1:
        return (
          <>
            <label>
              Company Name*{" "}
              <input
                type="text"
                name="CompanyName"
                value={formData.CompanyName}
                onChange={handleChange}
              />
            </label>
            <label>
              Nature of Business*
              <select
                name="natureOfBusiness"
                value={formData.natureOfBusiness}
                onChange={handleChange}
              >
                <option value="">Select...</option>
                {natureOfBusinesses.map((b, i) => (
                  <option key={i} value={b}>
                    {b}
                  </option>
                ))}
              </select>
            </label>
            <label>
              License Number*{" "}
              <input
                type="text"
                name="licenseNumber"
                value={formData.licenseNumber}
                onChange={handleChange}
              />
            </label>
            <label>
              GST Number*{" "}
              <input
                type="text"
                name="gstNumber"
                value={formData.gstNumber}
                onChange={handleChange}
              />
            </label>
          </>
        );
      case 2:
        return (
          <>
            <label>
              Address*
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                readOnly={formData.source === "google"}
              />
            </label>

            <label>
              City*
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                readOnly={formData.source === "google"}
              />
            </label>

            <label>
              State*
              <input
                type="text"
                name="state"
                value={formData.state}
                onChange={handleChange}
                readOnly={formData.source === "google"}
              />
            </label>

            <label>
              Country*
              <input
                type="text"
                name="country"
                value={formData.country}
                onChange={handleChange}
                readOnly={formData.source === "google"}
              />
            </label>

            <label>
              Pincode*
              <input
                type="text"
                name="pincode"
                value={formData.pincode}
                onChange={handleChange}
                readOnly={formData.source === "google"}
              />
            </label>

            <label>
              Formatted Address
              <input
                type="text"
                name="formattedAddress"
                value={formData.formattedAddress}
                onChange={handleChange}
                readOnly={formData.source === "google"}
              />
            </label>

            <button type="button" onClick={handleGetLocation}>
              📍 Choose My Location
            </button>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <div className="seller-register-container">
      {/* Left Image Side */}
      <div className="seller-register-left">
        <img src={sellerImage} alt="Register Illustration" />
        <h2>Register as a Seller</h2>
        <p>to access 1000+ verified buyers and grow your business</p>
      </div>

      {/* Right Form Side */}
      <div className="seller-register-right">
        {/* Progress Bar */}
        <div className="progress-container">
          {steps.map((step, index) => (
            <div key={index} className="progress-step">
              <div className={`circle ${index <= currentStep ? "active" : ""}`}>
                {imogis[index]}
              </div>
              <p>{step}</p>
              {index < steps.length - 1 && (
                <div
                  className={`line ${index < currentStep ? "filled" : ""}`}
                ></div>
              )}
            </div>
          ))}
        </div>

        {/* Form */}
        <form className="seller-register-form">
          {renderStep()}
          {error && (
            <div
              style={{
                color: "red",
                backgroundColor: "#ffe6e6",
                border: "1px solid #ffcccc",
                borderRadius: "4px",
                padding: "10px",
                margin: "10px 0",
                fontWeight: "500",
              }}
            >
              ⚠️ {error}
            </div>
          )}
          <div
            style={{ display: "flex", gap: "10px", justifyContent: "center" }}
          >
            {currentStep > 0 && (
              <button
                type="button"
                className="submit-btns"
                onClick={handlePrevious}
                style={{
                  backgroundColor: "#6c757d",
                  color: "white",
                  border: "none",
                  padding: "10px 20px",
                  borderRadius: "5px",
                  cursor: "pointer",
                }}
              >
                Previous
              </button>
            )}
            <button
              type="button"
              className="submit-btns"
              onClick={handleNext}
              disabled={isSubmitting}
              style={{
                opacity: isSubmitting ? 0.6 : 1,
                cursor: isSubmitting ? "not-allowed" : "pointer",
              }}
            >
              {isSubmitting
                ? "Registering..."
                : currentStep === steps.length - 1
                ? "Register"
                : "Next"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
