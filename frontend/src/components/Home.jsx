import React from "react";
import "../CSS/Home.css";
import img1 from "../IMGS/main1.png";
import Product from "./Product";

import Footer from "./Footer";
const Home = () => {
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
              <button>Start Buying</button>
              <button>Start Selling</button>
            </div>
          </div>

          <img src={img1} alt="" />
        </div>
      </main>
      <Product />
    </>
  );
};

export default Home;
