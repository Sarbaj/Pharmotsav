import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { gsap } from "gsap";
import "../CSS/NotFound.css";
import notFoundImage from "../assets/404.png";

const NotFound = () => {
  const navigate = useNavigate();
  const containerRef = useRef(null);
  const imageRef = useRef(null);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const buttonRef = useRef(null);
  const floatingElementsRef = useRef([]);

  useEffect(() => {
    // Simple fade-in animations
    gsap.fromTo([titleRef.current, subtitleRef.current, buttonRef.current], 
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.8, stagger: 0.2, ease: "power2.out" }
    );

    // Floating elements animation
    floatingElementsRef.current.forEach((element, index) => {
      if (element) {
        gsap.to(element, {
          y: -15,
          duration: 2 + index * 0.5,
          repeat: -1,
          yoyo: true,
          ease: "power2.inOut",
          delay: index * 0.3,
        });
      }
    });
  }, []);

  const handleGoHome = () => {
    navigate("/");
  };

  const handleGoBack = () => {
    window.history.back();
  };

  return (
    <div className="notfound-container" ref={containerRef}>
      <div className="notfound-content">
        
    



        {/* Text Content */}
        <div className="notfound-text">
          <h1 className="notfound-title" ref={titleRef}>
            
            <span className="notfound-title-text">Page Not Found</span>
          </h1>
          
          <p className="notfound-subtitle" ref={subtitleRef}>
            The page you're looking for doesn't exist or has been moved.
          </p>

          <div className="notfound-buttons" ref={buttonRef}>
            <button 
              className="notfound-btn notfound-btn-primary"
              onClick={handleGoHome}
            >
              Go Home
            </button>
            
            <button 
              className="notfound-btn notfound-btn-secondary"
              onClick={handleGoBack}
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;