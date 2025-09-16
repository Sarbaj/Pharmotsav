import React, { useState } from "react";
import "../CSS/BuyerRegister.css";
import registerImage from "../IMGS/main1.png"; // Replace with your actual image path

export default function BuyerRegister() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    natureOfBusiness: "",
    companyName: "",
    designation: "",
    mobileNumber: "",
    countryOfOperation: "",
    numberOfEmployees: "",
    annualTurnover: "",
    password: "",
    confirmPassword: "",
    role: "Buyer",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form data submitted:", formData);
  };

  return (
    <div className="register-wrapper">
      <div className="image-container">
        <img src={registerImage} alt="Registration" />
      </div>

      <div className="form-container">
        <h2>Register Your Account</h2>
        <form className="register-form" onSubmit={handleSubmit}>
          <div className="form-columns">
            <div className="form-column">
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
                Nature of Business*
                <select
                  name="natureOfBusiness"
                  value={formData.natureOfBusiness}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select...</option>
                  <option value="Pharmacy">Pharmacy</option>
                  <option value="Hospital">Hospital</option>
                  <option value="Manufacturer">Manufacturer</option>
                  <option value="Distributor">Distributor</option>
                  <option value="Agent">Agent</option>
                </select>
              </label>

              <label>
                Company Name*
                <input
                  type="text"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleChange}
                  required
                />
              </label>

              <label>
                Designation*
                <input
                  type="text"
                  name="designation"
                  value={formData.designation}
                  onChange={handleChange}
                  required
                />
              </label>
            </div>

            <div className="form-column">
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
                Country of Operation
                <input
                  type="text"
                  name="countryOfOperation"
                  value={formData.countryOfOperation}
                  onChange={handleChange}
                />
              </label>

              <label>
                Number of Employees
                <input
                  type="number"
                  min="0"
                  name="numberOfEmployees"
                  value={formData.numberOfEmployees}
                  onChange={handleChange}
                />
              </label>

              <label>
                Annual Turnover Option
                <input
                  type="text"
                  name="annualTurnover"
                  value={formData.annualTurnover}
                  onChange={handleChange}
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

              <label>
                Role*
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  required
                >
                  <option value="Buyer">Buyer</option>
                  <option value="Seller">Seller</option>
                  <option value="Both">Both</option>
                </select>
              </label>
            </div>
          </div>

          <button type="submit" className="submit-btns">
            Register
          </button>
        </form>
      </div>
    </div>
  );
}
