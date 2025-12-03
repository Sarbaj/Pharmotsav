import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "../CSS/Home.css";

import img1 from "../IMGS/main1.png";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import healthcare from "../assets/healthcare.jpg";
import pharma from "../assets/pharma.jpg";
import network from "../assets/network.jpg";

gsap.registerPlugin(ScrollTrigger);

const Home = () => {
  const navigate = useNavigate();
  const { isLogin } = useSelector((state) => state.user);
  
  const heroTextRef = useRef(null);
  const heroButtonsRef = useRef(null);
  const floatingCardsRef = useRef([]);
  const trustItemsRef = useRef([]);
  const trustBadgesRef = useRef([]);
  const ctaRef = useRef(null);
  const ctaButtonsRef = useRef([]);

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

    // Hero buttons animation
    if (heroButtonsRef.current) {
      gsap.from(heroButtonsRef.current.children, {
        opacity: 0,
        scale: 0.8,
        duration: 0.6,
        stagger: 0.15,
        delay: 0.8,
        ease: "back.out(1.7)",
      });
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
  }, []);

  return (
    <>
    <div className="hero">
    {/* Hero Section */}
          <section className="hero-section">
            <div className="hero-content">
              <div className="hero-text" ref={heroTextRef}>
                <h1 className="hero-title">
                  Simplifying B2B Pharma Connections for
                  <span className="gradient-text"> Trusted & Efficient</span>{" "}
                  Business
                </h1>
                <p className="hero-subtitle">
                  Connect with verified suppliers and buyers worldwide through our
                  intelligent B2B marketplace designed for the pharmaceutical
                  industry.
                </p>
                <div className="hero-buttons" ref={heroButtonsRef}>
                  <button className="btn-primary">Get Started</button>
                  <button className="btn-secondary">Learn More</button>
                </div>
              </div>
              <div className="hero-visual">
                <div className="floating-cards">
                  <div className="card card-1" ref={(el) => (floatingCardsRef.current[0] = el)}>
                    <div className="card-icon"><img src={healthcare} alt="health" /></div>
                    <h3>Healthcare</h3>
                    <p>Verified suppliers</p>
                  </div>
                  <div className="card card-2" ref={(el) => (floatingCardsRef.current[1] = el)}>
                    <div className="card-icon"><img src={pharma} alt="health" /></div>
                    <h3>Pharmaceuticals</h3>
                    <p>Quality products</p>
                  </div>
                  <div className="card card-3" ref={(el) => (floatingCardsRef.current[2] = el)}>
                    <div className="card-icon"><img src={network} alt="health" /></div>
                    <h3>Global Network</h3>
                    <p>Worldwide reach</p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>

      {/* Trust Section */}
      <section className="home-trust">
        <div className="container">
          <div className="trust-content">
            <div className="trust-text">
              <h2 className="trust-title">Trusted by Leading Pharmaceutical Companies</h2>
              <p className="trust-description">
                Join the growing community of healthcare professionals and pharmaceutical businesses 
                who trust Saathsource for their B2B trading needs. Our platform ensures compliance, 
                quality, and transparency at every step.
              </p>
              <div className="trust-features">
                <div className="trust-item" ref={(el) => (trustItemsRef.current[0] = el)}>
                  <span className="trust-icon">✓</span>
                  <span>ISO Certified Platform</span>
                </div>
                <div className="trust-item" ref={(el) => (trustItemsRef.current[1] = el)}>
                  <span className="trust-icon">✓</span>
                  <span>GMP Compliant Suppliers</span>
                </div>
                <div className="trust-item" ref={(el) => (trustItemsRef.current[2] = el)}>
                  <span className="trust-icon">✓</span>
                  <span>Regulatory Approved</span>
                </div>
                <div className="trust-item" ref={(el) => (trustItemsRef.current[3] = el)}>
                  <span className="trust-icon">✓</span>
                  <span>Secure Data Protection</span>
                </div>
              </div>
            </div>
            <div className="trust-visual">
              <div className="trust-badge" ref={(el) => (trustBadgesRef.current[0] = el)}>
                <div className="badge-icon">🏆</div>
                <div className="badge-text">
                  <div className="badge-title">Industry Leader</div>
                  <div className="badge-subtitle">Since 2020</div>
                </div>
              </div>
              <div className="trust-badge" ref={(el) => (trustBadgesRef.current[1] = el)}>
                <div className="badge-icon">🔒</div>
                <div className="badge-text">
                  <div className="badge-title">Secure & Verified</div>
                  <div className="badge-subtitle">100% Protected</div>
                </div>
              </div>
              <div className="trust-badge" ref={(el) => (trustBadgesRef.current[2] = el)}>
                <div className="badge-icon">⭐</div>
                <div className="badge-text">
                  <div className="badge-title">4.9/5 Rating</div>
                  <div className="badge-subtitle">15K+ Reviews</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="home-cta">
        <div className="container">
          <div className="cta-content" ref={ctaRef}>
            <h2 className="cta-title">Ready to Transform Your Pharmaceutical Business?</h2>
            <p className="cta-description">
              Join thousands of businesses already using Saathsource to streamline their operations and expand their reach.
            </p>
            <div className="cta-buttons">
              <button className="btn-cta-primary" onClick={handleBuying} ref={(el) => (ctaButtonsRef.current[0] = el)}>Start Buying</button>
              <button className="btn-cta-secondary" onClick={handleSelling} ref={(el) => (ctaButtonsRef.current[1] = el)}>Start Selling</button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;
