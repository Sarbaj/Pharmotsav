import React, { useState, useEffect } from "react";
import "../CSS/Product.css";

const Product = () => {
  const [allProducts, setAllProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("name");
  const [showMobileCategoryMenu, setShowMobileCategoryMenu] = useState(false);
  const [categories, setCategories] = useState([
    "All",
    "Active Pharmaceutical Ingredients",
    "Excipients",
    "Biological Raw Materials",
    "Herbal Products",
    "Packaging Materials",
    "Additives and Reagents",
    "Intermediates",
    "Solvents",
  ]);
  const [categoryData, setCategoryData] = useState([]); // Store category objects with IDs
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [productsLoading, setProductsLoading] = useState(true);
  const [productsError, setProductsError] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch categories from backend
  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log("Fetching categories from API...");

      const response = await fetch(
        "http://localhost:4000/api/v1/categories/get-all-categories"
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("API Response:", data);

      if (data.success && data.data && Array.isArray(data.data)) {
        // Store category data with IDs
        setCategoryData(data.data);

        // Add "All" option at the beginning
        const categoryNames = [
          "All",
          ...data.data.map(
            (category) =>
              category.name || category.categoryName || category.title
          ),
        ];
        console.log("Processed categories:", categoryNames);
        setCategories(categoryNames);
      } else {
        console.warn("API response structure unexpected:", data);
        setError("Failed to fetch categories - unexpected response format");
        // Fallback to static categories if API fails
      }
    } catch (err) {
      console.error("Error fetching categories:", err);
      setError(`Failed to fetch categories: ${err.message}`);
      // Fallback to static categories if API fails
    } finally {
      setLoading(false);
    }
  };

  const openProductModal = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const closeProductModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  // Fetch products by category from backend
  const fetchProductsByCategory = async (categoryId) => {
    try {
      setProductsLoading(true);
      setProductsError(null);
      console.log("Fetching products by category:", categoryId);

      const response = await fetch(
        "http://localhost:4000/api/v1/products/get-products-by-category-full",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ categoryId }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Products by category API Response:", data);

      if (data.success && data.data && Array.isArray(data.data)) {
        // Transform backend data to match frontend format
        const transformedProducts = data.data.map((product) => ({
          id: product._id,
          name: product.productName,
          description:
            product.description ||
            `High-quality ${product.productName} from verified supplier`,
          category: product.categoryName || "General",
          image:
            product.productImage ||
            "https://via.placeholder.com/300x200?text=Product+Image",
          price: "Contact for Price", // Price not available in endpoint
          supplier: product.sellerName,
          minOrder: "Contact Supplier",
          sellerCity: product.sellerCity,
          specification: product.specification || [],
          createdAt: product.createdAt || product.date || new Date(),
        }));

        console.log("Transformed products by category:", transformedProducts);
        setAllProducts(transformedProducts);
        setFilteredProducts(transformedProducts);
      } else {
        console.warn(
          "Products by category API response structure unexpected:",
          data
        );
        setProductsError(
          "Failed to fetch products - unexpected response format"
        );
        // Fallback to empty array if API fails
        setAllProducts([]);
        setFilteredProducts([]);
      }
    } catch (err) {
      console.error("Error fetching products by category:", err);
      setProductsError(`Failed to fetch products: ${err.message}`);
      // Fallback to empty array if API fails
      setAllProducts([]);
      setFilteredProducts([]);
    } finally {
      setProductsLoading(false);
    }
  };

  // Fetch products from backend
  const fetchProducts = async () => {
    try {
      setProductsLoading(true);
      setProductsError(null);
      console.log("Fetching products from API...");

      const response = await fetch(
        "http://localhost:4000/api/v1/products/get-all-products-full"
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Products API Response:", data);

      if (data.success && data.data && Array.isArray(data.data)) {
        // Transform backend data to match frontend format
        const transformedProducts = data.data.map((product, index) => ({
          id: product._id,
          name: product.productName,
          description:
            product.description ||
            `High-quality ${product.productName} from verified supplier`,
          category: product.categoryName || "General",
          image:
            product.productImage ||
            "https://via.placeholder.com/300x200?text=Product+Image",
          price: "Contact", // Price not available in endpoint
          supplier: product.sellerName,
          minOrder: "Contact Supplier",
          sellerCity: product.sellerCity,
          specification: product.specification || [],
          createdAt: product.createdAt || product.date || new Date(),
        }));

        console.log("Transformed products:", transformedProducts);
        setAllProducts(transformedProducts);
        setFilteredProducts(transformedProducts);
      } else {
        console.warn("Products API response structure unexpected:", data);
        setProductsError(
          "Failed to fetch products - unexpected response format"
        );
        // Fallback to empty array if API fails
        setAllProducts([]);
        setFilteredProducts([]);
      }
    } catch (err) {
      console.error("Error fetching products:", err);
      setProductsError(`Failed to fetch products: ${err.message}`);
      // Fallback to empty array if API fails
      setAllProducts([]);
      setFilteredProducts([]);
    } finally {
      setProductsLoading(false);
    }
  };

  // Fetch categories on component mount
  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, []);

  // Filter and search functionality (only for search and sort, category filtering is done via API)
  useEffect(() => {
    let filtered = allProducts;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.description
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          product.supplier.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sort products
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name);
        case "date":
          return (
            new Date(b.createdAt || b.date) - new Date(a.createdAt || a.date)
          );
        default:
          return 0;
      }
    });

    setFilteredProducts(filtered);
  }, [searchTerm, sortBy, allProducts]);

  const handleSearch = (value) => {
    setSearchTerm(value);
  };

  const handleCategoryFilter = (category) => {
    setSelectedCategory(category);

    if (category === "All") {
      // Fetch all products
      fetchProducts();
    } else {
      // Find category ID and fetch products by category
      const categoryObj = categoryData.find(
        (cat) =>
          cat.name === category ||
          cat.categoryName === category ||
          cat.title === category
      );

      if (categoryObj && categoryObj._id) {
        fetchProductsByCategory(categoryObj._id);
      } else {
        console.warn("Category not found in categoryData:", category);
        // Fallback to all products
        fetchProducts();
      }
    }
  };

  const handleInquire = async (product) => {
    try {
      // Get buyer ID from localStorage or Redux store
      const buyerId =
        localStorage.getItem("buyerId") ||
        JSON.parse(localStorage.getItem("user"))?._id;

      if (!buyerId) {
        alert("Please login as a buyer to make inquiries");
        return;
      }

      const response = await fetch(
        "http://localhost:4000/api/v1/inquiries/create-inquiry",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            productId: product.id,
          }),
        }
      );

      const data = await response.json();

      if (response.ok && data.success) {
        alert(`Inquiry added successfully for ${product.name}!`);
      } else {
        alert(data.message || "Failed to add inquiry");
      }
    } catch (error) {
      console.error("Error creating inquiry:", error);
      alert("Failed to create inquiry. Please try again.");
    }
  };

  const toggleMobileCategoryMenu = () => {
    setShowMobileCategoryMenu(!showMobileCategoryMenu);
  };

  const handleMobileCategorySelect = (category) => {
    setSelectedCategory(category);
    setShowMobileCategoryMenu(false);
  };

  const scrollToCategorySection = () => {
    const productsSection = document.querySelector(".products-section");
    if (productsSection) {
      productsSection.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  return (
    <div className="product-container">
      {/* Header Section */}
      <div className="product-header">
        <div className="header-content">
          <h1 className="main-title">Find Pharmaceutical Products</h1>
          <p className="main-subtitle">
            Discover high-quality APIs, excipients, and pharmaceutical materials
            from verified suppliers
          </p>
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className="search-filter-section">
        <div className="search-container">
          <div className="search-box">
            <input
              type="text"
              placeholder="Search products, suppliers, or categories..."
              className="search-input"
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
            />
            <button className="search-button">
              <span className="search-icon">🔍</span>
            </button>
          </div>
        </div>

        <div className="filter-controls">
          <div className="filter-group">
            <label>Category:</label>
            <select
              value={selectedCategory}
              onChange={(e) => handleCategoryFilter(e.target.value)}
              className="filter-select"
              disabled={loading}
            >
              {loading ? (
                <option>Loading categories...</option>
              ) : (
                categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))
              )}
            </select>
          </div>

          <div className="filter-group">
            <label>Sort by:</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="filter-select"
            >
              <option value="name">Name</option>
              <option value="date">Date</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="product-content">
        {/* Sidebar */}
        <div className="product-sidebar">
          <div className="sidebar-section">
            <h3 className="sidebar-title">Categories</h3>
            <div className="category-list">
              {loading ? (
                <div className="loading-categories">
                  <div className="loading-spinner"></div>
                  <p>Loading categories...</p>
                </div>
              ) : error ? (
                <div className="error-categories">
                  <p>Failed to load categories</p>
                  <button onClick={fetchCategories} className="retry-button">
                    Retry
                  </button>
                </div>
              ) : (
                <>
                  {console.log("Rendering categories:", categories)}
                  {categories.length > 0 ? (
                    categories.map((category, index) => (
                      <button
                        key={index}
                        className={`category-item ${
                          selectedCategory === category ? "active" : ""
                        }`}
                        onClick={() => handleCategoryFilter(category)}
                      >
                        {category}
                      </button>
                    ))
                  ) : (
                    <div className="no-categories">
                      <p>No categories available</p>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          <div className="sidebar-section">
            <h3 className="sidebar-title">Quick Stats</h3>
            <div className="stats">
              <div className="stat-item">
                <span className="stat-number">{allProducts.length}</span>
                <span className="stat-label">Total Products</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">{categories.length - 1}</span>
                <span className="stat-label">Categories</span>
              </div>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="products-section">
          <div className="products-header">
            <h2 className="products-title">
              {selectedCategory === "All" ? "All Products" : selectedCategory}
              <span className="product-count">
                ({filteredProducts.length} products)
              </span>
            </h2>
          </div>

          {productsLoading ? (
            <div className="loading-products">
              <div className="loading-spinner"></div>
              <p>Loading products...</p>
            </div>
          ) : productsError ? (
            <div className="no-products">
              <div className="no-products-icon">📦</div>
              <h3>Products will be added soon</h3>
              <p>Thank you for your patience</p>
            </div>
          ) : filteredProducts.length > 0 ? (
            <div className="products-grid">
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  className="product-card"
                  onClick={() => openProductModal(product)}
                >
                  <div className="product-image-container">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="product-image"
                      onError={(e) => {
                        e.target.src =
                          "https://via.placeholder.com/300x200?text=Product+Image";
                      }}
                    />
                  </div>

                  <div className="product-info">
                    <h3 className="product-name">{product.name}</h3>
                    <p className="product-description">{product.description}</p>

                    {(() => {
                      const typeSpec =
                        product.specification &&
                        product.specification.find(
                          (spec) =>
                            spec &&
                            typeof spec.key === "string" &&
                            spec.key.toLowerCase() === "type"
                        );

                      const otherSpecs =
                        product.specification &&
                        product.specification.filter(
                          (spec) =>
                            !(
                              spec &&
                              typeof spec.key === "string" &&
                              spec.key.toLowerCase() === "type"
                            )
                        );

                      return (
                        <div className="product-details">
                          <div className="detail-item">
                            <span className="detail-label">Supplier:</span>
                            <span className="detail-value">
                              {product.supplier}
                            </span>
                          </div>
                          {product.sellerCity && (
                            <div className="detail-item">
                              <span className="detail-label">Location:</span>
                              <span className="detail-value">
                                {product.sellerCity}
                              </span>
                            </div>
                          )}
                          {typeSpec && (
                            <div className="detail-item">
                              <span className="detail-label">Type:</span>
                              <span className="detail-value">{typeSpec.value}</span>
                            </div>
                          )}

                          {otherSpecs && otherSpecs.length > 0 && (
                            <>
                              {product.showAllSpecs &&
                                otherSpecs.map((spec, index) => (
                                  <div key={index} className="detail-item">
                                    <span className="detail-label">
                                      {spec.key}:
                                    </span>
                                    <span className="detail-value">
                                      {spec.value}
                                    </span>
                                  </div>
                                ))}

                              <div className="detail-item">
                                <button
                                  className="see-more-btn"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    openProductModal(product);
                                  }}
                                >
                                  See More Details
                                </button>
                              </div>
                            </>
                          )}

                          {!product.specification ||
                            (product.specification.length === 0 && (
                              <div className="detail-item">
                                <span className="detail-label">Min Order:</span>
                                <span className="detail-value">
                                  {product.minOrder}
                                </span>
                              </div>
                            ))}
                        </div>
                      );
                    })()}
                  </div>

                  <div className="product-footer">
                    <button
                      className="inquire-button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleInquire(product);
                      }}
                    >
                      Inquire Now
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-products">
              <div className="no-products-icon">📦</div>
              <h3>Products will be added soon</h3>
              <p>Thank you for your patience</p>
            </div>
          )}
        </div>
      </div>

      {/* Floating Category Button */}
      <div className="mobile-category-floating">
        <button
          className="mobile-category-toggle"
          onClick={scrollToCategorySection}
        >
          <span className="category-icon">📂</span>
          <span className="category-text">Categories</span>
        </button>
      </div>

      {isModalOpen && selectedProduct && (
        <div className="product-modal-overlay" onClick={closeProductModal}>
          <div
            className="product-modal"
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <button className="product-modal-close" onClick={closeProductModal}>
              X
            </button>

            <div className="product-modal-header">
              <h2 className="product-modal-title">{selectedProduct.name}</h2>
              {selectedProduct.supplier && (
                <p className="product-modal-supplier">{selectedProduct.supplier}</p>
              )}
            </div>

            <div className="product-modal-body">
              <div className="product-modal-image-wrapper">
                <img
                  src={selectedProduct.image}
                  alt={selectedProduct.name}
                  onError={(e) => {
                    e.target.src =
                      "https://via.placeholder.com/400x260?text=Product+Image";
                  }}
                />
              </div>

              <p className="product-modal-description">
                {selectedProduct.description}
              </p>

              <div className="product-modal-details">
                {selectedProduct.sellerCity && (
                  <div className="product-modal-detail-row">
                    <span className="detail-label">Location:</span>
                    <span className="detail-value">
                      {selectedProduct.sellerCity}
                    </span>
                  </div>
                )}

                {selectedProduct.minOrder && (
                  <div className="product-modal-detail-row">
                    <span className="detail-label">Min Order:</span>
                    <span className="detail-value">
                      {selectedProduct.minOrder}
                    </span>
                  </div>
                )}

                {Array.isArray(selectedProduct.specification) &&
                  selectedProduct.specification.length > 0 && (
                    <div className="product-modal-specs">
                      {selectedProduct.specification.map((spec, index) => (
                        <div key={index} className="product-modal-detail-row">
                          <span className="detail-label">{spec.key}:</span>
                          <span className="detail-value">{spec.value}</span>
                        </div>
                      ))}
                    </div>
                  )}
              </div>
            </div>

            <div className="product-modal-footer">
              <button
                className="inquire-button"
                onClick={() => {
                  handleInquire(selectedProduct);
                }}
              >
                Inquire Now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Product;
