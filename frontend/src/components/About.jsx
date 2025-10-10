import React from "react";
import "../CSS/About.css";

function About() {
  return (
    <div className="about-container">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <div className="hero-text">
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
            <div className="hero-buttons">
              <button className="btn-primary">Get Started</button>
              <button className="btn-secondary">Learn More</button>
            </div>
          </div>
          <div className="hero-visual">
            <div className="floating-cards">
              <div className="card card-1">
                <div className="card-icon">🏥</div>
                <h3>Healthcare</h3>
                <p>Verified suppliers</p>
              </div>
              <div className="card card-2">
                <div className="card-icon">💊</div>
                <h3>Pharmaceuticals</h3>
                <p>Quality products</p>
              </div>
              <div className="card card-3">
                <div className="card-icon">🌐</div>
                <h3>Global Network</h3>
                <p>Worldwide reach</p>
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
            <div className="about-card">
              <div className="card-icon-large">🎯</div>
              <h3>Our Mission</h3>
              <p>
                To simplify global B2B trade by connecting procurers and
                suppliers on a seamless, intelligent, and scalable platform that
                enables efficient sourcing and secure international
                transactions.
              </p>
            </div>

            <div className="about-card">
              <div className="card-icon-large">🚀</div>
              <h3>Our Vision</h3>
              <p>
                To become the world's most trusted B2B sourcing platform,
                driving global trade through transparent partnerships,
                innovative technology, and seamless supply chain solutions.
              </p>
            </div>

            <div className="about-card">
              <div className="card-icon-large">⚡</div>
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
              <div className="feature-icon">🔒</div>
              <h3>Secure Transactions</h3>
              <p>
                Bank-level security for all your transactions with verified
                partners worldwide.
              </p>
            </div>

            <div className="feature-item">
              <div className="feature-icon">🤖</div>
              <h3>Smart Matching</h3>
              <p>
                AI-powered algorithms that connect you with the most relevant
                suppliers and buyers.
              </p>
            </div>

            <div className="feature-item">
              <div className="feature-icon">📊</div>
              <h3>Real-time Analytics</h3>
              <p>
                Comprehensive insights and analytics to optimize your sourcing
                strategies.
              </p>
            </div>

            <div className="feature-item">
              <div className="feature-icon">🌍</div>
              <h3>Global Reach</h3>
              <p>
                Access to suppliers and buyers from over 50 countries across the
                globe.
              </p>
            </div>

            <div className="feature-item">
              <div className="feature-icon">⚡</div>
              <h3>Fast Processing</h3>
              <p>
                Streamlined processes that reduce sourcing time from weeks to
                days.
              </p>
            </div>

            <div className="feature-item">
              <div className="feature-icon">🎯</div>
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
