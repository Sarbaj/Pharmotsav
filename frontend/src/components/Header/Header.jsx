import { useState, useEffect, useRef } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import "../../CSS/Header.css"; // Assuming you have a CSS file for styling
import { addBasicInfo } from "../REDUX/UserSlice";
import { useDispatch } from "react-redux";
import logo from "../../IMGS/logo.png";
export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLogin, setIsLogin] = useState(false);
  const [role, setRole] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminUser, setAdminUser] = useState(null);
  const { UserInfo } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const headerRef = useRef(null);

  const navigate = useNavigate();

  // Click outside handler
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (headerRef.current && !headerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  useEffect(() => {
    if (UserInfo != null) {
      setIsLogin(true);
      console.log(isLogin);
      console.log(UserInfo);
    }
  }, [UserInfo]);

  // Prevent redirects on admin pages
  useEffect(() => {
    const currentPath = window.location.pathname;
    if (
      currentPath.includes("/admin") ||
      currentPath.includes("/login-admin")
    ) {
      // Don't redirect on admin pages
      return;
    }
  }, []);

  // Check for admin authentication
  useEffect(() => {
    const checkAdminAuth = () => {
      const adminToken = localStorage.getItem("adminToken");
      const adminUserData = localStorage.getItem("adminUser");

      if (adminToken && adminUserData) {
        try {
          const admin = JSON.parse(adminUserData);
          setAdminUser(admin);
          setIsAdmin(true);
          setIsLogin(true);
        } catch (error) {
          console.error("Error parsing admin user data:", error);
          // Clear invalid admin data
          localStorage.removeItem("adminToken");
          localStorage.removeItem("adminRefreshToken");
          localStorage.removeItem("adminUser");
          localStorage.removeItem("adminRole");
        }
      }
    };

    checkAdminAuth();

    // Listen for admin login events
    const handleAdminLogin = () => {
      checkAdminAuth();
    };

    // Listen for admin logout events
    const handleAdminLogout = () => {
      setAdminUser(null);
      setIsAdmin(false);
      setIsLogin(false);
    };

    window.addEventListener("adminLogin", handleAdminLogin);
    window.addEventListener("adminLogout", handleAdminLogout);

    return () => {
      window.removeEventListener("adminLogin", handleAdminLogin);
      window.removeEventListener("adminLogout", handleAdminLogout);
    };
  }, []);
  useEffect(() => {
    const verifyToken = async () => {
      try {
        // Check if admin is logged in first
        const adminToken = localStorage.getItem("adminToken");
        const adminUserData = localStorage.getItem("adminUser");

        if (adminToken && adminUserData) {
          // Admin is logged in, don't redirect
          return;
        }

        // Check for regular user token
        const token = localStorage.getItem("refreshToken");
        console.log(token);

        if (!token) {
          // Only redirect to login if we're not on admin pages
          const currentPath = window.location.pathname;
          if (
            !currentPath.includes("/admin") &&
            !currentPath.includes("/login-admin")
          ) {
            navigate("/login");
          }
          return;
        }

        // Try buyer refresh token first
        let response = await fetch(
          "http://localhost:4000/api/v1/buyers/login-after-refresh",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ refreshToken: token }),
          }
        );

        let data;
        let isBuyer = false;

        if (response.ok) {
          data = await response.json();
          if (data.message === "Buyer fetched successfully") {
            isBuyer = true;
            setRole("1");
          }
        } else {
          // If buyer refresh fails, try seller refresh token
          response = await fetch(
            "http://localhost:4000/api/v1/sellers/login-after-refresh",
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ refreshToken: token }),
            }
          );

          if (response.ok) {
            data = await response.json();
            if (data.message === "Seller fetched successfully") {
              setRole("2"); // Seller role
            }
          } else {
            // Both buyer and seller refresh failed
            const currentPath = window.location.pathname;
            if (
              !currentPath.includes("/admin") &&
              !currentPath.includes("/login-admin")
            ) {
              navigate("/login");
            }
            return;
          }
        }

        dispatch(addBasicInfo(data.data));
        console.log(data);
      } catch (error) {
        // Only redirect to login if we're not on admin pages
        const currentPath = window.location.pathname;
        if (
          !currentPath.includes("/admin") &&
          !currentPath.includes("/login-admin")
        ) {
          navigate("/login");
        }
        console.log("error verifying token");
        return;
      }
    };
    verifyToken();
  }, []);
  const HadleLogout = () => {
    if (isAdmin) {
      // Admin logout
      localStorage.removeItem("adminToken");
      localStorage.removeItem("adminRefreshToken");
      localStorage.removeItem("adminUser");
      localStorage.removeItem("adminRole");
      setAdminUser(null);
      setIsAdmin(false);
      // Trigger admin logout event
      window.dispatchEvent(new CustomEvent("adminLogout"));
      navigate("/login-admin");
    } else {
      // Regular user logout
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("role");
      navigate("/login");
    }
    setIsLogin(false);
  };
  return (
    <header className="header" ref={headerRef}>
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
            <NavLink to="/login-admin" className="nav-link">
              Admin
            </NavLink>
          </div>
        </nav>

        {/* Action Buttons (Right Side) */}
        <div className="action-buttons">
          {!isLogin ? (
            <NavLink
              to="/login"
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
              title={isAdmin ? "Admin Profile" : "User Profile"}
              role="img"
              aria-label={isAdmin ? "Admin Icon" : "User Icon"}
            >
              <Link
                to={
                  isAdmin
                    ? "admin-dashboard"
                    : role == 1
                    ? "buyer-profile"
                    : "seller-profile"
                }
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
              </Link>
              <button
                style={{
                  textDecoration: "none",
                  color: "#ffffffff",
                  padding: "10px 19px",
                  background: "black",
                  fontFamily: "uppercasefont",
                  borderRadius: "5px",
                  fontSize: "small",
                }}
                onClick={() => HadleLogout()}
              >
                Logout
              </button>
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
          <div className="mobile-menu-content">
            <NavLink
              to="/"
              className="mobile-nav-link"
              onClick={() => setIsOpen(false)}
            >
              Home
            </NavLink>
            <NavLink
              to="/products"
              className="mobile-nav-link"
              onClick={() => setIsOpen(false)}
            >
              Products
            </NavLink>
            <NavLink
              to="/about"
              className="mobile-nav-link"
              onClick={() => setIsOpen(false)}
            >
              About
            </NavLink>
            <NavLink
              to="/buyer"
              className="mobile-nav-link"
              onClick={() => setIsOpen(false)}
            >
              For buyer
            </NavLink>
            <NavLink
              to="/seller"
              className="mobile-nav-link"
              onClick={() => setIsOpen(false)}
            >
              For seller
            </NavLink>
            <NavLink
              to="/contact"
              className="mobile-nav-link"
              onClick={() => setIsOpen(false)}
            >
              Contact
            </NavLink>

            {/* Mobile Action Buttons */}
            <div className="mobile-action-buttons">
              {!isLogin ? (
                <NavLink
                  to="/login"
                  className="mobile-login-btn"
                  onClick={() => setIsOpen(false)}
                >
                  Sign-in/Register
                </NavLink>
              ) : (
                <div className="mobile-user-section">
                  <Link
                    to={
                      isAdmin
                        ? "admin-dashboard"
                        : role == 1
                        ? "buyer-profile"
                        : "seller-profile"
                    }
                    className="mobile-profile-link"
                    onClick={() => setIsOpen(false)}
                  >
                    {isAdmin ? "Admin Dashboard" : "Profile"}
                  </Link>
                  <button
                    className="mobile-logout-btn"
                    onClick={() => {
                      HadleLogout();
                      setIsOpen(false);
                    }}
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
