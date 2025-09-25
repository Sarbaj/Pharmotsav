import React, { useState } from "react";
import "../CSS/BuyerRegister.css";
import registerImage from "../assets/BuyerRegister.png"; // Replace with your actual image path
import { useNavigate } from "react-router-dom";



export default function BuyerRegister(){

  const navigate = useNavigate();

  // List of countries for the dropdown
  const countries = [
  "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Antigua and Barbuda",
  "Argentina", "Armenia", "Australia", "Austria", "Azerbaijan",
  "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium",
  "Belize", "Benin", "Bhutan", "Bolivia", "Bosnia and Herzegovina", "Botswana",
  "Brazil", "Brunei", "Bulgaria", "Burkina Faso", "Burundi",
  "Cabo Verde", "Cambodia", "Cameroon", "Canada", "Central African Republic",
  "Chad", "Chile", "China", "Colombia", "Comoros", "Congo (Congo-Brazzaville)",
  "Costa Rica", "Croatia", "Cuba", "Cyprus", "Czechia (Czech Republic)",
  "Democratic Republic of the Congo", "Denmark", "Djibouti", "Dominica",
  "Dominican Republic", "Ecuador", "Egypt", "El Salvador", "Equatorial Guinea",
  "Eritrea", "Estonia", "Eswatini (fmr. Swaziland)", "Ethiopia", "Fiji", "Finland",
  "France", "Gabon", "Gambia", "Georgia", "Germany", "Ghana", "Greece", "Grenada",
  "Guatemala", "Guinea", "Guinea-Bissau", "Guyana", "Haiti", "Honduras", "Hungary",
  "Iceland", "India", "Indonesia", "Iran", "Iraq", "Ireland", "Israel", "Italy",
  "Jamaica", "Japan", "Jordan", "Kazakhstan", "Kenya", "Kiribati", "Kuwait",
  "Kyrgyzstan", "Laos", "Latvia", "Lebanon", "Lesotho", "Liberia", "Libya",
  "Liechtenstein", "Lithuania", "Luxembourg", "Madagascar", "Malawi", "Malaysia",
  "Maldives", "Mali", "Malta", "Marshall Islands", "Mauritania", "Mauritius",
  "Mexico", "Micronesia", "Moldova", "Monaco", "Mongolia", "Montenegro",
  "Morocco", "Mozambique", "Myanmar (Burma)", "Namibia", "Nauru", "Nepal",
  "Netherlands", "New Zealand", "Nicaragua", "Niger", "Nigeria", "North Korea",
  "North Macedonia", "Norway", "Oman", "Pakistan", "Palau", "Palestine State",
  "Panama", "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Poland",
  "Portugal", "Qatar", "Romania", "Russia", "Rwanda", "Saint Kitts and Nevis",
  "Saint Lucia", "Saint Vincent and the Grenadines", "Samoa", "San Marino",
  "Sao Tome and Principe", "Saudi Arabia", "Senegal", "Serbia", "Seychelles",
  "Sierra Leone", "Singapore", "Slovakia", "Slovenia", "Solomon Islands",
  "Somalia", "South Africa", "South Korea", "South Sudan", "Spain", "Sri Lanka",
  "Sudan", "Suriname", "Sweden", "Switzerland", "Syria", "Tajikistan",
  "Tanzania", "Thailand", "Timor-Leste", "Togo", "Tonga", "Trinidad and Tobago",
  "Tunisia", "Turkey", "Turkmenistan", "Tuvalu", "Uganda", "Ukraine",
  "United Arab Emirates", "United Kingdom", "United States of America",
  "Uruguay", "Uzbekistan", "Vanuatu", "Vatican City", "Venezuela", "Vietnam",
  "Yemen", "Zambia", "Zimbabwe"
];

// Nature of Business options
const natureOfBusinessesarray = ['Pharmacy','Hospital','Agent','Distributors','Manufacturer','Other']
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    country: "",
    natureOfBusiness: "",
    mobileNumber: "",
    password: "",
    confirmPassword: "",
  });

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



  //handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
     const validationError = validateForm();
     if (validationError) {
      setError(validationError);
      return;
    }
    else {
      setError("");
      // Proceed with form submission (e.g., send data to backend)
      const data = { ...formData };
      delete data.confirmPassword; // Remove confirmPassword before sending

      try {
        const response = await fetch("http://localhost:4000/api/v1/buyers/register-buyer", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });
        console.log(response);
        if (response.ok) {
          console.log(response);
          alert("Registration successful!");
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
          // Navigate to another page if needed
          navigate("/");
        } else {
          alert("Registration failed. Please try again.");
        }
      } catch (error) {
        console.error("Error submitting form:", error);
        alert("There was an error submitting the form. Please try again.");
        
      }



      console.log("Form data submitted:", formData);
    }
    
  };

  return (
    <div className="register-wrapper">
      <div className="image-container">
        <img src={registerImage} alt="Registration" />
      </div>

      <div className="form-container">
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
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
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
          <input
            type="tel"
            name="mobileNumber"
            value={formData.mobileNumber}
            onChange={handleChange}
            required
          />
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
        <button type="submit" className="submit-btns" onClick={handleSubmit}>
          Register
        </button>
      </form>
    </div>
    </div>
  );
}
