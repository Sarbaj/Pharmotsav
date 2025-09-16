import React, { useState } from "react";
import "../CSS/SellerRegister.css";
import { useNavigate } from "react-router-dom";
import sellerImage from "../assets/seller-image.png";

export default function SellerRegister() {
  const navigate = useNavigate();
  const imogis=["👤","🏢","📍"];

  const steps = ["Basic Info", "Company Info", "Address"];
  const [currentStep, setCurrentStep] = useState(0);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
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

  const natureOfBusinesses = [
    "Pharmacy",
    "Hospital",
    "Agent",
    "Distributors",
    "Manufacturer",
    "Other",
  ];

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Validate step before moving next
  const validateStep = () => {
    if (currentStep === 0) {
      if (!formData.firstName || !formData.lastName || !formData.email || !formData.mobileNumber || !formData.password || !formData.confirmPassword) {
        return "All fields are required in Basic Info";
      }
      if (formData.password !== formData.confirmPassword) {
        return "Passwords do not match";
      }
    }
    if (currentStep === 1) {
      if (!formData.CompanyName || !formData.natureOfBusiness || !formData.licenseNumber || !formData.gstNumber) {
        return "All fields are required in Company Info";
      }
    }
    if (currentStep === 2) {
      if (!formData.address || !formData.city || !formData.state || !formData.pincode || !formData.country) {
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

  const handleSubmit = async () => {
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

      console.log(dataToSend);

      const response = await fetch("http://localhost:4000/api/v1/sellers/register-seller", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSend),
      });

      if (response.ok) {
        alert("Seller Registration Successful!");
        navigate("/");
      } else {
        alert("Registration failed. Try again.");
      }
    } catch (err) {
      console.error(err);
      alert("Error submitting form.");
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


  // Form step UI
  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <>
            <label>First Name* <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} /></label>
            <label>Last Name* <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} /></label>
            <label>Email* <input type="email" name="email" value={formData.email} onChange={handleChange} /></label>
            <label>Mobile Number* <input type="tel" name="mobileNumber" value={formData.mobileNumber} onChange={handleChange} /></label>
            <label>Password* <input type="password" name="password" value={formData.password} onChange={handleChange} /></label>
            <label>Confirm Password* <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} /></label>
          </>
        );
      case 1:
        return (
          <>
            <label>Company Name* <input type="text" name="CompanyName" value={formData.CompanyName} onChange={handleChange} /></label>
            <label>Nature of Business* 
              <select name="natureOfBusiness" value={formData.natureOfBusiness} onChange={handleChange}>
                <option value="">Select...</option>
                {natureOfBusinesses.map((b, i) => (
                  <option key={i} value={b}>{b}</option>
                ))}
              </select>
            </label>
            <label>License Number* <input type="text" name="licenseNumber" value={formData.licenseNumber} onChange={handleChange} /></label>
            <label>GST Number* <input type="text" name="gstNumber" value={formData.gstNumber} onChange={handleChange} /></label>
          </>
        );
      case 2:
  return (
    <>
      <label>Address* 
        <input 
          type="text" 
          name="address" 
          value={formData.address} 
          onChange={handleChange} 
          readOnly={formData.source === "google"} 
        />
      </label>

      <label>City* 
        <input 
          type="text" 
          name="city" 
          value={formData.city} 
          onChange={handleChange} 
          readOnly={formData.source === "google"} 
        />
      </label>

      <label>State* 
        <input 
          type="text" 
          name="state" 
          value={formData.state} 
          onChange={handleChange} 
          readOnly={formData.source === "google"} 
        />
      </label>

      <label>Country* 
        <input 
          type="text" 
          name="country" 
          value={formData.country} 
          onChange={handleChange} 
          readOnly={formData.source === "google"} 
        />
      </label>

      <label>Pincode* 
        <input 
          type="text" 
          name="pincode" 
          value={formData.pincode} 
          onChange={handleChange} 
          readOnly={formData.source === "google"} 
        />
      </label>

      <label>Formatted Address 
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
            <div className={`line ${index < currentStep ? "filled" : ""}`}></div>
          )}
        </div>
      ))}
    </div>

    {/* Form */}
    <form className="seller-register-form">
      {renderStep()}
      {error && <p style={{ color: "red" }}>{error}</p>}
      <button type="button" className="submit-btns" onClick={handleNext}>
        {currentStep === steps.length - 1 ? "Register" : "Next"}
      </button>
    </form>
  </div>
</div>
  );
}
