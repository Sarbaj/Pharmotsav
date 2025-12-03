import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../CSS/Login.css";
import { useDispatch, useSelector } from "react-redux";
import { addBasicInfo } from "./REDUX/UserSlice";
import { login } from "./REDUX/UserSlice";
import { API_ENDPOINTS } from "../config/api";
const Login = () => {
  const [role, setRole] = useState("buyer");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

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
          ? API_ENDPOINTS.AUTH.BUYER_LOGIN
          : API_ENDPOINTS.AUTH.SELLER_LOGIN;

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
        console.log("user: ", user);
        dispatch(addBasicInfo(user)); // user must be a flat object

        dispatch(login());
        alert(`/${role}-profile`);
        navigate(`/${role}-profile`);
      } else {
        console.log(data.message);
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
              Not registered? <Link to="/buyerregister">Register as Buyer</Link>
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

        {/* Overlay - Desktop */}
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
                Want to sell your products? Switch to Seller Login
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

        {/* Mobile Switch Section */}
        <div className="login-mobile-switch">
          {role === "buyer" ? (
            <>
              <h2 className="login-mobile-switch-title">Hello Seller!</h2>
              <p className="login-mobile-switch-text">
                Want to sell your products? Switch to Seller Login
              </p>
              <button
                className="login-mobile-switch-btn"
                onClick={() => setRole("seller")}
              >
                Seller Login
              </button>
            </>
          ) : (
            <>
              <h2 className="login-mobile-switch-title">Hello Buyer!</h2>
              <p className="login-mobile-switch-text">
                Looking to shop? Switch to Buyer Login
              </p>
              <button
                className="login-mobile-switch-btn"
                onClick={() => setRole("buyer")}
              >
                Buyer Login
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
