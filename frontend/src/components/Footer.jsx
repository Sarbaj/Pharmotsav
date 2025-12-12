import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import "../CSS/Footer.css";
import logo from "../IMGS/logo.png";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const [isLogin, setIsLogin] = useState(false);
  const [role, setRole] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const { UserInfo } = useSelector((state) => state.user);

  // Check login status and role
  useEffect(() => {
    // Check for admin authentication
    const adminToken = localStorage.getItem("adminToken");
    const adminUserData = localStorage.getItem("adminUser");
    
    if (adminToken && adminUserData) {
      setIsAdmin(true);
      setIsLogin(true);
      return;
    }

    // Check for regular user authentication
    const token = localStorage.getItem("refreshToken");
    const storedRole = localStorage.getItem("role");
    
    if (token && storedRole) {
      setIsLogin(true);
      setRole(storedRole);
    } else if (UserInfo) {
      setIsLogin(true);
      // Determine role from UserInfo if available
      const userRole = localStorage.getItem("role") || "";
      setRole(userRole);
    }
  }, [UserInfo]);

  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Main Footer Content */}
        <div className="footer-main">
          {/* Company Info */}
          <div className="footer-section">
            <div className="footer-branding">
              <img src={logo} alt="SaathSource Logo" className="footer-logo" />
              <h2 className="footer-title">
                Saath<span className="footer-title">source</span>
              </h2>
            </div>
            <p className="footer-description">
              Connecting pharmaceutical buyers and sellers worldwide. Your
              trusted platform for high-quality APIs, excipients, and
              pharmaceutical materials.
            </p>
            <div className="social-links">
              <a href="#" className="social-link" aria-label="Facebook">
                <span className="social-icon">📘</span>
              </a>
              <a href="#" className="social-link" aria-label="Twitter">
                <span className="social-icon">🐦</span>
              </a>
              <a href="#" className="social-link" aria-label="LinkedIn">
                <span className="social-icon">💼</span>
              </a>
              <a href="#" className="social-link" aria-label="Instagram">
                <span className="social-icon">📷</span>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer-section">
            <h3 className="footer-heading">Quick Links</h3>
            <ul className="footer-links">
              <li>
                <NavLink to="/" className="footer-link">
                  Home
                </NavLink>
              </li>
              <li>
                <NavLink to="/products" className="footer-link">
                  Products
                </NavLink>
              </li>
              <li>
                <NavLink to="/about" className="footer-link">
                  About Us
                </NavLink>
              </li>
              <li>
                <NavLink to="/contact" className="footer-link">
                  Contact
                </NavLink>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div className="footer-section">
            <h3 className="footer-heading">
              {isLogin ? "My Account" : "Services"}
            </h3>
            <ul className="footer-links">
              {!isLogin ? (
                // Show registration links for non-logged in users
                <>
                  <li>
                    <NavLink to="/buyer" className="footer-link">
                      For Buyers
                    </NavLink>
                  </li>
                  <li>
                    <NavLink to="/seller" className="footer-link">
                      For Sellers
                    </NavLink>
                  </li>
                  <li>
                    <NavLink to="/buyerregister" className="footer-link">
                      Buyer Registration
                    </NavLink>
                  </li>
                  <li>
                    <NavLink to="/sellerregister" className="footer-link">
                      Seller Registration
                    </NavLink>
                  </li>
                </>
              ) : (
                // Show dashboard links for logged in users
                <>
                  <li>
                    <NavLink 
                      to={
                        isAdmin 
                          ? "/admin-dashboard" 
                          : role === "buyer" 
                          ? "/buyer-profile" 
                          : "/seller-profile"
                      } 
                      className="footer-link"
                    >
                      My Dashboard
                    </NavLink>
                  </li>
                  <li>
                    <NavLink to="/products" className="footer-link">
                      Browse Products
                    </NavLink>
                  </li>


                  <li>
                    <NavLink to="/contact" className="footer-link">
                      Support
                    </NavLink>
                  </li>
                </>
              )}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="footer-section">
            <h3 className="footer-heading">Contact Info</h3>
            <div className="contact-info">
              <div className="contact-item">
                <span className="contact-icon">📍</span>
                <span className="contact-text">
                  123 Pharma Street, Medical District
                  <br />
                  Mumbai, Maharashtra 400001
                </span>
              </div>
              <div className="contact-item">
                <span className="contact-icon">📞</span>
                <span className="contact-text">
                  +91 98765 43210
                  <br />
                  +91 87654 32109
                </span>
              </div>
              <div className="contact-item">
                <span className="contact-icon">✉️</span>
                <span className="contact-text">
                  info@SaathSource.com
                  <br />
                  support@SaathSource.com
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="footer-bottom">
          <div className="footer-bottom-content">
            <div className="copyright">
              <p>&copy; {currentYear} SaathSource. All rights reserved.</p>
            </div>
            <div className="footer-bottom-links">
              <a href="#" className="bottom-link">
                Privacy Policy
              </a>
              <a href="#" className="bottom-link">
                Terms of Service
              </a>
              <a href="#" className="bottom-link">
                Cookie Policy
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
