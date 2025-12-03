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
      { threshold: 0.3 }
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
    {
      step: "01",
      image: sellerregister,
    },
    {
      step: "02",
      image: productcatelog,
    },
    {
      step: "03",
      image: respondeinquires,
    },
    {
      step: "04",
      image: builddeals,
    },
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
          <div className="hero-content">
            <div className="hero-text">
              <h1>What can sellers do on SaathSource?</h1>
              <p className="hero-subtitle">
                Showcase your products to verified buyers worldwide. Expand your
                market reach, increase sales, and build lasting business
                relationships through our comprehensive B2B platform.
              </p>
              <button className="cta-button" onClick={handleSignUp}>
                Start Selling Today
              </button>
            </div>
            <div className="hero-image">
              <div className="hero-graphic">
                <img src={whatseller} alt="What can sellers do" className="hero-main-image" />
                <div className="question-marks">
                  <span className="question-mark q1">?</span>
                  <span className="question-mark q2">?</span>
                  <span className="question-mark q3">?</span>
                  <span className="question-mark q4">?</span>
                  <span className="question-mark q5">?</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Process Section */}
        <div className="process-section">
          <div className="section-header">
            <h2>Showcase, Manage and Respond</h2>
            <p className="section-subtitle">Streamlined Selling Experience</p>
          </div>

          <div className="steps-container">
            {sellerSteps.map((step, index) => (
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
            <h2>Why Choose SaathSource for Selling?</h2>
            <div className="benefits-grid">
              {sellerBenefits.map((benefit, index) => (
                <div key={index} className="benefit-item" ref={(el) => (benefitCardsRef.current[index] = el)}>
                  <div className="benefit-image">
                    <img src={benefit.image} alt={benefit.title} />
                  </div>
                  <h3>{benefit.title}</h3>
                  <p>{benefit.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Success Stories Section */}
        <div className="success-section">
          <div className="success-content">
            <h2>Success Stories</h2>
            <p className="section-subtitle">
              Join thousands of successful sellers on our platform
            </p>
            <div className="stats-grid">
              <div className="stat-item">
                <div className="stat-number" data-value="10000+" ref={(el) => (statNumbersRef.current[0] = el)}>0</div>
                <div className="stat-label">Active Sellers</div>
              </div>

              <div className="stat-item">
                <div className="stat-number" data-value="150+" ref={(el) => (statNumbersRef.current[1] = el)}>0</div>
                <div className="stat-label">Countries Reached</div>
              </div>
              <div className="stat-item">
                <div className="stat-number" data-value="95%" ref={(el) => (statNumbersRef.current[2] = el)}>0</div>
                <div className="stat-label">Customer Satisfaction</div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="cta-section">
          <div className="cta-content">
            <h2>Ready to Grow Your Business?</h2>
            <p>
              Join our community of successful sellers and start reaching buyers
              worldwide today.
            </p>
            <button className="cta-button large" onClick={handleSignUp}>
              Become a Seller
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default Seller;
