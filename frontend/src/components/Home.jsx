import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "../CSS/Home.css";
import PillAnimation from "./PillAnimation";

import img1 from "../IMGS/main1.png";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import healthcare from "../assets/healthcare.jpg";
import pharma from "../assets/pharma.jpg";
import network from "../assets/network.jpg";
import hometablet from "../assets/hometablet.jpeg";
import homeback from "../assets/homeback.png";

gsap.registerPlugin(ScrollTrigger);

const Home = () => {
  const navigate = useNavigate();
  const { isLogin } = useSelector((state) => state.user);
  const [showLoader, setShowLoader] = useState(true);
  const [hasLoadedBefore, setHasLoadedBefore] = useState(false);

  const heroTextRef = useRef(null);
  const heroButtonsRef = useRef(null);
  const floatingCardsRef = useRef([]);
  const trustItemsRef = useRef([]);
  const trustBadgesRef = useRef([]);
  const ctaRef = useRef(null);
  const ctaButtonsRef = useRef([]);
  const b2bRef = useRef(null);
  const firstBRef = useRef(null);
  const secondBRef = useRef(null);

  const handleSelling = () => {
    // Check if user is already logged in
    const token = localStorage.getItem("token");
    const isLoggedIn = isLogin || token;

    if (isLoggedIn) {
      alert("You are already logged in!");
      return;
    }

    navigate("/sellerregister");
  };

  const handleBuying = () => {
    // Check if user is already logged in
    const token = localStorage.getItem("token");
    const isLoggedIn = isLogin || token;

    if (isLoggedIn) {
      alert("You are already logged in!");
      return;
    }

    navigate("/buyerregister");
  };

  useEffect(() => {
    // Hero text animation
    if (heroTextRef.current) {
      gsap.from(heroTextRef.current.children, {
        opacity: 0,
        y: 50,
        duration: 1,
        stagger: 0.2,
        ease: "power3.out",
      });
    }

    // B2B Flip Animation - After page loads
    if (b2bRef.current && firstBRef.current && secondBRef.current) {
      const numberRef = b2bRef.current.querySelector(".home-b2b-number");

      // Wait for initial animations to complete
      gsap.delayedCall(2, () => {
        // Create infinite loop animation
        const tl = gsap.timeline({ repeat: -1 });

        // Flip to GREEN - one after another
        tl.to(firstBRef.current, {
          rotationX: 360,
          color: "#10b981",
          duration: 0.5,
          ease: "power2.inOut",
        })
          .to(
            numberRef,
            {
              rotationX: 360,
              color: "#10b981",
              duration: 0.5,
              ease: "power2.inOut",
            },
            "-=0.2"
          )
          .to(
            secondBRef.current,
            {
              rotationX: 360,
              color: "#10b981",
              duration: 0.5,
              ease: "power2.inOut",
            },
            "-=0.2"
          )
          // Wait 2 seconds in green
          .to({}, { duration: 2 })
          // Flip back to BLUE - one after another
          .to(firstBRef.current, {
            rotationX: 720,
            color: "#3b82f6",
            duration: 0.5,
            ease: "power2.inOut",
          })
          .to(
            numberRef,
            {
              rotationX: 720,
              color: "#3b82f6",
              duration: 0.5,
              ease: "power2.inOut",
            },
            "-=0.2"
          )
          .to(
            secondBRef.current,
            {
              rotationX: 720,
              color: "#3b82f6",
              duration: 0.5,
              ease: "power2.inOut",
            },
            "-=0.2"
          )
          // Wait 2 seconds in blue before repeating
          .to({}, { duration: 2 });
      });
    }

    // Hero buttons animation
    if (heroButtonsRef.current) {
      gsap.fromTo(
        heroButtonsRef.current.children,
        {
          opacity: 0,
          scale: 0.8,
        },
        {
          opacity: 1,
          scale: 1,
          duration: 0.6,
          stagger: 0.15,
          delay: 0.8,
          ease: "back.out(1.7)",
        }
      );
    }

    // Validation marks animation
    const validationMarks = document.querySelector('.home-validation-marks');
    if (validationMarks) {
      const validationItems = validationMarks.querySelectorAll('.validation-item');
      gsap.fromTo(
        validationItems,
        {
          opacity: 0,
          y: 20,
          scale: 0.8,
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.5,
          stagger: 0.1,
          delay: 1.2,
          ease: "back.out(1.7)",
        }
      );
    }

    // Floating cards - staggered entrance with rotation
    floatingCardsRef.current.forEach((card, index) => {
      if (card) {
        gsap.from(card, {
          opacity: 0,
          scale: 0.5,
          rotation: -15,
          duration: 0.8,
          delay: 1 + index * 0.2,
          ease: "back.out(1.7)",
          onComplete: () => {
            // After entrance, start continuous floating animation
            gsap.to(card, {
              y: -15,
              duration: 2.5,
              repeat: -1,
              yoyo: true,
              ease: "sine.inOut",
              delay: index * 0.3,
            });
          },
        });
      }
    });

    // Trust and CTA animations will be initialized after pill animation completes
  }, []);

  // For testing - show pill animation every time
  // Comment out these lines later to show only once per session
  useEffect(() => {
    // const hasSeenPillAnimation = sessionStorage.getItem('hasSeenPillAnimation');
    // if (hasSeenPillAnimation) {
    //   setShowLoader(false);
    //   setHasLoadedBefore(true);
    // }
  }, []);

  const handleAnimationComplete = () => {
    setShowLoader(false);
    // sessionStorage.setItem('hasSeenPillAnimation', 'true');

    // Initialize GSAP animations after pill animation completes
    setTimeout(() => {
      initializeAnimations();
      ScrollTrigger.refresh();
    }, 100);
  };

  const initializeAnimations = () => {
    // Trust header animation
    const trustHeader = document.querySelector('.trust-header');
    if (trustHeader) {
      gsap.from(trustHeader.children, {
        scrollTrigger: {
          trigger: trustHeader,
          start: "top 85%",
          toggleActions: "play none none reverse",
        },
        opacity: 0,
        y: 30,
        duration: 0.8,
        stagger: 0.2,
        ease: "power3.out",
      });
    }

    // Trust main cards animation (enhanced)
    trustItemsRef.current.forEach((item, index) => {
      if (item) {
        // Card entrance animation
        gsap.from(item, {
          scrollTrigger: {
            trigger: item,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
          opacity: 0,
          y: 50,
          scale: 0.9,
          duration: 0.8,
          delay: index * 0.2,
          ease: "back.out(1.7)",
        });

        // Icon animation
        const icon = item.querySelector('.trust-card-icon');
        if (icon) {
          gsap.from(icon, {
            scrollTrigger: {
              trigger: item,
              start: "top 85%",
              toggleActions: "play none none reverse",
            },
            scale: 0,
            rotation: 180,
            duration: 0.6,
            delay: index * 0.2 + 0.3,
            ease: "back.out(2)",
          });
        }

        // Stat number animation
        const statNumber = item.querySelector('.stat-number');
        if (statNumber) {
          gsap.from(statNumber, {
            scrollTrigger: {
              trigger: item,
              start: "top 85%",
              toggleActions: "play none none reverse",
            },
            scale: 0,
            duration: 0.5,
            delay: index * 0.2 + 0.6,
            ease: "elastic.out(1, 0.5)",
          });
        }
      }
    });

    // Trust bottom cards animation (enhanced)
    trustBadgesRef.current.forEach((badge, index) => {
      if (badge) {
        // Card entrance animation
        gsap.from(badge, {
          scrollTrigger: {
            trigger: badge,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
          opacity: 0,
          x: index === 0 ? -50 : 50,
          rotation: index === 0 ? -5 : 5,
          duration: 0.8,
          delay: index * 0.3,
          ease: "power3.out",
        });

        // Animate list items for compliance card
        if (index === 0) {
          const complianceItems = badge.querySelectorAll('.compliance-item');
          complianceItems.forEach((item, itemIndex) => {
            gsap.from(item, {
              scrollTrigger: {
                trigger: badge,
                start: "top 85%",
                toggleActions: "play none none reverse",
              },
              opacity: 0,
              x: -20,
              duration: 0.5,
              delay: 0.5 + itemIndex * 0.1,
              ease: "power2.out",
            });
          });
        }

        // Animate monitoring stats for monitoring card
        if (index === 1) {
          const monitoringItems = badge.querySelectorAll('.monitoring-item');
          monitoringItems.forEach((item, itemIndex) => {
            gsap.from(item, {
              scrollTrigger: {
                trigger: badge,
                start: "top 85%",
                toggleActions: "play none none reverse",
              },
              opacity: 0,
              y: 20,
              duration: 0.5,
              delay: 0.5 + itemIndex * 0.15,
              ease: "power2.out",
            });
          });
        }
      }
    });

    // CTA buttons animation
    ctaButtonsRef.current.forEach((button, index) => {
      if (button) {
        gsap.from(button, {
          scrollTrigger: {
            trigger: button,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
          opacity: 0,
          scale: 0.8,
          rotation: -10,
          duration: 0.7,
          delay: index * 0.2,
          ease: "back.out(1.7)",
        });
      }
    });
  };

  return (
    <>
      {showLoader && !hasLoadedBefore && (
        <PillAnimation onComplete={handleAnimationComplete} />
      )}
      <div className="home-hero">
        {/* Scrolling Ticker */}
        <div className="home-ticker">
          <div className="home-ticker-content">
            <span>
              SaathSource • Connecting Global B2B Trade • SaathSource • Trusted
              Pharmaceutical Marketplace • SaathSource • Verified Suppliers
              Worldwide • SaathSource • Efficient Business Solutions •{" "}
            </span>
            <span>
              SaathSource • Connecting Global B2B Trade • SaathSource • Trusted
              Pharmaceutical Marketplace • SaathSource • Verified Suppliers
              Worldwide • SaathSource • Efficient Business Solutions •{" "}
            </span>
          </div>
        </div>

        {/* Hero Section */}
        <section className="home-hero-section" style={{backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.8), rgba(255, 255, 255, 0.8)), url(${homeback})`, backgroundSize: 'auto', backgroundPosition: 'center', backgroundRepeat: 'no-repeat'}}>
          <div className="home-hero-content">
            <div className="home-hero-text" ref={heroTextRef}>
              <p className="home-hero-badge">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12,1L3,5V11C3,16.55 6.84,21.74 12,23C17.16,21.74 21,16.55 21,11V5L12,1M10,17L6,13L7.41,11.59L10,14.17L16.59,7.58L18,9L10,17Z"/>
                </svg>
                Trusted by 2500+ Global Suppliers
              </p>
              <h1 className="home-hero-title">
                Simplifying{" "}
                <span className="home-b2b-container" ref={b2bRef}>
                  <span className="home-b2b-letter" ref={firstBRef}>
                    B
                  </span>
                  <span className="home-b2b-number">2</span>
                  <span className="home-b2b-letter" ref={secondBRef}>
                    B
                  </span>
                </span>{" "}
                Pharma Connections for
                <span className="home-gradient-text">
                  {" "}
                  Trusted & Efficient
                </span>{" "}
                Business
              </h1>
              <p className="home-hero-subtitle">
                Connect with verified suppliers and buyers worldwide through our
                intelligent B2B marketplace designed for the pharmaceutical
                industry.
              </p>

              {/* Hero Image for mobile - shown between description and buttons */}
              <div className="home-hero-visual-mobile">
                <div className="home-hero-image-mobile">
                  <img src={hometablet} alt="Pharmaceutical Products" className="home-tablet-image-mobile" />
                  
                  {/* Stat Cards for Mobile */}
                  <div className="home-stat-card-mobile home-stat-card-1-mobile">
                    <div className="home-stat-icon-mobile">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z"/>
                      </svg>
                    </div>
                    <div className="home-stat-content-mobile">
                      <span className="home-stat-number-mobile">$2.5B+</span>
                      <span className="home-stat-label-mobile">Annual Volume</span>
                    </div>
                  </div>
                  
                  <div className="home-stat-card-mobile home-stat-card-2-mobile">
                    <div className="home-stat-icon-mobile">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                      </svg>
                    </div>
                    <div className="home-stat-content-mobile">
                      <span className="home-stat-number-mobile">50+</span>
                      <span className="home-stat-label-mobile">Countries</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="home-hero-buttons" ref={heroButtonsRef}>
                <button
                  className="home-btn-primary"
                  onClick={() => navigate("/products")}
                >
                  View Products
                </button>
                <button
                  className="home-btn-secondary"
                  onClick={() => navigate("/about")}
                >
                  Learn More
                </button>
              </div>

              {/* Validation Marks */}
              <div className="home-validation-marks">
                <div className="validation-item">
                  <div className="validation-icon">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                    </svg>
                  </div>
                  <span>Verified Suppliers</span>
                </div>
                <div className="validation-item">
                  <div className="validation-icon">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                    </svg>
                  </div>
                  <span>Verified Buyers</span>
                </div>
                <div className="validation-item">
                  <div className="validation-icon">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                    </svg>
                  </div>
                  <span>Global Sourcing</span>
                </div>
              </div>
            </div>
            <div className="home-hero-visual home-hero-visual-desktop">
              {/* Temporarily commented out cards - replaced with video */}
              {/* <div className="home-floating-cards">
                <div
                  className="home-card home-card-1"
                  ref={(el) => (floatingCardsRef.current[0] = el)}
                >
                  <div className="home-card-icon">
                    <img src={healthcare} alt="health" />
                  </div>
                  <h3>Healthcare</h3>
                  <p>Verified suppliers</p>
                </div>
                <div
                  className="home-card home-card-2"
                  ref={(el) => (floatingCardsRef.current[1] = el)}
                >
                  <div className="home-card-icon">
                    <img src={pharma} alt="health" />
                  </div>
                  <h3>Pharmaceuticals</h3>
                  <p>Quality products</p>
                </div>
                <div
                  className="home-card home-card-3"
                  ref={(el) => (floatingCardsRef.current[2] = el)}
                >
                  <div className="home-card-icon">
                    <img src={network} alt="health" />
                  </div>
                  <h3>Global Network</h3>
                  <p>Worldwide reach</p>
                </div>
              </div> */}

              {/* Hero Image with Stats */}
              <div className="home-hero-image">
                <img src={hometablet} alt="Pharmaceutical Products" className="home-tablet-image" />
                
                {/* Stat Cards */}
                <div className="home-stat-card home-stat-card-1">
                  <div className="home-stat-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z"/>
                    </svg>
                  </div>
                  <div className="home-stat-content">
                    <span className="home-stat-number">$2.5B+</span>
                    <span className="home-stat-label">Annual Volume</span>
                  </div>
                </div>
                
                <div className="home-stat-card home-stat-card-2">
                  <div className="home-stat-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                    </svg>
                  </div>
                  <div className="home-stat-content">
                    <span className="home-stat-number">50+</span>
                    <span className="home-stat-label">Countries</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Trust & Compliance Section */}
      <section className="home-trust">
        <div className="home-container">
          {/* Header */}
          <div className="trust-header">
            <div className="trust-badge">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12,1L3,5V11C3,16.55 6.84,21.74 12,23C17.16,21.74 21,16.55 21,11V5L12,1M10,17L6,13L7.41,11.59L10,14.17L16.59,7.58L18,9L10,17Z"/>
              </svg>
              Compliance & Security
            </div>
            <h2 className="trust-title">Trust & Compliance</h2>
            <p className="trust-description">
              Built to meet the highest standards of pharmaceutical industry regulations and quality 
              assurance. Every transaction is backed by enterprise-grade security.
            </p>
          </div>

          {/* Main Feature Cards */}
          <div className="trust-main-cards">
            <div className="trust-card" ref={(el) => (trustItemsRef.current[0] = el)}>
              <div className="trust-card-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
              </div>
              <h3>Quality Assurance</h3>
              <p>All suppliers undergo rigorous verification processes and continuous quality monitoring.</p>
              <div className="trust-card-stat">
                <span className="stat-number">98.8%</span>
                <span className="stat-label">Compliance Rate</span>
              </div>
            </div>

            <div className="trust-card" ref={(el) => (trustItemsRef.current[1] = el)}>
              <div className="trust-card-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/>
                </svg>
              </div>
              <h3>Regulatory Compliance</h3>
              <p>Full compliance with FDA, EMA, WHO-GMP, and other international pharmaceutical standards.</p>
              <div className="trust-card-stat">
                <span className="stat-number">50+</span>
                <span className="stat-label">Certifications</span>
              </div>
            </div>

            <div className="trust-card" ref={(el) => (trustItemsRef.current[2] = el)}>
              <div className="trust-card-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12,17A2,2 0 0,0 14,15C14,13.89 13.1,13 12,13A2,2 0 0,0 10,15A2,2 0 0,0 12,17M18,8A2,2 0 0,1 20,10V20A2,2 0 0,1 18,22H6A2,2 0 0,1 4,20V10C4,8.89 4.9,8 6,8H7V6A5,5 0 0,1 12,1A5,5 0 0,1 17,6V8H18M12,3A3,3 0 0,0 9,6V8H15V6A3,3 0 0,0 12,3Z"/>
                </svg>
              </div>
              <h3>Secure Platform</h3>
              <p>Enterprise-grade security with encrypted transactions and data protection protocols.</p>
              <div className="trust-card-stat">
                <span className="stat-number">ISO 27001</span>
                <span className="stat-label">Certified</span>
              </div>
            </div>
          </div>

          {/* Bottom Cards */}
          <div className="trust-bottom-cards">
            <div className="trust-bottom-card dark" ref={(el) => (trustBadgesRef.current[0] = el)}>
              <h3>Global Standards</h3>
              <p>We maintain compliance with international pharmaceutical regulations across all markets.</p>
              <div className="compliance-list">
                <div className="compliance-item">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                  </svg>
                  <span>FDA Approved</span>
                </div>
                <div className="compliance-item">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                  </svg>
                  <span>EMA Certified</span>
                </div>
                <div className="compliance-item">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                  </svg>
                  <span>WHO-GMP</span>
                </div>
                <div className="compliance-item">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                  </svg>
                  <span>ISO 9001</span>
                </div>
              </div>
            </div>

            <div className="trust-bottom-card light" ref={(el) => (trustBadgesRef.current[1] = el)}>
              <h3>24/7 Monitoring</h3>
              <p>Real-time compliance monitoring and quality assurance across all transactions.</p>
              <div className="monitoring-stats">
                <div className="monitoring-item">
                  <span className="monitoring-label">Active Monitoring</span>
                  <span className="monitoring-value">24/7</span>
                </div>
                <div className="monitoring-item">
                  <span className="monitoring-label">Response Time</span>
                  <span className="monitoring-value">&lt; 2 mins</span>
                </div>
                <div className="monitoring-item">
                  <span className="monitoring-label">Uptime</span>
                  <span className="monitoring-value">99.99%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="home-cta">
        <div className="home-container">
          <div className="home-cta-content" ref={ctaRef}>
            <h2 className="home-cta-title">
              Ready to Transform Your Pharmaceutical Business?
            </h2>
            <p className="home-cta-description">
              Join thousands of businesses already using Saathsource to
              streamline their operations and expand their reach.
            </p>
            <div className="home-cta-buttons">
              <button
                className="home-btn-cta-primary"
                onClick={handleBuying}
                ref={(el) => (ctaButtonsRef.current[0] = el)}
              >
                Start Buying
              </button>
              <button
                className="home-btn-cta-secondary"
                onClick={handleSelling}
                ref={(el) => (ctaButtonsRef.current[1] = el)}
              >
                Start Selling
              </button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;
