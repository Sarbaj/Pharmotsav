import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import "../CSS/Footer.css"; // Your CSS file path
import logo from "../IMGS/logo.png";

export default function Footer() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    setLoggedIn(true); // Simulated user logged in state
  }, []);

  const closeMenu = () => setMenuOpen(false);

  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Branding */}
        <div className="footer-branding">
          <img src={logo} alt="Saathsource Logo" className="footer-logo" />
          <h2 className="footer-title" style={{ color: "#2497fe" }}>
            Saath<span className="footer-title-highlight">source</span>
          </h2>
        </div>

        {/* Navigation */}
        <nav className="footer-navigation">
          <div className={`nav-links "nav-links-open"`}>
            {[
              { to: "/", label: "Home" },
              { to: "/products", label: "Products" },
              { to: "/about", label: "About" },
              { to: "/contact", label: "Contact" },
            ].map(({ to, label }) => (
              <NavLink
                style={{ color: "black  " }}
                key={to}
                to={to}
                className="nav-link"
                onClick={closeMenu}
              >
                {label}
              </NavLink>
            ))}
          </div>
        </nav>

        {/* User Action */}
        <div className="footer-actions">copyright @Saathsource</div>
      </div>
    </footer>
  );
}
