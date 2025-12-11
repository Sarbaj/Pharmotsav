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
        `${API_ENDPOINTS.ADMIN.LOGIN}`,
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
              <p className="admin-login-subtitle">
                Access the admin dashboard
              </p>
            </div>

            <div className="admin-form-group">
              <label htmlFor="email">Email Address</label>
              <input
                id="email"
                type="email"
                placeholder="Enter admin email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
              />
            </div>

            <div className="admin-form-group">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
              />
            </div>

            {error && <div className="admin-error-message">{error}</div>}

            <button
              type="submit"
              className="admin-login-btn"
              disabled={loading}
            >
              {loading ? (
                <div className="admin-loading">
                  <div className="admin-loading-spinner"></div>
                  Logging in...
                </div>
              ) : (
                "Login as Admin"
              )}
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
                <svg
                  className="admin-feature-icon"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  width="20"
                  height="20"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                  />
                </svg>
                <span>User Management</span>
              </div>
              <div className="admin-feature">
                <svg
                  className="admin-feature-icon"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  width="20"
                  height="20"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
                <span>Analytics Dashboard</span>
              </div>
              <div className="admin-feature">
                <svg
                  className="admin-feature-icon"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  width="20"
                  height="20"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
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

