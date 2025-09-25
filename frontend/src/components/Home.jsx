import React from "react";
import "../CSS/Home.css";
import img1 from "../IMGS/main1.png";
import Product from "./Product";
import { useNavigate } from "react-router-dom";
import Footer from "./Footer";

import About from "./About";
const Home = () => {
  const navigate = useNavigate();
  const handleSelling = ()=>{
    navigate("/sellerregister");
  } 
  const handleBuying = ()=>{
    navigate("/buyerregister");
  }
  return (
    <>
      <main>
        <div className="container">
          <div className="div1">
            <h1>
              Global <span style={{ color: "#2497fe" }}>B2B Marketplace</span>
              <br></br>
              for Healthcare & Pharma
            </h1>
            <p>
              Connect with verified suppliers and buyers worldwide. Source APIs,
              chemicals, reagents, and pharmaceutical raw materials with
              confidence.
            </p>
            <div className="btns">
              <button onClick={handleBuying}>Start Buying</button>
              <button onClick={handleSelling}>Start Selling</button>
            </div>
          </div>
        </div>
      </main>
      <About />
      <Product />
    </>
  );
};

export default Home;
