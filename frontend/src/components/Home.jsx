import React from "react";
import "../CSS/Home.css";

import img1 from "../IMGS/main1.png";
import Product from "./Product";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Footer from "./Footer";
import healthcare from "../assets/healthcare.jpg";
import pharma from "../assets/pharma.jpg";
import network from "../assets/network.jpg";

import About from "./About";
const Home = () => {
  const navigate = useNavigate();
  const { isLogin } = useSelector((state) => state.user);

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
  return (
    <>
    <div className="hero">
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
                    <div className="card-icon"><img src={healthcare} alt="health" /></div>
                    <h3>Healthcare</h3>
                    <p>Verified suppliers</p>
                  </div>
                  <div className="card card-2">
                    <div className="card-icon"><img src={pharma} alt="health" /></div>
                    <h3>Pharmaceuticals</h3>
                    <p>Quality products</p>
                  </div>
                  <div className="card card-3">
                    <div className="card-icon"><img src={network} alt="health" /></div>
                    <h3>Global Network</h3>
                    <p>Worldwide reach</p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      <About />
      <Product />
    </>
  );
};

export default Home;
