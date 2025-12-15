import React, { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";
import "../CSS/Product.css";
import { API_BASE_URL, API_ENDPOINTS } from "../config/api";
import { fetchWithAuth, getAuthHeaders } from "../utils/apiUtils";

const Product = () => {
  const headerRef = useRef(null);
  
  const [allProducts, setAllProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [displayedProducts, setDisplayedProducts] = useState([]);
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
  
  // New states for pagination and theme
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(12);
  const [isMachineTheme, setIsMachineTheme] = useState(false);
  const [machineCategory, setMachineCategory] = useState(null);

  // Fetch categories from backend
  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log("Fetching categories from API...");

      const response = await fetch(
        `${API_ENDPOINTS.CATEGORIES.GET_ALL}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("API Response:", data);

      if (data.success && data.data && Array.isArray(data.data)) {
        // Store category data with IDs
        setCategoryData(data.data);
        console.log("Category data set:", data.data);

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
        `${API_ENDPOINTS.PRODUCTS.GET_BY_CATEGORY_FULL}`,
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
        
        // Reset pagination
        setCurrentPage(1);
        updateDisplayedProducts(transformedProducts, 1);
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
        setDisplayedProducts([]);
      }
    } catch (err) {
      console.error("Error fetching products by category:", err);
      setProductsError(`Failed to fetch products: ${err.message}`);
      // Fallback to empty array if API fails
      setAllProducts([]);
      setFilteredProducts([]);
      setDisplayedProducts([]);
    } finally {
      setProductsLoading(false);
    }
  };

  // Fetch products from backend (excluding machine category)
  const fetchProducts = async () => {
    try {
      setProductsLoading(true);
      setProductsError(null);
      console.log("Fetching products from API...");

      const response = await fetch(
        `${API_ENDPOINTS.PRODUCTS.GET_ALL_FULL}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Products API Response:", data);

      if (data.success && data.data && Array.isArray(data.data)) {
        // Transform backend data to match frontend format
        const transformedProducts = data.data
          .filter(product => {
            // Exclude machine category products from "All" view
            const categoryName = (product.categoryName || "").toLowerCase();
            return !categoryName.includes('machine') && !categoryName.includes('machinery');
          })
          .map((product, index) => ({
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
        
        // Reset pagination
        setCurrentPage(1);
        updateDisplayedProducts(transformedProducts, 1);
      } else {
        console.warn("Products API response structure unexpected:", data);
        setProductsError(
          "Failed to fetch products - unexpected response format"
        );
        // Fallback to empty array if API fails
        setAllProducts([]);
        setFilteredProducts([]);
        setDisplayedProducts([]);
      }
    } catch (err) {
      console.error("Error fetching products:", err);
      setProductsError(`Failed to fetch products: ${err.message}`);
      // Fallback to empty array if API fails
      setAllProducts([]);
      setFilteredProducts([]);
      setDisplayedProducts([]);
    } finally {
      setProductsLoading(false);
    }
  };

  // Update displayed products based on pagination
  const updateDisplayedProducts = (products, page) => {
    const startIndex = (page - 1) * productsPerPage;
    const endIndex = startIndex + productsPerPage;
    setDisplayedProducts(products.slice(startIndex, endIndex));
  };

  // Load more products
  const loadMoreProducts = () => {
    const nextPage = currentPage + 1;
    const startIndex = (nextPage - 1) * productsPerPage;
    const endIndex = startIndex + productsPerPage;
    const newProducts = filteredProducts.slice(startIndex, endIndex);
    
    setDisplayedProducts(prev => [...prev, ...newProducts]);
    setCurrentPage(nextPage);
  };

  // Check if machine category is selected
  const checkMachineCategory = (category) => {
    const categoryName = category.toLowerCase();
    return categoryName.includes('machine') || categoryName.includes('machinery');
  };

  // Apply machine theme
  const applyMachineTheme = (isActive) => {
    setIsMachineTheme(isActive);
    
    if (isActive) {
      document.body.classList.add('machine-theme');
    } else {
      document.body.classList.remove('machine-theme');
    }
  };

  // Fetch categories on component mount
  useEffect(() => {
    fetchCategories();
    fetchProducts();
    
    // Header animation
    if (headerRef.current) {
      gsap.set(headerRef.current.children, {
        opacity: 0,
        y: -30,
      });
      
      gsap.to(headerRef.current.children, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.2,
        ease: "power3.out",
      });
    }
  }, []);

  // Set machine category when categoryData is loaded
  useEffect(() => {
    if (categoryData.length > 0) {
      const machineCategory = categoryData.find(cat => {
        const name = (cat.name || cat.categoryName || cat.title || '').toLowerCase();
        return name.includes('machine') || name.includes('machinery');
      });
      setMachineCategory(machineCategory);
      console.log("Machine category found:", machineCategory);
    }
  }, [categoryData]);

  // Update displayed products when filtered products change
  useEffect(() => {
    updateDisplayedProducts(filteredProducts, 1);
    setCurrentPage(1);
  }, [filteredProducts]);

  // Cleanup machine theme on component unmount
  useEffect(() => {
    return () => {
      document.body.classList.remove('machine-theme');
    };
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

    // Check if machine category is selected
    const isMachine = checkMachineCategory(category);
    applyMachineTheme(isMachine);

    if (category === "All") {
      // Fetch all products (excluding machines)
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

  // Handle floating machine button click
  const handleMachineButtonClick = () => {
    if (machineCategory) {
      const categoryName = machineCategory.name || machineCategory.categoryName || machineCategory.title;
      console.log("Machine button clicked, category:", categoryName);
      
      // Scroll to top
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
      
      // Filter to machine category
      handleCategoryFilter(categoryName);
    } else {
      console.warn("Machine category not found");
      // Fallback: try to find machine category in categories array
      const machineCategoryName = categories.find(cat => 
        cat.toLowerCase().includes('machine') || cat.toLowerCase().includes('machinery')
      );
      
      if (machineCategoryName) {
        console.log("Using fallback machine category:", machineCategoryName);
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
        handleCategoryFilter(machineCategoryName);
      }
    }
  };

  const handleInquire = async (product) => {
    try {
      // Get buyer ID from localStorage or Redux store
      const buyerId =
        localStorage.getItem("buyerId") ||
        JSON.parse(localStorage.getItem("user"))?._id;

      const token = localStorage.getItem("token");
      const role = localStorage.getItem("role");

      console.log("Inquiry Debug:", { buyerId, token: !!token, role, productId: product.id });

      if (!buyerId || !token || role !== "buyer") {
        alert("Please login as a buyer to make inquiries");
        window.location.href = "/login";
        return;
      }

      console.log("Sending inquiry request to:", API_ENDPOINTS.INQUIRIES.CREATE);
      console.log("Request body:", { productId: product.id });

      const response = await fetchWithAuth(
        `${API_ENDPOINTS.INQUIRIES.CREATE}`,
        {
          method: "POST",
          headers: getAuthHeaders(),
          body: JSON.stringify({
            productId: product.id,
          }),
        }
      );

      const data = await response.json();
      console.log("Inquiry response:", { status: response.status, data });

      if (response.ok && data.success) {
        alert(`Inquiry added successfully for ${product.name}!`);
      } else {
        console.error("Inquiry failed:", data);
        alert(data.message || "Failed to add inquiry");
      }
    } catch (error) {
      console.error("Error creating inquiry:", error);
      if (error.message === "Session expired. Please login again.") {
        alert(error.message);
      } else {
        alert("Failed to create inquiry. Please try again.");
      }
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
        <div className="header-content" ref={headerRef}>
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
              <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
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
            {displayedProducts.length < filteredProducts.length && (
              <p className="showing-count">
                Showing {displayedProducts.length} of {filteredProducts.length} products
              </p>
            )}
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
            <>
              <div className="products-grid">
                {displayedProducts.map((product) => (
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

                      <div className="product-details">
                        <div className="detail-item">
                          <span className="detail-value">
                            <strong>Supplier:</strong> {product.supplier}
                          </span>
                        </div>
                        {product.sellerCity && (
                          <div className="detail-item">
                            <span className="detail-value">
                              <strong>Location:</strong> {product.sellerCity}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="product-footer">
                      <button
                        className="see-more-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          openProductModal(product);
                        }}
                      >
                        See Details
                      </button>
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
              
              {/* Load More Button */}
              {displayedProducts.length < filteredProducts.length && (
                <div className="load-more-container">
                  <button 
                    className="load-more-btn"
                    onClick={loadMoreProducts}
                  >
                    Load More Products
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="no-products">
              <div className="no-products-icon">📦</div>
              <h3>Products will be added soon</h3>
              <p>Thank you for your patience</p>
            </div>
          )}
        </div>
      </div>

      {/* Floating Machine Button */}
      <div className="floating-machine-button">
        <button
          className={`machine-toggle-btn ${isMachineTheme ? 'active' : ''}`}
          onClick={handleMachineButtonClick}
          title="View Machine Products"
        >
          <svg className="machine-icon" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12,15.5A3.5,3.5 0 0,1 8.5,12A3.5,3.5 0 0,1 12,8.5A3.5,3.5 0 0,1 15.5,12A3.5,3.5 0 0,1 12,15.5M19.43,12.97C19.47,12.65 19.5,12.33 19.5,12C19.5,11.67 19.47,11.34 19.43,11L21.54,9.37C21.73,9.22 21.78,8.95 21.66,8.73L19.66,5.27C19.54,5.05 19.27,4.96 19.05,5.05L16.56,6.05C16.04,5.66 15.5,5.32 14.87,5.07L14.5,2.42C14.46,2.18 14.25,2 14,2H10C9.75,2 9.54,2.18 9.5,2.42L9.13,5.07C8.5,5.32 7.96,5.66 7.44,6.05L4.95,5.05C4.73,4.96 4.46,5.05 4.34,5.27L2.34,8.73C2.22,8.95 2.27,9.22 2.46,9.37L4.57,11C4.53,11.34 4.5,11.67 4.5,12C4.5,12.33 4.53,12.65 4.57,12.97L2.46,14.63C2.27,14.78 2.22,15.05 2.34,15.27L4.34,18.73C4.46,18.95 4.73,19.03 4.95,18.95L7.44,17.94C7.96,18.34 8.5,18.68 9.13,18.93L9.5,21.58C9.54,21.82 9.75,22 10,22H14C14.25,22 14.46,21.82 14.5,21.58L14.87,18.93C15.5,18.67 16.04,18.34 16.56,17.94L19.05,18.95C19.27,19.03 19.54,18.95 19.66,18.73L21.66,15.27C21.78,15.05 21.73,14.78 21.54,14.63L19.43,12.97Z"/>
          </svg>
          <span className="machine-text">Machines</span>
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
                    <span className="detail-value">
                      <strong>Location</strong> - {selectedProduct.sellerCity}
                    </span>
                  </div>
                )}

                {selectedProduct.minOrder && (
                  <div className="product-modal-detail-row">
                    <span className="detail-value">
                      <strong>Min Order</strong> - {selectedProduct.minOrder}
                    </span>
                  </div>
                )}

                {Array.isArray(selectedProduct.specification) &&
                  selectedProduct.specification.length > 0 && (
                    <div className="product-modal-specs">
                      <h4 className="specs-title">Specifications</h4>
                      {selectedProduct.specification.map((spec, index) => (
                        <div key={index} className="product-modal-detail-row">
                          <span className="detail-value">
                            <strong>{spec.key}</strong> - {spec.value}
                          </span>
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

