import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import "../../CSS/Buyer.css";
import buyerRegister from "../../assets/buyerRegister.png";
import productexploration from "../../assets/productexploration.png";
import querysubmission from "../../assets/querysubmission.png";
import communication from "../../assets/com.png";
import savetime from "../../assets/savetime.webp";
import savemoney from "../../assets/savemoney.webp";
import verified from "../../assets/verified.webp";
import direct from "../../assets/direct.webp";
import whatbuy from "../../assets/wahtbuy.png";

gsap.registerPlugin(ScrollTrigger);

function Buyer() {
  const navigate = useNavigate();
  const stepsRef = useRef([]);
  const benefitCardsRef = useRef([]);
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
      { threshold: 0.2, rootMargin: "0px 0px -50px 0px" }
    );

    stepsRef.current.forEach((el) => {
      if (el) observer.observe(el);
    });

    // Benefit cards GSAP animation
    benefitCardsRef.current.forEach((card, index) => {
      if (card) {
        gsap.from(card, {
          scrollTrigger: {
            trigger: card,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
          opacity: 0,
          scale: 0.9,
          y: 30,
          duration: 0.6,
          delay: index * 0.15,
          ease: "power2.out",
        });
      }
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
        <div className="buyer-hero-content">
          <div className="buyer-hero-text">
            <h1 className="buyer-hero-title">What can <span className="buyer-highlight">buyers</span> do on SaathSource?</h1>
            <p className="buyer-hero-subtitle">
              Get in touch with verified sellers. Save valuable time, money and
              effort discovering verified suppliers on SaathSource. Share your
              requirements with us and we'll connect you with the best supplier
              directly.
            </p>
            
            {/* Mobile Hero Graphic - shown between subtitle and CTA */}
            <div className="buyer-hero-image-mobile">
              <div className="buyer-hero-graphic">
                <img
                  src={whatbuy}
                  alt="What can buyers do"
                  className="buyer-hero-main-image"
                />
                <div className="buyer-question-marks">
                  <span className="buyer-question-mark q1">?</span>
                  <span className="buyer-question-mark q2">?</span>
                  <span className="buyer-question-mark q3">?</span>
                  <span className="buyer-question-mark q4">?</span>
                  <span className="buyer-question-mark q5">?</span>
                </div>
              </div>
            </div>
            
            <button className="buyer-cta-button" onClick={handleSignUp}>
              Sign up for Free
            </button>
          </div>
          
          {/* Desktop Hero Graphic */}
          <div className="buyer-hero-image buyer-hero-image-desktop">
            <div className="buyer-hero-graphic">
              <img
                src={whatbuy}
                alt="What can buyers do"
                className="buyer-hero-main-image"
              />
              <div className="buyer-question-marks">
                <span className="buyer-question-mark q1">?</span>
                <span className="buyer-question-mark q2">?</span>
                <span className="buyer-question-mark q3">?</span>
                <span className="buyer-question-mark q4">?</span>
                <span className="buyer-question-mark q5">?</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Process Section */}
      <div className="buyer-process-section">
        <div className="buyer-section-header">
          <h2 className="buyer-section-title">Search, Discover and Procure Products</h2>
          <p className="buyer-section-subtitle">
            Connecting with the Right Suppliers
          </p>
        </div>

        <div className="buyer-steps-container">
          {buyerSteps.map((step, index) => (
            <div
              key={index}
              ref={(el) => (stepsRef.current[index] = el)}
              className={`buyer-step-card ${
                index % 2 === 0 ? "left-align" : "right-align"
              }`}
            >
              <div className="buyer-step-number">{step.step}</div>
              <div className="buyer-step-image">
                <img src={step.image} alt={`Step ${step.step}`} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Benefits Section */}
      <div className="buyer-benefits-section">
        <div className="buyer-benefits-content">
          <h2 className="buyer-benefits-title">Why Choose SaathSource?</h2>
          <div className="buyer-benefits-grid">
            <div
              className="buyer-benefit-item"
              ref={(el) => (benefitCardsRef.current[0] = el)}
            >
              <div className="buyer-benefit-image">
                <img src={savetime} alt="Save Time" />
              </div>
              <h3>Save Time</h3>
              <p>
                Quick access to verified suppliers without endless searching
              </p>
            </div>
            <div
              className="buyer-benefit-item"
              ref={(el) => (benefitCardsRef.current[1] = el)}
            >
              <div className="buyer-benefit-image">
                <img src={savemoney} alt="Save Money" />
              </div>
              <h3>Save Money</h3>
              <p>Multiple sellers available, More quantity - more discount</p>
            </div>
            <div
              className="buyer-benefit-item"
              ref={(el) => (benefitCardsRef.current[2] = el)}
            >
              <div className="buyer-benefit-image">
                <img src={verified} alt="Verified Suppliers" />
              </div>
              <h3>Verified Suppliers</h3>
              <p>All sellers are verified and trusted partners</p>
            </div>
            <div
              className="buyer-benefit-item"
              ref={(el) => (benefitCardsRef.current[3] = el)}
            >
              <div className="buyer-benefit-image">
                <img src={direct} alt="Direct Communication" />
              </div>
              <h3>Direct Communication</h3>
              <p>Connect directly with suppliers for better negotiations</p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="buyer-cta-section">
        <div className="buyer-cta-content">
          <h2 className="buyer-cta-title">Ready to Start Your Journey?</h2>
          <p className="buyer-cta-text">
            Join thousands of buyers who trust SaathSource for their
            pharmaceutical and healthcare needs.
          </p>
          <button className="buyer-cta-button large" onClick={handleSignUp}>
            Get Started Today
          </button>
        </div>
      </div>
    </div>
  );
}

export default Buyer;
