import React from "react";
import "../CSS/Product.css"; // Link to external CSS file


//error ave he

// const categories = ["Active Pharmaceutical Ingredients", "Excipients",    "Biological Raw materials",  "Herbal Products",  "Packaging Materials",  "Additctives and Reagents","intermadiates","solvents" ,""]
const featuredProducts = [
  {
    productname: "Paracetamol API",
    description: "High purity pharmaceutical grade",
    minquntity: "1 kg",
    category: "Active Pharmaceutical Ingredients",
    image: "paracetamol.jpg",
    price: "$12/kg"


  },
  {
    name: "Microcrystalline Cellulose",
    description: "Premium excipient for tablets",
    price: "$12/kg",
  },
  {
    name: "Ibuprofen API",
    description: "USP/EP grade available",
    price: "$38/kg",
  },
  {
    name: "Paracetamol API",
    description: "High purity pharmaceutical grade",
    price: "$45/kg",
  },
  {
    name: "Microcrystalline Cellulose",
    description: "Premium excipient for tablets",
    price: "$12/kg",
  },
  {
    name: "Ibuprofen API",
    description: "USP/EP grade available",
    price: "$38/kg",
  },
];

const Product = () => {
  return (
    <div className="container">
      <h1 className="title">Find What You Need</h1>
      <p className="subtitle">
        Search from thousands of pharmaceutical products
      </p>
      <div className="search-bar-wrapper">
        <input
          type="text"
          placeholder="Search for APIs, chemicals, reagents..."
          className="search-input"
        />
        <button className="search-button" aria-label="Search">
          🔍
        </button>
      </div>
      <div className="content">
        <aside className="sidebar">
          <h2 className="categories-title">Categories</h2>

          //make sure items.map is array
          {/* {Object.entries(categories).map(([category, items]) => (
            <div key={category} className="category-group">
              <h3 className="category-name">{category}</h3>
              <ul className="category-list">
                {items.map((item) => (
                  <li key={item} className="category-item">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))} */}
        </aside>
        <main className="main-content">
          <div className="products-header">
            <h2>Featured Products</h2>
            <select className="sort-select" aria-label="Sort by relevance">
              <option value="relevance">Sort by: Relevance</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
          </div>
          <div className="products-grid">
            {featuredProducts.map(({ name, description, price }) => (
              <div key={name} className="product-card">
                <div className="product-image">Product Image</div>
                <h3 className="product-name">{name}</h3>
                <p className="product-description">{description}</p>
                <p className="product-price">{price}</p>
                <button className="inquire-button">Inquire</button>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Product;
