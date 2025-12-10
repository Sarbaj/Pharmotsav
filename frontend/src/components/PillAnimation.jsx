import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "../CSS/PillAnimation.css";

gsap.registerPlugin(ScrollTrigger);

const PillAnimation = ({ onComplete }) => {
  const containerRef = useRef(null);
  const pillRef = useRef(null);
  const pillLeftRef = useRef(null);
  const pillRightRef = useRef(null);
  const sparklesRef = useRef([]);

  useEffect(() => {
    const container = containerRef.current;
    const pill = pillRef.current;
    const pillLeft = pillLeftRef.current;
    const pillRight = pillRightRef.current;

    if (!container || !pill || !pillLeft || !pillRight) return;

    // Create sparkles (reduced number for better performance)
    const sparkles = [];
    for (let i = 0; i < 12; i++) {
      const sparkle = document.createElement('div');
      sparkle.className = 'pill-sparkle';
      container.appendChild(sparkle);
      sparkles.push(sparkle);
      sparklesRef.current.push(sparkle);
    }

    // Set initial positions for sparkles
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    
    sparkles.forEach((sparkle, index) => {
      const angle = (index / sparkles.length) * Math.PI * 2;
      const distance = 250 + Math.random() * 200;
      const x = Math.cos(angle) * distance;
      const y = Math.sin(angle) * distance;
      
      gsap.set(sparkle, {
        left: centerX,
        top: centerY,
        scale: 0,
        opacity: 0,
        rotation: 0
      });
      
      sparkle.finalX = centerX + x;
      sparkle.finalY = centerY + y;
    });

    // Main animation timeline with optimized settings
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: container,
        start: "top top",
        end: "bottom top",
        scrub: 1, // Smoother scrub with slight delay
        invalidateOnRefresh: true,
        onComplete: () => {
          // Call onComplete after animation finishes
          setTimeout(() => {
            if (onComplete) onComplete();
          }, 300);
        }
      }
    });

    // Add sparkle animations to timeline
    // sparkles.forEach((sparkle, index) => {
    //   tl.to(sparkle, {
    //     left: sparkle.finalX,
    //     top: sparkle.finalY,
    //     scale: 1.5,
    //     opacity: 1,
    //     rotation: 360,
    //     duration: 0.3,
    //     ease: "power2.out"
    //   }, 0.2)
    //   .to(sparkle, {
    //     opacity: 0,
    //     scale: 0,
    //     duration: 0.2,
    //     ease: "power2.in"
    //   }, 0.6);
    // });

    // Add pill scaling and splitting animation
    tl.to(pill, {
            scale: 8,
            duration: 1,
            ease: "power2.out"
        }, 0.2)
        // Then split horizontally without rotation
        .to(pillLeft, {
            x: -300,
            duration: 2,
            ease: "power2.out"
        }, 0.4)
        .to(pillRight, {
            x: 300,
            duration: 2,
            ease: "power2.out"
        }, 0.4)
  .to([pillLeft, pillRight], {
            opacity: 0,
            scale: 0.5,
            duration: 0.3,
            ease: "power2.in"
        }, 0.7)

    .to(container, {
      opacity: 0,
      duration: 0.1,
      ease: "power2.in",
      onComplete: () => {
        if (onComplete) onComplete();
      }
    }, 0.9);

    // Cleanup function
    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
      sparklesRef.current.forEach(sparkle => {
        if (sparkle && sparkle.parentNode) {
          sparkle.parentNode.removeChild(sparkle);
        }
      });
      sparklesRef.current = [];
    };
  }, [onComplete]);

  return (
    <div className="pill-animation-container" ref={containerRef}>
      <div className="pill-hero-section">
        <div className="pill-container-wrapper">
          <div className="pill" ref={pillRef}>
            <div className="pill-half pill-left" ref={pillLeftRef}>
              Saath
            </div>
            <div className="pill-half pill-right" ref={pillRightRef}>
              Source
            </div>
          </div>
        </div>
      </div>
      <div className="pill-content-after">
        <h2>Scroll to continue...</h2>
      </div>
    </div>
  );
};

export default PillAnimation;