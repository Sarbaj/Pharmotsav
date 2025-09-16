import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../CSS/Login.css";

const Login = () => {
  const [role, setRole] = useState("buyer");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please enter email and password");
      return;
    }

    try {
      const endpoint =
        role === "buyer"
          ? "http://localhost:4000/api/v1/buyers/login-buyer"
          : "http://localhost:4000/api/v1/sellers/login-seller";

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      let data = await res.json();

      if (Array.isArray(data)) data = data[0];

      if (res.ok && data.success) {
        const user = role === "buyer" ? data.data.buyer : data.data.seller;

        localStorage.setItem("token", data.data.accessToken);
        localStorage.setItem("refreshToken", data.data.refreshToken);
        localStorage.setItem("user", JSON.stringify(user));
        localStorage.setItem("role", role);

        alert(`${role} login successful`);
        navigate(`/${role}-profile`);
      } else {
        setError(data.message || "Login failed");
      }
    } catch (err) {
      setError("Server error");
    }
  };

  return (
    <div className="login-page">
      <div
        className={`login-container ${
          role === "seller" ? "right-panel-active" : ""
        }`}
      >
        {/* Buyer Login */}
        <div className="login-form-container login-buyer-container">
          <form className="login-form" onSubmit={handleSubmit}>
            <h1 className="login-title">Buyer Login</h1>
            <span className="login-subtitle">Use your email and password</span>
            <input
              type="email"
              className="login-input"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              className="login-input"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            {error && <p className="login-error">{error}</p>}
            <button type="submit" className="login-btn">
              Login
            </button>
            <p className="login-register-link">
              Not registered?{" "}
              <Link to="/buyerregister">Register as Buyer</Link>
            </p>
          </form>
        </div>

        {/* Seller Login */}
        <div className="login-form-container login-seller-container">
          <form className="login-form" onSubmit={handleSubmit}>
            <h1 className="login-title">Seller Login</h1>
            <span className="login-subtitle">Use your email and password</span>
            <input
              type="email"
              className="login-input"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              className="login-input"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            {error && <p className="login-error">{error}</p>}
            <button type="submit" className="login-btn">
              Login
            </button>
            <p className="login-register-link">
              Not registered?{" "}
              <Link to="/sellerregister">Register as Seller</Link>
            </p>
          </form>
        </div>

        {/* Overlay */}
        <div className="login-overlay-container">
          <div className="login-overlay">
            <div className="login-overlay-panel login-overlay-left">
              <h1 className="login-overlay-title">Hello Buyer!</h1>
              <p className="login-overlay-text">
                Looking to shop? Switch to Buyer Login
              </p>
              <button
                className="login-btn ghost"
                onClick={() => setRole("buyer")}
              >
                Buyer Login
              </button>
            </div>
            <div className="login-overlay-panel login-overlay-right">
              <h1 className="login-overlay-title">Hello Seller!</h1>
              <p className="login-overlay-text">
                Want to sell your products? <br/>Switch to Seller Login
              </p>
              <button
                className="login-btn ghost"
                onClick={() => setRole("seller")}
              >
                Seller Login
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
