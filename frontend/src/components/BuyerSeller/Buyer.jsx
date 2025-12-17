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
import buyerRegisterVideo from "../../assets/video/buyer/buyer-register.mp4";
import productSearchVideo from "../../assets/video/buyer/productsearch.mp4";
import makeInquireVideo from "../../assets/video/buyer/make-inquire.mp4";
import seeSellerVideo from "../../assets/video/buyer/see-seller.mp4";
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
    { step: "01", image: buyerRegister, video: buyerRegisterVideo, title: "Register as Buyer", description: "Create your account and set up your buyer profile" },
    { step: "02", image: productexploration, video: productSearchVideo, title: "Search Products", description: "Browse and search for pharmaceutical products" },
    { step: "03", image: querysubmission, video: makeInquireVideo, title: "Make Inquiry", description: "Submit inquiries to suppliers for products" },
    { step: "04", image: communication, video: seeSellerVideo, title: "Connect with Sellers", description: "View seller details and communicate directly" },
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
              
              {/* Image - smaller size */}
              <div className="buyer-step-image">
                <img src={step.image} alt={`Step ${step.step}`} />
              </div>
              
              {/* Video - larger size, opposite side */}
              <div className="buyer-step-video">
                <video 
                  autoPlay 
                  loop 
                  muted 
                  playsInline
                  className="step-video"
                >
                  <source src={step.video} type="video/mp4" />
                </video>
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
              <div className="buyer-benefit-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M15,1H9V3H15M19,8H17V3H15V8H9V3H7V8H5A2,2 0 0,0 3,10V20A2,2 0 0,0 5,22H19A2,2 0 0,0 21,20V10A2,2 0 0,0 19,8Z"/>
                </svg>
              </div>
              <h3>Save Time</h3>
              <p>Quick access to verified suppliers without endless searching</p>
            </div>
            <div
              className="buyer-benefit-item"
              ref={(el) => (benefitCardsRef.current[1] = el)}
            >
              <div className="buyer-benefit-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M7,15H9C9,16.08 10.37,17 12,17C13.63,17 15,16.08 15,15C15,13.9 13.96,13.5 11.76,12.97C9.64,12.44 7,11.78 7,9C7,7.21 8.47,5.69 10.5,5.18V3H13.5V5.18C15.53,5.69 17,7.21 17,9H15C15,7.92 13.63,7 12,7C10.37,7 9,7.92 9,9C9,10.1 10.04,10.5 12.24,11.03C14.36,11.56 17,12.22 17,15C17,16.79 15.53,18.31 13.5,18.82V21H10.5V18.82C8.47,18.31 7,16.79 7,15Z"/>
                </svg>
              </div>
              <h3>Save Money</h3>
              <p>Multiple sellers available, More quantity - more discount</p>
            </div>
            <div
              className="buyer-benefit-item"
              ref={(el) => (benefitCardsRef.current[2] = el)}
            >
              <div className="buyer-benefit-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/>
                </svg>
              </div>
              <h3>Verified Suppliers</h3>
              <p>All sellers are verified and trusted partners</p>
            </div>
            <div
              className="buyer-benefit-item"
              ref={(el) => (benefitCardsRef.current[3] = el)}
            >
              <div className="buyer-benefit-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                </svg>
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
