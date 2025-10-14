import React from "react";
import "../CSS/About.css";
import mission from "../assets/mission.jpg";
import vision from "../assets/vision.jpg";
import impact from "../assets/impact.jpg";
import smartmatch from "../assets/smartmatch.jpg";
import realtime from "../assets/realtime.jpg";
import global from "../assets/global.jpg";
import fast from "../assets/fast.jpg";
import quality from "../assets/quality.jpg";


function About() {
  return (
    <div className="about-container">
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
            <div className="about-card">
              <div className="card-icon-large"><img src={mission} alt="mission" /></div>
              <h3>Our Mission</h3>
              <p>
                To simplify global B2B trade by connecting procurers and
                suppliers on a seamless, intelligent, and scalable platform that
                enables efficient sourcing and secure international
                transactions.
              </p>
            </div>

            <div className="about-card">
              <div className="card-icon-large"><img src={vision} alt="mission" /></div>
              <h3>Our Vision</h3>
              <p>
                To become the world's most trusted B2B sourcing platform,
                driving global trade through transparent partnerships,
                innovative technology, and seamless supply chain solutions.
              </p>
            </div>

            <div className="about-card">
              <div className="card-icon-large"><img src={impact} alt="mission" /></div>
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
            <div className="feature-item">
              <div className="feature-icon"><img src={smartmatch} alt="mission" /></div>
              <h3>Smart Matching</h3>
              <p>
                AI-powered algorithms that connect you with the most relevant
                suppliers and buyers.
              </p>
            </div>

            <div className="feature-item">
              <div className="feature-icon"><img src={realtime} alt="mission" /></div>
              <h3>Real-time Analytics</h3>
              <p>
                Comprehensive insights and analytics to optimize your sourcing
                strategies.
              </p>
            </div>

            <div className="feature-item">
              <div className="feature-icon"><img src={global} alt="mission" /></div>
              <h3>Global Reach</h3>
              <p>
                Access to suppliers and buyers from over 50 countries across the
                globe.
              </p>
            </div>

            <div className="feature-item">
              <div className="feature-icon"><img src={fast} alt="mission" /></div>
              <h3>Fast Processing</h3>
              <p>
                Streamlined processes that reduce sourcing time from weeks to
                days.
              </p>
            </div>

            <div className="feature-item">
              <div className="feature-icon"><img src={quality} alt="mission" /></div>
              <h3>Quality Assurance</h3>
              <p>
                Rigorous verification process ensures only certified and quality
                suppliers.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default About;
