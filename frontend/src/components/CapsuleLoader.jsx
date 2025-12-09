import React, { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";
import "../CSS/CapsuleLoader.css";

const CapsuleLoader = ({ onComplete }) => {
  const [isAnimating, setIsAnimating] = useState(true);
  const overlayRef = useRef(null);
  const capsuleRef = useRef(null);
  const topHalfRef = useRef(null);
  const bottomHalfRef = useRef(null);
  const saathRef = useRef(null);
  const sourceRef = useRef(null);
  const powderRef = useRef(null);

  useEffect(() => {
    const tl = gsap.timeline({
      onComplete: () => {
        setTimeout(() => {
          setIsAnimating(false);
          if (onComplete) {
            onComplete();
          }
        }, 300);
      },
    });

    // Initial state - capsule and text off screen together
    gsap.set(capsuleRef.current, {
      scale: 0.3,
      rotation: -90,
      opacity: 0,
    });

    gsap.set([saathRef.current, sourceRef.current], {
      opacity: 1,
    });

    // Animation sequence
    tl
      // 1. Capsule enters with rotation and scale (text comes with it)
      .to(capsuleRef.current, {
        scale: 1,
        rotation: 0,
        opacity: 1,
        duration: 1.2,
        ease: "back.out(1.7)",
      })
      // 2. Subtle floating animation
      .to(capsuleRef.current, {
        y: -10,
        duration: 0.8,
        ease: "sine.inOut",
        yoyo: true,
        repeat: 1,
      })
      // 3. Pulsing glow effect
      .to(
        [topHalfRef.current, bottomHalfRef.current],
        {
          boxShadow: "0 20px 80px rgba(59, 130, 246, 0.6)",
          duration: 0.5,
          yoyo: true,
          repeat: 1,
        },
        "-=0.3"
      )
      // 4. Pause before split
      .to({}, { duration: 0.5 })
      // 5. Text fades out
      .to([saathRef.current, sourceRef.current], {
        opacity: 0,
        scale: 0.8,
        duration: 0.3,
      })
      // 6. Capsule shakes before split
      .to(capsuleRef.current, {
        x: -5,
        duration: 0.05,
        yoyo: true,
        repeat: 5,
      })
      // 7. Split animation with rotation and movement
      .to(
        topHalfRef.current,
        {
          x: -400,
          y: -200,
          rotation: -180,
          opacity: 0,
          duration: 1,
          ease: "power2.in",
        },
        "split"
      )
      .to(
        bottomHalfRef.current,
        {
          x: 400,
          y: 200,
          rotation: 180,
          opacity: 0,
          duration: 1,
          ease: "power2.in",
        },
        "split"
      )
      // 8. Powder explosion
      .to(
        powderRef.current.children,
        {
          opacity: 1,
          scale: 0.8,
          x: () => gsap.utils.random(-200, 200),
          y: () => gsap.utils.random(-200, 200),
          rotation: () => gsap.utils.random(-360, 360),
          duration: 1,
          ease: "power2.out",
          stagger: {
            amount: 0.2,
            from: "center",
          },
        },
        "split+=0.2"
      )
      // 9. Fade out overlay
      .to(overlayRef.current, {
        opacity: 0,
        duration: 0.5,
      });

    return () => {
      tl.kill();
    };
  }, [onComplete]);

  if (!isAnimating) return null;

  return (
    <div className="capsule-loader-overlay" ref={overlayRef}>
      <div className="capsule-container" ref={capsuleRef}>
        {/* Top half of capsule (Blue - Saath) */}
        <div className="capsule-half capsule-top" ref={topHalfRef}>
          <div className="capsule-shine"></div>
          <div className="capsule-highlight"></div>
          <div className="capsule-reflection"></div>
        </div>

        {/* Bottom half of capsule (Green - Source) */}
        <div className="capsule-half capsule-bottom" ref={bottomHalfRef}>
          <div className="capsule-shine"></div>
          <div className="capsule-highlight"></div>
          <div className="capsule-reflection"></div>
        </div>

        {/* Powder particles */}
        <div className="powder-container" ref={powderRef}>
          {[...Array(40)].map((_, i) => (
            <div
              key={i}
              className={`powder-particle ${
                i % 3 === 0 ? "powder-blue" : i % 3 === 1 ? "powder-green" : "powder-white"
              }`}
            ></div>
          ))}
        </div>

        {/* Brand text inside capsule */}
        <div className="capsule-text">
          <span className="brand-saath" ref={saathRef}>
            Saath
          </span>
          <span className="brand-source" ref={sourceRef}>
            Source
          </span>
        </div>
      </div>
    </div>
  );
};

export default CapsuleLoader;
