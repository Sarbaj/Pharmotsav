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
import loopVideo from "../assets/video/loopss.mp4";

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
    // Trust items animation
    trustItemsRef.current.forEach((item, index) => {
      if (item) {
        gsap.from(item, {
          scrollTrigger: {
            trigger: item,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
          opacity: 0,
          x: -30,
          duration: 0.6,
          delay: index * 0.1,
          ease: "power2.out",
        });
      }
    });

    // Trust badges animation
    trustBadgesRef.current.forEach((badge, index) => {
      if (badge) {
        gsap.from(badge, {
          scrollTrigger: {
            trigger: badge,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
          opacity: 0,
          x: 50,
          rotation: 5,
          duration: 0.7,
          delay: index * 0.15,
          ease: "power3.out",
        });
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
        <section className="home-hero-section">
          <div className="home-hero-content">
            <div className="home-hero-text" ref={heroTextRef}>
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

              {/* Cards for mobile - shown between description and buttons */}
              <div className="home-hero-visual-mobile">
                <div className="home-floating-cards">
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
                      <img src={pharma} alt="pharma" />
                    </div>
                    <h3>Pharmaceuticals</h3>
                    <p>Quality products</p>
                  </div>
                  <div
                    className="home-card home-card-3"
                    ref={(el) => (floatingCardsRef.current[2] = el)}
                  >
                    <div className="home-card-icon">
                      <img src={network} alt="network" />
                    </div>
                    <h3>Global Network</h3>
                    <p>Worldwide reach</p>
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

              {/* Video replacement */}
              <div className="home-hero-video">
                <video
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="home-video-player"
                  src={loopVideo}
                  onError={(e) => {
                    console.error("Video error:", e);
                    console.error("Video src:", e.target.src);
                  }}
                  onLoadStart={() => console.log("Video loading started")}
                  onCanPlay={() => console.log("Video can play")}
                  onLoadedData={() => console.log("Video loaded successfully")}
                >
                  Your browser does not support the video tag.
                </video>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Trust Section */}
      <section className="home-trust">
        <div className="home-container">
          <div className="home-trust-content">
            <div className="home-trust-text">
              <h2 className="home-trust-title">
                Trusted by Leading Pharmaceutical Companies
              </h2>
              <p className="home-trust-description">
                Join the growing community of healthcare professionals and
                pharmaceutical businesses who trust Saathsource for their B2B
                trading needs. Our platform ensures compliance, quality, and
                transparency at every step.
              </p>
              <div className="home-trust-features">
                <div
                  className="home-trust-item"
                  ref={(el) => (trustItemsRef.current[0] = el)}
                >
                  <span className="home-trust-icon">✓</span>
                  <span>ISO Certified Platform</span>
                </div>
                <div
                  className="home-trust-item"
                  ref={(el) => (trustItemsRef.current[1] = el)}
                >
                  <span className="home-trust-icon">✓</span>
                  <span>GMP Compliant Suppliers</span>
                </div>
                <div
                  className="home-trust-item"
                  ref={(el) => (trustItemsRef.current[2] = el)}
                >
                  <span className="home-trust-icon">✓</span>
                  <span>Regulatory Approved</span>
                </div>
                <div
                  className="home-trust-item"
                  ref={(el) => (trustItemsRef.current[3] = el)}
                >
                  <span className="home-trust-icon">✓</span>
                  <span>Secure Data Protection</span>
                </div>
              </div>
            </div>
            <div className="home-trust-visual">
              <div
                className="home-trust-badge"
                ref={(el) => (trustBadgesRef.current[0] = el)}
              >
                <div className="home-badge-icon">🏆</div>
                <div className="home-badge-text">
                  <div className="home-badge-title">Industry Leader</div>
                  <div className="home-badge-subtitle">Since 2020</div>
                </div>
              </div>
              <div
                className="home-trust-badge"
                ref={(el) => (trustBadgesRef.current[1] = el)}
              >
                <div className="home-badge-icon">🔒</div>
                <div className="home-badge-text">
                  <div className="home-badge-title">Secure & Verified</div>
                  <div className="home-badge-subtitle">100% Protected</div>
                </div>
              </div>
              <div
                className="home-trust-badge"
                ref={(el) => (trustBadgesRef.current[2] = el)}
              >
                <div className="home-badge-icon">⭐</div>
                <div className="home-badge-text">
                  <div className="home-badge-title">4.9/5 Rating</div>
                  <div className="home-badge-subtitle">15K+ Reviews</div>
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
