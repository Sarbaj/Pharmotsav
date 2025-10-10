import React, { useState, useEffect } from "react";
import "../CSS/BuyerRegister.css";
import registerImage from "../assets/BuyerRegister.png"; // Replace with your actual image path
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

export default function BuyerRegister() {
  const navigate = useNavigate();
  const { isLogin } = useSelector((state) => state.user);

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

  // List of countries for the dropdown
  const countries = [
    "Afghanistan",
    "Albania",
    "Algeria",
    "Andorra",
    "Angola",
    "Antigua and Barbuda",
    "Argentina",
    "Armenia",
    "Australia",
    "Austria",
    "Azerbaijan",
    "Bahamas",
    "Bahrain",
    "Bangladesh",
    "Barbados",
    "Belarus",
    "Belgium",
    "Belize",
    "Benin",
    "Bhutan",
    "Bolivia",
    "Bosnia and Herzegovina",
    "Botswana",
    "Brazil",
    "Brunei",
    "Bulgaria",
    "Burkina Faso",
    "Burundi",
    "Cabo Verde",
    "Cambodia",
    "Cameroon",
    "Canada",
    "Central African Republic",
    "Chad",
    "Chile",
    "China",
    "Colombia",
    "Comoros",
    "Congo (Congo-Brazzaville)",
    "Costa Rica",
    "Croatia",
    "Cuba",
    "Cyprus",
    "Czechia (Czech Republic)",
    "Democratic Republic of the Congo",
    "Denmark",
    "Djibouti",
    "Dominica",
    "Dominican Republic",
    "Ecuador",
    "Egypt",
    "El Salvador",
    "Equatorial Guinea",
    "Eritrea",
    "Estonia",
    "Eswatini (fmr. Swaziland)",
    "Ethiopia",
    "Fiji",
    "Finland",
    "France",
    "Gabon",
    "Gambia",
    "Georgia",
    "Germany",
    "Ghana",
    "Greece",
    "Grenada",
    "Guatemala",
    "Guinea",
    "Guinea-Bissau",
    "Guyana",
    "Haiti",
    "Honduras",
    "Hungary",
    "Iceland",
    "India",
    "Indonesia",
    "Iran",
    "Iraq",
    "Ireland",
    "Israel",
    "Italy",
    "Jamaica",
    "Japan",
    "Jordan",
    "Kazakhstan",
    "Kenya",
    "Kiribati",
    "Kuwait",
    "Kyrgyzstan",
    "Laos",
    "Latvia",
    "Lebanon",
    "Lesotho",
    "Liberia",
    "Libya",
    "Liechtenstein",
    "Lithuania",
    "Luxembourg",
    "Madagascar",
    "Malawi",
    "Malaysia",
    "Maldives",
    "Mali",
    "Malta",
    "Marshall Islands",
    "Mauritania",
    "Mauritius",
    "Mexico",
    "Micronesia",
    "Moldova",
    "Monaco",
    "Mongolia",
    "Montenegro",
    "Morocco",
    "Mozambique",
    "Myanmar (Burma)",
    "Namibia",
    "Nauru",
    "Nepal",
    "Netherlands",
    "New Zealand",
    "Nicaragua",
    "Niger",
    "Nigeria",
    "North Korea",
    "North Macedonia",
    "Norway",
    "Oman",
    "Pakistan",
    "Palau",
    "Palestine State",
    "Panama",
    "Papua New Guinea",
    "Paraguay",
    "Peru",
    "Philippines",
    "Poland",
    "Portugal",
    "Qatar",
    "Romania",
    "Russia",
    "Rwanda",
    "Saint Kitts and Nevis",
    "Saint Lucia",
    "Saint Vincent and the Grenadines",
    "Samoa",
    "San Marino",
    "Sao Tome and Principe",
    "Saudi Arabia",
    "Senegal",
    "Serbia",
    "Seychelles",
    "Sierra Leone",
    "Singapore",
    "Slovakia",
    "Slovenia",
    "Solomon Islands",
    "Somalia",
    "South Africa",
    "South Korea",
    "South Sudan",
    "Spain",
    "Sri Lanka",
    "Sudan",
    "Suriname",
    "Sweden",
    "Switzerland",
    "Syria",
    "Tajikistan",
    "Tanzania",
    "Thailand",
    "Timor-Leste",
    "Togo",
    "Tonga",
    "Trinidad and Tobago",
    "Tunisia",
    "Turkey",
    "Turkmenistan",
    "Tuvalu",
    "Uganda",
    "Ukraine",
    "United Arab Emirates",
    "United Kingdom",
    "United States of America",
    "Uruguay",
    "Uzbekistan",
    "Vanuatu",
    "Vatican City",
    "Venezuela",
    "Vietnam",
    "Yemen",
    "Zambia",
    "Zimbabwe",
  ];

  // Nature of Business options
  const natureOfBusinessesarray = [
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
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    country: "",
    natureOfBusiness: "",
    countryCode: "+1", // Default to US
    mobileNumber: "",
    password: "",
    confirmPassword: "",
  });

  // Verification states
  const [verificationStep, setVerificationStep] = useState("form"); // "form", "phone", "email", "complete"
  const [phoneOTP, setPhoneOTP] = useState("");
  const [emailOTP, setEmailOTP] = useState("");
  const [phoneVerified, setPhoneVerified] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);

  // Function to validate form data
  const validateForm = () => {
    // 1. Check required fields
    for (const [key, value] of Object.entries(formData)) {
      if (!value.trim()) {
        return "All fields are required";
      }
    }

    // 2. Password rules (example: min 6 chars, must contain number)
    if (formData.password.length < 6) {
      return "Password must be at least 6 characters long";
    }
    if (!/\d/.test(formData.password)) {
      return "Password must contain at least one number";
    }

    // 3. Confirm password
    if (formData.password !== formData.confirmPassword) {
      return "Passwords do not match";
    }

    return ""; // no errors
  };

  // State for error messages
  const [error, setError] = useState("");

  //handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError("");
  };

  // Send phone OTP
  const sendPhoneOTP = async () => {
    try {
      setOtpLoading(true);
      const fullMobileNumber = `${formData.countryCode}${formData.mobileNumber}`;
      const response = await fetch(
        "http://localhost:4000/api/v1/otp/buyer/phone/initiate",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            mobileNumber: fullMobileNumber,
            userData: {
              firstName: formData.firstName,
              lastName: formData.lastName,
              email: formData.email,
            },
          }),
        }
      );

      const data = await response.json();
      if (response.ok) {
        alert("OTP sent to your mobile number!");
        // Show phone verification modal or inline form
        setVerificationStep("phone");
      } else {
        alert(data.message || "Failed to send OTP");
      }
    } catch (error) {
      console.error("Error sending phone OTP:", error);
      alert("Failed to send OTP. Please try again.");
    } finally {
      setOtpLoading(false);
    }
  };

  // Send email OTP
  const sendEmailOTP = async () => {
    try {
      setOtpLoading(true);
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
        alert(
          "Verification email sent to your email address! Check your email for the OTP."
        );
        // Show email verification modal or inline form
        setVerificationStep("email");
      } else {
        alert(data.message || "Failed to send verification email");
      }
    } catch (error) {
      console.error("Error sending email OTP:", error);
      alert("Failed to send verification email. Please try again.");
    } finally {
      setOtpLoading(false);
    }
  };

  // Verify phone OTP
  const verifyPhoneOTP = async () => {
    try {
      setOtpLoading(true);
      const fullMobileNumber = `${formData.countryCode}${formData.mobileNumber}`;
      const response = await fetch(
        "http://localhost:4000/api/v1/otp/buyer/phone/verify",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            mobileNumber: fullMobileNumber,
            otp: phoneOTP,
          }),
        }
      );

      const data = await response.json();
      if (response.ok) {
        setPhoneVerified(true);
        alert("Phone number verified successfully!");
        // Go back to form
        setVerificationStep("form");
        setPhoneOTP("");
      } else {
        alert(data.message || "Invalid OTP");
      }
    } catch (error) {
      console.error("Error verifying phone OTP:", error);
      alert("Failed to verify OTP. Please try again.");
    } finally {
      setOtpLoading(false);
    }
  };

  // Verify email OTP
  const verifyEmailOTP = async () => {
    try {
      setOtpLoading(true);
      const response = await fetch(
        "http://localhost:4000/api/v1/otp/buyer/email/verify",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: formData.email,
            otp: emailOTP,
          }),
        }
      );

      const data = await response.json();
      if (response.ok) {
        setEmailVerified(true);
        alert("Email verified successfully!");
        // Go back to form
        setVerificationStep("form");
        setEmailOTP("");
      } else {
        alert(data.message || "Invalid OTP");
      }
    } catch (error) {
      console.error("Error verifying email OTP:", error);
      alert("Failed to verify OTP. Please try again.");
    } finally {
      setOtpLoading(false);
    }
  };

  // Final registration after both verifications
  const handleFinalRegistration = async () => {
    try {
      setIsLoading(true);
      const data = { ...formData };
      delete data.confirmPassword; // Remove confirmPassword before sending
      delete data.countryCode; // Remove countryCode as it's combined with mobileNumber

      // Combine country code with mobile number
      data.mobileNumber = `${formData.countryCode}${formData.mobileNumber}`;

      const response = await fetch(
        "http://localhost:4000/api/v1/buyers/register-buyer",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      if (response.ok) {
        alert("Registration successful! Welcome to Saathsource!");
        setVerificationStep("complete");
        // Reset form
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          country: "",
          natureOfBusiness: "",
          mobileNumber: "",
          password: "",
          confirmPassword: "",
        });
        // Navigate to home page
        setTimeout(() => {
          navigate("/");
        }, 2000);
      } else {
        const errorData = await response.json();
        alert(errorData.message || "Registration failed. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("There was an error submitting the form. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  //handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    // Check if both phone and email are verified
    if (!phoneVerified) {
      setError("Please verify your phone number first");
      return;
    }

    if (!emailVerified) {
      setError("Please verify your email address first");
      return;
    }

    setError("");
    // Proceed with final registration
    await handleFinalRegistration();
  };

  // Render phone verification step
  const renderPhoneVerification = () => (
    <div className="verification-container">
      <h2>Verify Your Phone Number</h2>
      <p>
        We've sent a verification code to {formData.countryCode}
        {formData.mobileNumber}
      </p>
      <div className="otp-input-container">
        <input
          type="text"
          placeholder="Enter OTP"
          value={phoneOTP}
          onChange={(e) => setPhoneOTP(e.target.value)}
          maxLength="6"
          className="otp-input"
        />
        <button
          type="button"
          onClick={verifyPhoneOTP}
          disabled={otpLoading || phoneOTP.length !== 6}
          className="verify-btn"
        >
          {otpLoading ? "Verifying..." : "Verify OTP"}
        </button>
      </div>
      <button
        type="button"
        onClick={() => setVerificationStep("form")}
        className="back-btn"
      >
        Back to Form
      </button>
    </div>
  );

  // Render email verification step
  const renderEmailVerification = () => (
    <div className="verification-container">
      <h2>Verify Your Email</h2>
      <p>We've sent a verification code to {formData.email}</p>
      <div className="otp-input-container">
        <input
          type="text"
          placeholder="Enter OTP"
          value={emailOTP}
          onChange={(e) => setEmailOTP(e.target.value)}
          maxLength="6"
          className="otp-input"
        />
        <button
          type="button"
          onClick={verifyEmailOTP}
          disabled={otpLoading || emailOTP.length !== 6}
          className="verify-btn"
        >
          {otpLoading ? "Verifying..." : "Verify OTP"}
        </button>
      </div>
      <button
        type="button"
        onClick={() => setVerificationStep("phone")}
        className="back-btn"
      >
        Back to Phone Verification
      </button>
    </div>
  );

  // Render completion step
  const renderCompletion = () => (
    <div className="completion-container">
      <h2>Registration Successful!</h2>
      <p>Welcome to Saathsource! Your account has been created successfully.</p>
      <p>You will be redirected to the home page shortly...</p>
    </div>
  );

  return (
    <div className="register-wrapper">
      <div className="register-container">
        <div className="image-container">
          <img src={registerImage} alt="Registration" />
        </div>

        <div className="form-container">
          {verificationStep === "form" && (
            <>
              <h2>Register Your Account</h2>
              <form className="register-form" onSubmit={handleSubmit}>
                <label>
                  First Name*
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                  />
                </label>

                <label>
                  Last Name*
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                  />
                </label>

                <label>
                  Email*
                  <div className="input-with-button">
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
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
                      className="send-otp-btn"
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
                  Country*
                  <select
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select...</option>
                    {countries.map((country, index) => (
                      <option key={index} value={country}>
                        {country}
                      </option>
                    ))}
                  </select>
                </label>

                <label>
                  Nature of Business*
                  <select
                    name="natureOfBusiness"
                    value={formData.natureOfBusiness}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select...</option>
                    {natureOfBusinessesarray.map((business, index) => (
                      <option key={index} value={business}>
                        {business}
                      </option>
                    ))}
                  </select>
                </label>

                <label>
                  Mobile Number*
                  <div className="mobile-input-container">
                    <div className="country-code-selector">
                      <select
                        name="countryCode"
                        value={formData.countryCode}
                        onChange={handleChange}
                        className="country-code-select"
                        disabled={phoneVerified}
                        style={{
                          backgroundColor: phoneVerified ? "#f8f9fa" : "white",
                          cursor: phoneVerified ? "not-allowed" : "pointer",
                          opacity: phoneVerified ? 0.7 : 1,
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
                        required
                        disabled={phoneVerified}
                        style={{
                          backgroundColor: phoneVerified ? "#f8f9fa" : "white",
                          cursor: phoneVerified ? "not-allowed" : "text",
                          opacity: phoneVerified ? 0.7 : 1,
                        }}
                      />
                    </div>
                    <button
                      type="button"
                      onClick={sendPhoneOTP}
                      disabled={
                        otpLoading || !formData.mobileNumber || phoneVerified
                      }
                      className="send-otp-btn"
                    >
                      {phoneVerified
                        ? "✓ Verified"
                        : otpLoading
                        ? "Sending..."
                        : "Send OTP"}
                    </button>
                  </div>
                  {phoneVerified && (
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

                <label>
                  Password*
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                </label>

                <label>
                  Confirm Password*
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                  />
                </label>
                {error && <p style={{ color: "red" }}>{error}</p>}
                <button
                  type="submit"
                  className="submit-btns"
                  disabled={isLoading}
                >
                  {isLoading ? "Processing..." : "Register"}
                </button>
              </form>
            </>
          )}

          {verificationStep === "phone" && renderPhoneVerification()}
          {verificationStep === "email" && renderEmailVerification()}
          {verificationStep === "complete" && renderCompletion()}
        </div>
      </div>
    </div>
  );
}
