import React from "react";
import { Route, Routes } from "react-router";
import Home from "./components/Home";
import Login from "./components/Login.jsx";
import SellerRegister from "./components/SellerRegister.jsx";
import BuyerRegister from "./components/BuyerRegister.jsx";
import Product from "./components/Product.jsx";
import Contact from "./components/Contact.jsx";
import Footer from "./components/Footer.jsx";
import Header from "./components/Header/Header.jsx";
import Buyer from "./components/BuyerSeller/Buyer.jsx";
import Seller from "./components/BuyerSeller/Seller.jsx";
import BuyerProfile from "./components/BuyerProfile.jsx";
import SellerProfile from "./components/SellerProfile.jsx";
import About from "./components/About.jsx";
const App = () => {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/buyerregister" element={<BuyerRegister />} />
        <Route path="/products" element={<Product />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/buyer" element={<Buyer />} />
        <Route path="/seller" element={<Seller />} />
        <Route path="about" element={<About />} />
        <Route path="/sellerregister" element={<SellerRegister />} />
        <Route path="/login" element={<Login />} />
        <Route path="/buyer-profile" element={<BuyerProfile />} />
        <Route path="/seller-profile" element={<SellerProfile />} />
        {/* <Route path="products" element={<Products />}/> */}
      </Routes>
      <Footer />
    </>
  );
};

export default App;
