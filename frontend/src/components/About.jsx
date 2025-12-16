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

          <div className="about-grid-new">
            {/* Our Mission - Image Left, Text Right */}
            <div className="about-item mission" ref={(el) => (aboutCardsRef.current[0] = el)}>
              <div className="about-image">
                <img src={mission} alt="Our Mission" />
              </div>
              <div className="about-content">
                <h3>Our Mission</h3>
                <p>
                  At SaathSource, our mission is to simplify and strengthen global B2B trade by building a trusted digital ecosystem for procurers and suppliers worldwide. We aim to eliminate complexity in sourcing by offering a seamless, intelligent, and scalable platform that supports efficient decision-making. By leveraging technology and data-driven insights, we enable faster discovery of reliable suppliers and high-quality products. Our platform is designed to ensure transparency, compliance, and security across international transactions. Ultimately, we strive to empower businesses of all sizes to trade confidently, grow sustainably, and expand across borders with ease.
                </p>
              </div>
            </div>

            {/* Our Vision - Text Left, Image Right */}
            <div className="about-item vision" ref={(el) => (aboutCardsRef.current[1] = el)}>
              <div className="about-content">
                <h3>Our Vision</h3>
                <p>
                  Our vision is to become the world's most trusted B2B sourcing platform, setting new standards for reliability, transparency, and efficiency in global trade. We aspire to connect businesses across borders through strong, long-term partnerships built on trust and accountability. By continuously innovating with advanced technology, we aim to simplify complex supply chains and improve sourcing experiences. Our goal is to enable seamless collaboration between buyers and suppliers worldwide. Through smart, secure, and scalable solutions, we seek to drive sustainable growth in the global B2B ecosystem.
                </p>
              </div>
              <div className="about-image">
                <img src={vision} alt="Our Vision" />
              </div>
            </div>

            {/* Our Impact - Image Left, Text Right */}
            <div className="about-item impact" ref={(el) => (aboutCardsRef.current[2] = el)}>
              <div className="about-image">
                <img src={impact} alt="Our Impact" />
              </div>
              <div className="about-content">
                <h3>Our Impact</h3>
                <p>
                  We transform the way businesses engage in international trade by reducing complexity and increasing efficiency at every stage of sourcing. Our platform enables faster supplier discovery, smarter matching, and secure, reliable transactions across borders. By streamlining global B2B processes, we help businesses save time, lower operational costs, and scale with confidence. SaathSource empowers companies with transparent, technology-driven solutions that support sustainable growth and long-term success in global markets.
                </p>
              </div>
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
