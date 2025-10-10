import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import "../../CSS/Buyer.css";
import buyerRegister from "../../assets/buyerRegister.png";
import productexploration from "../../assets/productexploration.png";
import querysubmission from "../../assets/querysubmission.png";
import communication from "../../assets/com.png";

function Buyer() {
  const navigate = useNavigate();
  const stepsRef = useRef([]);
  const { isLogin } = useSelector((state) => state.user);

  const handleSignUp = () => {
    // Check if user is already logged in
    const token = localStorage.getItem("token");
    const isLoggedIn = isLogin || token;

    if (isLoggedIn) {
      alert("You are already logged in!");
      return;
    }

    navigate("/buyerregister");
  };

  const buyerSteps = [
    { step: "01", image: buyerRegister },
    { step: "02", image: productexploration },
    { step: "03", image: querysubmission },
    { step: "04", image: communication },
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      { threshold: 0.3 }
    );

    stepsRef.current.forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => {
      stepsRef.current.forEach((el) => {
        if (el) observer.unobserve(el);
      });
    };
  }, []);

  return (
    <div className="buyer-container">
      {/* Hero Section */}
      <div className="buyer-hero">
        <div className="hero-content">
          <div className="hero-text">
            <h1>What can buyers do on SaathSource?</h1>
            <p className="hero-subtitle">
              Get in touch with verified sellers. Save valuable time, money and
              effort discovering verified suppliers on SaathSource. Share your
              requirements with us and we'll connect you with the best supplier
              directly.
            </p>
            <button className="cta-button" onClick={handleSignUp}>
              Sign up for Free
            </button>
          </div>
          <div className="hero-image">
            <div className="hero-graphic">
              <div className="floating-card card-1">
                <span className="card-icon">💊</span>
                <span className="card-text">Pharmaceuticals</span>
              </div>
              <div className="floating-card card-2">
                <span className="card-icon">🏥</span>
                <span className="card-text">Healthcare</span>
              </div>
              <div className="floating-card card-3">
                <span className="card-icon">🔬</span>
                <span className="card-text">Medical Equipment</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Process Section */}
      <div className="process-section">
        <div className="section-header">
          <h2>Search, Discover and Procure Products</h2>
          <p className="section-subtitle">
            Connecting with the Right Suppliers
          </p>
        </div>

        <div className="steps-container">
          {buyerSteps.map((step, index) => (
            <div
              key={index}
              ref={(el) => (stepsRef.current[index] = el)}
              className={`step-card ${
                index % 2 === 0 ? "left-align" : "right-align"
              }`}
            >
              <div className="step-number">{step.step}</div>
              <div className="step-image">
                <img src={step.image} alt={`Step ${step.step}`} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Benefits Section */}
      <div className="benefits-section">
        <div className="benefits-content">
          <h2>Why Choose SaathSource?</h2>
          <div className="benefits-grid">
            <div className="benefit-item">
              <div className="benefit-icon">⚡</div>
              <h3>Save Time</h3>
              <p>
                Quick access to verified suppliers without endless searching
              </p>
            </div>
            <div className="benefit-item">
              <div className="benefit-icon">💰</div>
              <h3>Save Money</h3>
              <p>Multiple sellers available, More quantity - more discount</p>
            </div>
            <div className="benefit-item">
              <div className="benefit-icon">🛡️</div>
              <h3>Verified Suppliers</h3>
              <p>All sellers are verified and trusted partners</p>
            </div>
            <div className="benefit-item">
              <div className="benefit-icon">📞</div>
              <h3>Direct Communication</h3>
              <p>Connect directly with suppliers for better negotiations</p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="cta-section">
        <div className="cta-content">
          <h2>Ready to Start Your Journey?</h2>
          <p>
            Join thousands of buyers who trust SaathSource for their
            pharmaceutical and healthcare needs.
          </p>
          <button className="cta-button large" onClick={handleSignUp}>
            Get Started Today
          </button>
        </div>
      </div>
    </div>
  );
}

export default Buyer;
