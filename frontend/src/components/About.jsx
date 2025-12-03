import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "../CSS/About.css";
import mission from "../assets/mission.jpg";
import vision from "../assets/vision.jpg";
import impact from "../assets/impact.jpg";
import realtime from "../assets/realtime.jpg";
import global from "../assets/global.jpg";
import fast from "../assets/fast.jpg";
import quality from "../assets/quality.jpg";

gsap.registerPlugin(ScrollTrigger);

function About() {
  const aboutCardsRef = useRef([]);
  const featureCardsRef = useRef([]);
  const introHighlightsRef = useRef([]);
  const introBadgeRef = useRef(null);
  const introTitleRef = useRef(null);
  const introDescRef = useRef(null);
  const aboutCtaRef = useRef(null);

  useEffect(() => {
    // Intro badge animation
    if (introBadgeRef.current) {
      gsap.from(introBadgeRef.current, {
        opacity: 0,
        y: -20,
        duration: 0.6,
        ease: "power2.out",
      });
    }

    // Intro title animation
    if (introTitleRef.current) {
      gsap.from(introTitleRef.current, {
        opacity: 0,
        y: 30,
        duration: 0.8,
        delay: 0.2,
        ease: "power3.out",
      });
    }

    // Intro description animation
    if (introDescRef.current) {
      gsap.from(introDescRef.current, {
        opacity: 0,
        y: 20,
        duration: 0.7,
        delay: 0.4,
        ease: "power2.out",
      });
    }

    // Intro highlights animation
    introHighlightsRef.current.forEach((item, index) => {
      if (item) {
        gsap.set(item, { opacity: 1, visibility: "visible" });
        gsap.from(item, {
          opacity: 0,
          y: 20,
          scale: 0.8,
          duration: 0.6,
          delay: 0.6 + index * 0.1,
          ease: "back.out(1.7)",
          clearProps: "all",
        });
      }
    });

    // About cards animation
    aboutCardsRef.current.forEach((card, index) => {
      if (card) {
        gsap.from(card, {
          scrollTrigger: {
            trigger: card,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
          opacity: 0,
          y: 40,
          duration: 0.8,
          delay: index * 0.2,
          ease: "power3.out",
        });
      }
    });

    // Feature cards animation
    featureCardsRef.current.forEach((card, index) => {
      if (card) {
        gsap.from(card, {
          scrollTrigger: {
            trigger: card,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
          opacity: 0,
          scale: 0.9,
          duration: 0.6,
          delay: index * 0.15,
          ease: "power2.out",
        });
      }
    });

    // About closing section animation
    if (aboutCtaRef.current) {
      gsap.from(aboutCtaRef.current, {
        scrollTrigger: {
          trigger: aboutCtaRef.current,
          start: "top 85%",
          toggleActions: "play none none reverse",
        },
        opacity: 0,
        y: 30,
        duration: 0.8,
        ease: "power2.out",
      });
    }
  }, []);

  return (
    <div className="about-container">
      {/* Intro Section */}
      <section className="home-intro">
        <div className="container">
          <div className="intro-content">
            <div className="intro-badge" ref={introBadgeRef}>Welcome to Saathsource</div>
            <h2 className="intro-title" ref={introTitleRef}>
              Connecting Global Healthcare Through <span className="brand-name">Innovation</span>
            </h2>
            <p className="intro-description" ref={introDescRef}>
              Saathsource is a leading B2B pharmaceutical marketplace that bridges the gap between 
              quality manufacturers and healthcare providers worldwide. We're committed to making 
              pharmaceutical trade more accessible, transparent, and efficient for businesses of all sizes.
            </p>
            <div className="intro-highlights">
              <div className="highlight-item" ref={(el) => (introHighlightsRef.current[0] = el)}>
                <div className="highlight-icon">✓</div>
                <span>Verified Suppliers</span>
              </div>
              <div className="highlight-item" ref={(el) => (introHighlightsRef.current[1] = el)}>
                <div className="highlight-icon">✓</div>
                <span>Verified Buyers</span>
              </div>
              <div className="highlight-item" ref={(el) => (introHighlightsRef.current[2] = el)}>
                <div className="highlight-icon">✓</div>
                <span>Global Network</span>
              </div>
              <div className="highlight-item" ref={(el) => (introHighlightsRef.current[3] = el)}>
                <div className="highlight-icon">✓</div>
                <span>24/7 Support</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="about-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">
              About <span className="brand-name">Saathsource</span>
            </h2>
            <p className="section-subtitle">
              Your dedicated gateway to the global healthcare and pharmaceutical
              industry
            </p>
          </div>

          <div className="about-grid">
            <div className="about-card" ref={(el) => (aboutCardsRef.current[0] = el)}>
              <div className="card-icon-large">
                <img src={mission} alt="Our Mission" />
              </div>
              <h3>Our Mission</h3>
              <p>
                To simplify global B2B trade by connecting procurers and
                suppliers on a seamless, intelligent, and scalable platform that
                enables efficient sourcing and secure international
                transactions.
              </p>
            </div>

            <div className="about-card" ref={(el) => (aboutCardsRef.current[1] = el)}>
              <div className="card-icon-large">
                <img src={vision} alt="Our Vision" />
              </div>
              <h3>Our Vision</h3>
              <p>
                To become the world's most trusted B2B sourcing platform,
                driving global trade through transparent partnerships,
                innovative technology, and seamless supply chain solutions.
              </p>
            </div>

            <div className="about-card" ref={(el) => (aboutCardsRef.current[2] = el)}>
              <div className="card-icon-large">
                <img src={impact} alt="Our Impact" />
              </div>
              <h3>Our Impact</h3>
              <p>
                We streamline international trade, offering faster sourcing,
                better matching, and secure transactions to simplify global B2B
                trade and empower businesses with efficient and scalable
                solutions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">
              Why Choose <span className="brand-name">Saathsource</span>?
            </h2>
            <p className="section-subtitle">
              Experience the future of B2B pharmaceutical trade
            </p>
          </div>

          <div className="features-grid">
            <div className="feature-item" ref={(el) => (featureCardsRef.current[0] = el)}>
              <div className="feature-icon">
                <img src={realtime} alt="Real-time Analytics" />
              </div>
              <h3>Real-time Analytics</h3>
              <p>
                Comprehensive insights and analytics to optimize your sourcing
                strategies.
              </p>
            </div>

            <div className="feature-item" ref={(el) => (featureCardsRef.current[1] = el)}>
              <div className="feature-icon">
                <img src={global} alt="Global Reach" />
              </div>
              <h3>Global Reach</h3>
              <p>
                Access to suppliers and buyers from over 50 countries across the
                globe.
              </p>
            </div>

            <div className="feature-item" ref={(el) => (featureCardsRef.current[2] = el)}>
              <div className="feature-icon">
                <img src={fast} alt="Fast Processing" />
              </div>
              <h3>Fast Processing</h3>
              <p>
                Streamlined processes that reduce sourcing time from weeks to
                days.
              </p>
            </div>

            <div className="feature-item" ref={(el) => (featureCardsRef.current[3] = el)}>
              <div className="feature-icon">
                <img src={quality} alt="Quality Assurance" />
              </div>
              <h3>Quality Assurance</h3>
              <p>
                Rigorous verification process ensures only certified and quality
                suppliers.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Closing Section */}
      <section className="about-closing-section">
        <div className="container">
          <div className="about-closing-content" ref={aboutCtaRef}>
            <p className="closing-text">
              Join thousands of businesses transforming pharmaceutical trade with <span className="closing-logo">Saath</span><span className="closing-logo-source">source</span>
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default About;
