import React, { useState } from "react";
import "../CSS/Product.css"; // Link to external CSS file
const Product = () => {
  const [allproduct, Setallproduct] = useState([
    {
      name: "Paracetamol API",
      description: "High purity pharmaceutical grade",
      category: "Active Pharmaceutical Ingredients",
      image: "paracetamol.jpg",
    },
    {
      name: "Microcrystalline Cellulose",
      description: "Premium excipient for tablets",
      category: "Herbal Products",
    },
    {
      name: "Ibuprofen API",
      description: "USP/EP grade available",
      category: "Active Pharmaceutical Ingredients",
    },
    {
      name: "Paracetamol API 01",
      description: "High purity pharmaceutical grade",
      category: "Herbal Products",
    },
    {
      name: "Microcrystalline Cellulose 01",
      description: "Premium excipient for tablets",
      category: "Active Pharmaceutical Ingredients",
    },
    ,
    {
      name: "Ibuprofen API 01",
      description: "USP/EP grade available",
      category: "Active Pharmaceutical Ingredients",
    },
    {
      name: "Paracetamol API 02",
      description: "High purity pharmaceutical grade",
      category: "Herbal Products",
    },
    {
      name: "Microcrystalline Cellulose 02",
      description: "Premium excipient for tablets",
      category: "Active Pharmaceutical Ingredients",
    },
  ]);
  const [featuredProducts, SetfeaturedProducts] = useState(allproduct);

  const categories = [
    "Active Pharmaceutical Ingredients",
    "Excipients",
    "Biological Raw materials",
    "Herbal Products",
    "Packaging Materials",
    "Additctives and Reagents",
    "intermadiates",
    "solvents",
    "",
  ];
  const [searchTerm, setSearchTerm] = useState("");

  console.log(featuredProducts);
  const GenProduct = (ctg) => {
    const Filterproduct = allproduct.filter(
      (product) => product.category == ctg
    );
    console.log(Filterproduct);

    SetfeaturedProducts(Filterproduct);
  };
  const SearcjItem = (data) => {
    if (data == "") {
      SetfeaturedProducts(allproduct);
      return;
    }
    setSearchTerm(data);
    console.log(data);

    const filteredProducts = allproduct.filter((product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    console.log("searched", filteredProducts);
    SetfeaturedProducts(filteredProducts);
  };

  return (
    <div className="containers">
      <h1 className="title">Find What You Need</h1>
      <p className="subtitle">
        Search from thousands of pharmaceutical products
      </p>
      <div className="search-bar-wrapper">
        <input
          type="text"
          placeholder="Search for APIs, chemicals, reagents..."
          className="search-input"
          onChange={(e) => SearcjItem(e.target.value)}
        />
      </div>
      <div className="content">
        <div className="sidebar">
          <h2 className="categories-title">Categories</h2>
          {categories.map((category, i) => (
            <div key={i} className="category-group">
              <ul className="category-list">
                <li
                  key={i}
                  className="category-item"
                  onClick={() => GenProduct(category)}
                >
                  {category}
                </li>
              </ul>
            </div>
          ))}
        </div>
        <mains className="mains-content">
          {featuredProducts.length > 0 &&
            featuredProducts.map(({ name, description, category }) => (
              <div key={name} className="product-card">
                <div className="product-image">Product Image</div>
                <h3 className="product-name">{name}</h3>
                <p className="product-description">{description}</p>
                <p className="product-price">{category}</p>
                <button className="inquire-button">Inquire</button>
              </div>
            ))}
        </mains>
      </div>
    </div>
  );
};

export default Product;
