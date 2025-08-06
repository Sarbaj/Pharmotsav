import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import "../../CSS/Header.css"; // Assuming you have a CSS file for styling
import logo from "../../IMGS/logo.png";
export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLogin, setIsLogin] = useState(true); // Simulate login state
  useEffect(() => {
    setIsLogin(true); // Simulate user login for demonstration
  });

  return (
    <header className="header">
      <div className="header-container">
        {/* Logo */}
        <div className="logo">
          <img src={logo} alt="logo" />
          <h2>
            Saath<span>source</span>
          </h2>
        </div>

        {/* Center Nav */}
        <nav className="nav-wrapper">
          <div className="desktop-nav">
            <NavLink to="/" className="nav-link">
              Home
            </NavLink>
            <NavLink to="/products" className="nav-link">
              Products
            </NavLink>

            <NavLink to="/about" className="nav-link">
              About
            </NavLink>
            <NavLink to="/buyer" className="nav-link">
              For buyer
            </NavLink>
            <NavLink to="/seller" className="nav-link">
              For seller
            </NavLink>
            <NavLink to="/contact" className="nav-link">
              Contact
            </NavLink>
          </div>
        </nav>

        {/* Action Buttons (Right Side) */}
        <div className="action-buttons">
          {isLogin ? (
            <NavLink
              to="/register"
              style={{
                textDecoration: "none",
                color: "#ffffffff",
                padding: "10px 19px",
                background: "black",
                fontFamily: "uppercasefont",
                borderRadius: "5px",
                fontSize: "small",
              }}
              className="btnsignin"
            >
              Sing-in/Register
            </NavLink>
          ) : (
            <div
              className="user-icon"
              title="User Profile"
              role="img"
              aria-label="User Icon"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor" // to inherit text color or CSS color
                width="28"
                height="28"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 7.5a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.5 19.5a8.25 8.25 0 0115 0"
                />
              </svg>
            </div>
          )}
        </div>

        {/* Mobile Toggle */}
        <button onClick={() => setIsOpen(!isOpen)} className="menu-toggle">
          <svg
            className="menu-icon"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            {isOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="mobile-menu">
          <NavLink to="/" className="nav-link">
            Home
          </NavLink>
          <NavLink to="/products" className="nav-link">
            Products
          </NavLink>
          <NavLink to="/buyers" className="nav-link">
            For Buyers
          </NavLink>
          <NavLink to="/sellers" className="nav-link">
            For Sellers
          </NavLink>
          <NavLink to="/about" className="nav-link">
            About
          </NavLink>
          <NavLink to="/contact" className="nav-link">
            Contact
          </NavLink>
        </div>
      )}
    </header>
  );
}
