import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../CSS/AdminLogin.css";
import { API_BASE_URL, API_ENDPOINTS } from "../config/api";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!email || !password) {
      setError("Please enter email and password");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(
        `${API_BASE_URL}${API_ENDPOINTS.ADMIN.LOGIN}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        }
      );

      const data = await res.json();

      if (res.ok && data.success) {
        // Store admin data in localStorage
        localStorage.setItem("adminToken", data.data.accessToken);
        localStorage.setItem("adminRefreshToken", data.data.refreshToken);
        localStorage.setItem("adminUser", JSON.stringify(data.data.admin));
        localStorage.setItem("adminRole", data.data.role);

        console.log("Admin logged in:", data.data.admin);

        // Trigger a custom event to notify header of admin login
        window.dispatchEvent(new CustomEvent("adminLogin"));

        // Redirect to admin dashboard
        navigate("/admin-dashboard");
      } else {
        console.log(data.message);
        setError(data.message || "Login failed");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Server error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-page">
      <div className="admin-login-container">
        <div className="admin-login-form-container">
          <form className="admin-login-form" onSubmit={handleSubmit}>
            <div className="admin-login-header">
              <h1 className="admin-login-title">Admin Login</h1>
              <span className="admin-login-subtitle">
                Access the admin dashboard
              </span>
            </div>

            <div className="admin-login-inputs">
              <input
                type="email"
                className="admin-login-input"
                placeholder="Admin Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
              />
              <input
                type="password"
                className="admin-login-input"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
              />
            </div>

            {error && <p className="admin-login-error">{error}</p>}

            <button
              type="submit"
              className="admin-login-btn"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login as Admin"}
            </button>

            <div className="admin-login-links">
              <p className="admin-login-link">
                <Link to="/login">Back to User Login</Link>
              </p>
            </div>
          </form>
        </div>

        {/* Admin Info Panel */}
        <div className="admin-login-overlay">
          <div className="admin-login-info">
            <h2 className="admin-login-info-title">Admin Access</h2>
            <p className="admin-login-info-text">
              Manage users, products, and platform settings with administrative
              privileges.
            </p>
            <div className="admin-login-features">
              <div className="admin-feature">
                <span className="admin-feature-icon">👥</span>
                <span>User Management</span>
              </div>
              <div className="admin-feature">
                <span className="admin-feature-icon">📊</span>
                <span>Analytics Dashboard</span>
              </div>
              <div className="admin-feature">
                <span className="admin-feature-icon">⚙️</span>
                <span>System Settings</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
