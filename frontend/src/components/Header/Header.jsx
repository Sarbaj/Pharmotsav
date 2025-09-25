import { useState, useEffect } from "react";
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
  const { UserInfo } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  useEffect(() => {
    if (UserInfo && UserInfo.length > 0) {
      setIsLogin(true);
      console.log(UserInfo[0].messege);
    }
  }, [UserInfo]);
  useEffect(() => {
    const verifyToken = async () => {
      try {
        const token = localStorage.getItem("refreshToken");
        console.log(token);

        if (!token) return;

        const response = await fetch(
          "http://localhost:4000/api/v1/buyers/login-after-refresh",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ refreshToken: token }),
          }
        );

        if (!response.ok) return;

        const data = await response.json();
        dispatch(addBasicInfo(data.data));
        console.log(data);
        if (data.message == "Buyer fetched successfully") {
          setRole("1");
        }
      } catch (error) {
        console.log("error verifying token");
      }
    };
    verifyToken();
  }, []);
  const HadleLogout = () => {
    alert("Logout");
    localStorage.removeItem("refreshToken");
    navigate(`/login`);
    setIsLogin(false);
    // const verifyToken = async () => {
    //   try {
    //     const response = await fetch(
    //       "http://localhost:4000/api/v1/buyers/logout-buyer",
    //       {
    //         method: "POST",
    //         headers: { "Content-Type": "application/json" },
    //         body: JSON.stringify({}),
    //       }
    //     );

    //     if (!response.ok) return;

    //     const data = await response.json();

    //     console.log(data);
    //   } catch (error) {
    //     console.log("error Logout");
    //   }
    // };
    // verifyToken();
  };
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
              title="User Profile"
              role="img"
              aria-label="User Icon"
            >
              <Link to={role == 1 ? "buyer-profile" : "seller-profile"}>
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
