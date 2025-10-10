import React from "react";
import "../CSS/Home.css";
import img1 from "../IMGS/main1.png";
import Product from "./Product";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Footer from "./Footer";

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
      <About />
      <Product />
    </>
  );
};

export default Home;
