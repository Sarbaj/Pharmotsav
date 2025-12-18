import React from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "../../CSS/Seller.css";
import "../../CSS/Buyer.css";
import { useEffect, useRef } from "react";

gsap.registerPlugin(ScrollTrigger);

import sellerregister from "../../assets/seller-image.png";
import productcatelog from "../../assets/productcatelog.png";
import respondeinquires from "../../assets/respondeinquires.png";
import builddeals from "../../assets/builddeals.png";
import sellerRegisterVideo from "../../assets/video/seller/seller-register.mp4";
import addProductVideo from "../../assets/video/seller/add-product.mp4";
import getBuyerVideo from "../../assets/video/seller/get-buyer.mp4";
import step4Video from "../../assets/video/seller/step-4.mp4";
import whatseller from "../../assets/whatseller.png";
import globalreach from "../../assets/globalreach.webp";
import sales from "../../assets/sales.webp";
import timee from "../../assets/timee.webp";
import varibuyer from "../../assets/varibuyer.webp";
function Seller() {
  const stepsRef = useRef([]);
  const benefitCardsRef = useRef([]);
  const statNumbersRef = useRef([]);

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

    // Animated counting for stats
    statNumbersRef.current.forEach((stat, index) => {
      if (stat) {
        const finalValue = stat.getAttribute('data-value');
        const isPercentage = finalValue.includes('%');
        const hasPlus = finalValue.includes('+');
        const numericValue = parseInt(finalValue.replace(/[^0-9]/g, ''));
        
        const counter = { value: 0 };
        
        gsap.to(counter, {
          value: numericValue,
          scrollTrigger: {
            trigger: stat,
            start: "top 85%",
            toggleActions: "play none none none",
          },
          duration: 2.5,
          delay: index * 0.3,
          ease: "power2.out",
          onUpdate: function() {
            const currentValue = Math.floor(counter.value);
            if (isPercentage) {
              stat.textContent = currentValue + '%';
            } else if (numericValue >= 1000) {
              const thousands = Math.floor(currentValue / 1000);
              const remainder = currentValue % 1000;
              if (remainder === 0) {
                stat.textContent = thousands + ',000' + (hasPlus ? '+' : '');
              } else {
                stat.textContent = thousands + ',' + remainder.toString().padStart(3, '0') + (hasPlus ? '+' : '');
              }
            } else {
              stat.textContent = currentValue + (hasPlus ? '+' : '');
            }
          },
          onComplete: function() {
            // Ensure final value is displayed correctly
            stat.textContent = finalValue;
          }
        });
      }
    });

    return () => {
      stepsRef.current.forEach((el) => {
        if (el) observer.unobserve(el);
      });
    };
  }, []);

  const navigate = useNavigate();
  const { isLogin } = useSelector((state) => state.user);

  const handleSignUp = () => {
    // Check if user is already logged in
    const token = localStorage.getItem("token");
    const isLoggedIn = isLogin || token;

    if (isLoggedIn) {
      alert("You are already logged in!");
      return;
    }

    navigate("/sellerregister");
  };

  const sellerSteps = [
    { step: "01", image: sellerregister, video: sellerRegisterVideo, title: "Register as Seller", description: "Create your seller account and set up your business profile" },
    { step: "02", image: productcatelog, video: addProductVideo, title: "Add Products", description: "Upload your product catalog and manage inventory" },
    { step: "03", image: respondeinquires, video: getBuyerVideo, title: "Get Buyers", description: "Receive and respond to buyer inquiries" },
    { step: "04", image: builddeals, video: step4Video, title: "Build Deals", description: "Negotiate and close deals with potential buyers" },
  ];

  const sellerFeatures = [
    {
      title: "Product Management",
      description:
        "Easily manage your product catalog with bulk upload, inventory tracking, and automated pricing updates.",
      icon: "📊",
    },
    {
      title: "Analytics Dashboard",
      description:
        "Track your performance with detailed analytics on views, inquiries, and conversion rates.",
      icon: "📈",
    },
    {
      title: "Lead Management",
      description:
        "Organize and follow up with potential buyers through our integrated CRM system.",
      icon: "🎯",
    },
    {
      title: "Secure Payments",
      description:
        "Process payments securely with our integrated payment gateway and escrow services.",
      icon: "🔒",
    },
  ];

  const sellerBenefits = [
    {
      image: globalreach,
      title: "Global Reach",
      description:
        "Access buyers from around the world and expand your market presence internationally",
    },
    {
      image: sales,
      title: "Increased Sales",
      description:
        "Boost your sales with our platform's advanced matching algorithms and buyer discovery",
    },
    {
      image: timee,
      title: "Time Efficient",
      description:
        "Save time with automated lead generation and streamlined communication tools",
    },
    {
      image: varibuyer,
      title: "Verified Buyers",
      description:
        "Connect only with verified and serious buyers to ensure quality business relationships",
    },
  ];

  return (
    <>
      <div className="seller-container">
        {/* Hero Section */}
        <div className="seller-hero">
          <div className="seller-hero-content">
            <div className="seller-hero-text">
              <h1 className="seller-hero-title">What can <span className="seller-highlight">sellers</span> do on SaathSource?</h1>
              <p className="seller-hero-subtitle">
                Showcase your products to verified buyers worldwide. Expand your
                market reach, increase sales, and build lasting business
                relationships through our comprehensive B2B platform.
              </p>
              
              {/* Mobile Hero Graphic - shown between subtitle and CTA */}
              <div className="seller-hero-image-mobile">
                <div className="seller-hero-graphic">
                  <img src={whatseller} alt="What can sellers do" className="seller-hero-main-image" />
                  <div className="seller-question-marks">
                    <span className="seller-question-mark q1">?</span>
                    <span className="seller-question-mark q2">?</span>
                    <span className="seller-question-mark q3">?</span>
                    <span className="seller-question-mark q4">?</span>
                    <span className="seller-question-mark q5">?</span>
                  </div>
                </div>
              </div>
              
              <button className="seller-cta-button" onClick={handleSignUp}>
                Start Selling Today
              </button>
            </div>
            
            {/* Desktop Hero Graphic */}
            <div className="seller-hero-image seller-hero-image-desktop">
              <div className="seller-hero-graphic">
                <img src={whatseller} alt="What can sellers do" className="seller-hero-main-image" />
                <div className="seller-question-marks">
                  <span className="seller-question-mark q1">?</span>
                  <span className="seller-question-mark q2">?</span>
                  <span className="seller-question-mark q3">?</span>
                  <span className="seller-question-mark q4">?</span>
                  <span className="seller-question-mark q5">?</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Process Section */}
        <div className="seller-process-section">
          <div className="seller-section-header">
            <h2 className="seller-section-title">Showcase, Manage and Respond</h2>
            <p className="seller-section-subtitle">Streamlined Selling Experience</p>
          </div>

          <div className="seller-steps-container">
            {sellerSteps.map((step, index) => (
              <div
                key={index}
                ref={(el) => (stepsRef.current[index] = el)}
                className={`seller-step-card ${
                  index % 2 === 0 ? "left-align" : "right-align"
                }`}
              >
                <div className="seller-step-number">{step.step}</div>
                
                {/* Image - smaller size */}
                <div className="seller-step-image">
                  <img src={step.image} alt={`Step ${step.step}`} />
                </div>
                
                {/* Video - larger size, opposite side */}
                <div className="seller-step-video">
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
        <div className="seller-benefits-section">
          <div className="seller-benefits-content">
            <h2 className="seller-benefits-title">Why Choose SaathSource for Selling?</h2>
            <div className="seller-benefits-grid">
              <div className="seller-benefit-item" ref={(el) => (benefitCardsRef.current[0] = el)}>
                <div className="seller-benefit-icon">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                  </svg>
                </div>
                <h3>Global Reach</h3>
                <p>Access buyers from around the world and expand your market presence internationally</p>
              </div>
              
              <div className="seller-benefit-item" ref={(el) => (benefitCardsRef.current[1] = el)}>
                <div className="seller-benefit-icon">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M7,15H9C9,16.08 10.37,17 12,17C13.63,17 15,16.08 15,15C15,13.9 13.96,13.5 11.76,12.97C9.64,12.44 7,11.78 7,9C7,7.21 8.47,5.69 10.5,5.18V3H13.5V5.18C15.53,5.69 17,7.21 17,9H15C15,7.92 13.63,7 12,7C10.37,7 9,7.92 9,9C9,10.1 10.04,10.5 12.24,11.03C14.36,11.56 17,12.22 17,15C17,16.79 15.53,18.31 13.5,18.82V21H10.5V18.82C8.47,18.31 7,16.79 7,15Z"/>
                  </svg>
                </div>
                <h3>Increased Sales</h3>
                <p>Boost your sales with our platform's advanced matching algorithms and buyer discovery</p>
              </div>
              
              <div className="seller-benefit-item" ref={(el) => (benefitCardsRef.current[2] = el)}>
                <div className="seller-benefit-icon">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M15,1H9V3H15M19,8H17V3H15V8H9V3H7V8H5A2,2 0 0,0 3,10V20A2,2 0 0,0 5,22H19A2,2 0 0,0 21,20V10A2,2 0 0,0 19,8Z"/>
                  </svg>
                </div>
                <h3>Time Efficient</h3>
                <p>Save time with automated lead generation and streamlined communication tools</p>
              </div>
              
              <div className="seller-benefit-item" ref={(el) => (benefitCardsRef.current[3] = el)}>
                <div className="seller-benefit-icon">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/>
                  </svg>
                </div>
                <h3>Verified Buyers</h3>
                <p>Connect only with verified and serious buyers to ensure quality business relationships</p>
              </div>
            </div>
          </div>
        </div>

        {/* Success Stories Section */}
        <div className="seller-success-section">
          <div className="seller-success-content">
            <h2 className="seller-success-title">Success Stories</h2>
            <p className="seller-success-subtitle">
              Join thousands of successful sellers on our platform
            </p>
            <div className="seller-stats-grid">
              <div className="seller-stat-item">
                <div className="seller-stat-number" data-value="10000+" ref={(el) => (statNumbersRef.current[0] = el)}>0</div>
                <div className="seller-stat-label">Active Sellers</div>
              </div>

              <div className="seller-stat-item">
                <div className="seller-stat-number" data-value="150+" ref={(el) => (statNumbersRef.current[1] = el)}>0</div>
                <div className="seller-stat-label">Countries Reached</div>
              </div>
              <div className="seller-stat-item">
                <div className="seller-stat-number" data-value="95%" ref={(el) => (statNumbersRef.current[2] = el)}>0</div>
                <div className="seller-stat-label">Customer Satisfaction</div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="seller-cta-section">
          <div className="seller-cta-content">
            <h2 className="seller-cta-title">Ready to Grow Your Business?</h2>
            <p className="seller-cta-text">
              Join our community of successful sellers and start reaching buyers
              worldwide today.
            </p>
            <button className="seller-cta-button large" onClick={handleSignUp}>
              Become a Seller
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default Seller;
