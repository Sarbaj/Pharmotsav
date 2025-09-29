import React from "react";
import { useNavigate } from "react-router-dom";
import "../../CSS/Seller.css";

function Seller() {
  const navigate = useNavigate();

  const handleSignUp = () => {
    navigate("/sellerregister");
  };

  const sellerSteps = [
    {
      step: "01",
      title: "Registration & Verification",
      description:
        "Create your seller account and complete the verification process. Upload necessary documents to establish trust and credibility with potential buyers.",
      icon: "✅",
    },
    {
      step: "02",
      title: "Product Catalog Setup",
      description:
        "Build your comprehensive product catalog with detailed descriptions, specifications, pricing, and high-quality images. Organize products by categories for easy discovery.",
      icon: "📦",
    },
    {
      step: "03",
      title: "Receive & Respond to Inquiries",
      description:
        "Get notified instantly when buyers show interest in your products. Respond to inquiries promptly with detailed quotations and product information.",
      icon: "📨",
    },
    {
      step: "04",
      title: "Build Relationships & Close Deals",
      description:
        "Engage with buyers through our platform, negotiate terms, and build long-term business relationships. Track your sales performance and grow your business.",
      icon: "🤝",
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
      icon: "🌍",
      title: "Global Reach",
      description:
        "Access buyers from around the world and expand your market presence internationally",
    },
    {
      icon: "📈",
      title: "Increased Sales",
      description:
        "Boost your sales with our platform's advanced matching algorithms and buyer discovery",
    },
    {
      icon: "⏰",
      title: "Time Efficient",
      description:
        "Save time with automated lead generation and streamlined communication tools",
    },
    {
      icon: "🛡️",
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
                <div className="floating-card card-1">
                  <span className="card-icon">💊</span>
                  <span className="card-text">APIs & Raw Materials</span>
                </div>
                <div className="floating-card card-2">
                  <span className="card-icon">🏭</span>
                  <span className="card-text">Manufacturing</span>
                </div>
                <div className="floating-card card-3">
                  <span className="card-icon">🔬</span>
                  <span className="card-text">Research & Development</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Process Section */}
        <div className="process-section">
          <div className="section-header">
            <h2>Start Selling in 4 Simple Steps</h2>
            <p className="section-subtitle">
              From Registration to Revenue Generation
            </p>
          </div>

          <div className="steps-container">
            {sellerSteps.map((step, index) => (
              <div
                key={index}
                className={`step-card ${
                  index % 2 === 0 ? "left-align" : "right-align"
                }`}
              >
                <div className="step-number">{step.step}</div>
                <div className="step-content">
                  <div className="step-icon">{step.icon}</div>
                  <h3>{step.title}</h3>
                  <p>{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Features Section */}
        <div className="features-section">
          <div className="features-content">
            <h2>Powerful Tools for Sellers</h2>
            <p className="section-subtitle">
              Everything you need to succeed in the global pharmaceutical market
            </p>
            <div className="features-grid">
              {sellerFeatures.map((feature, index) => (
                <div key={index} className="feature-item">
                  <div className="feature-icon">{feature.icon}</div>
                  <h3>{feature.title}</h3>
                  <p>{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Benefits Section */}
        <div className="benefits-section">
          <div className="benefits-content">
            <h2>Why Choose SaathSource for Selling?</h2>
            <div className="benefits-grid">
              {sellerBenefits.map((benefit, index) => (
                <div key={index} className="benefit-item">
                  <div className="benefit-icon">{benefit.icon}</div>
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
                <div className="stat-number">10,000+</div>
                <div className="stat-label">Active Sellers</div>
              </div>

              <div className="stat-item">
                <div className="stat-number">150+</div>
                <div className="stat-label">Countries Reached</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">95%</div>
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
