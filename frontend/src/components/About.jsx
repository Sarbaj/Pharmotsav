import React, { useEffect, useRef } from "react";
import video1 from "../assets/video1.mp4";
import "../CSS/About.css";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);
function About() {
  const video = useRef(null);
  const page1 = useRef(null);
  const cover1 = useRef(null);
  const page2 = useRef(null);
  useEffect(() => {
    if (video.current && page1.current) {
      gsap.fromTo(
        video.current,
        { top: "15rem" }, // initial position
        {
          top: "0rem", // final position on scroll
          width: "80rem",
          height: "40rem",
          duration: 1,
          ease: "none",
          scrollTrigger: {
            trigger: page1.current,
            start: "top 20%", // start animation when page1 top hits 50% viewport
            end: "bottom 20%", // end animation at bottom 20% viewport
            scrub: true,
            pin: true,
          },
        }
      );
    }
    if (page2.current && cover1.current) {
      gsap.fromTo(
        cover1.current,
        { top: "0rem" }, // initial position
        {
          top: "-45rem", // final position on scroll
          duration: 1,
          ease: "none",
          scrollTrigger: {
            trigger: page2.current,
            start: "top 4%", // start animation when page1 top hits 50% viewport
            end: "bottom 20%", // end animation at bottom 20% viewport
            scrub: true,
            pin: true,
          },
        }
      );
    }
  }, []);
  return (
    <div className="about_main">
      <div className="page1" ref={page1}>
        <h1>
          Simplifying B2B pharma connections for trusted and efficient business.
        </h1>
        <video ref={video} src={video1} autoPlay loop muted playsInline>
          Your browser does not support the video tag.
        </video>
      </div>
      <div className="page2" ref={page2}>
        <div className="page2container">
          <div className="coverblack" ref={cover1}>
            <h1>
              Why <span style={{ color: "#2497fe" }}>Saath</span>
              <span style={{ color: "#14db9a" }}>source</span> ?
            </h1>
          </div>
          <div className="teamdiv">
            <div className="teamcard">
              <h2>About Saathsource</h2>
              <p>
                Saathsource is your dedicated gateway to the global healthcare
                and pharmaceutical industry. We provide a seamless B2B
                marketplace that connects procurers and suppliers worldwide. Our
                platform streamlines international trade, offering faster
                sourcing, better matching, and secure transactions to simplify
                global B2B trade and empower businesses with efficient and
                scalable solutions.
              </p>
            </div>
            <div className="teamcard">
              <h2>Mission & Vision</h2>
              <p>
                At Saathsource, our mission is to simplify global B2B trade by
                connecting procurers and suppliers on a seamless, intelligent,
                and scalable platform that enables efficient sourcing and secure
                international transactions. Our vision is to become the world’s
                most trusted B2B sourcing platform, driving global trade through
                transparent partnerships, innovative technology, and seamless
                supply chain.
              </p>
            </div>
          </div>
          <div className="infodiv">
            <h2>Ready To Partner With Saathsource ?</h2>
            <p>
              Partnering with Saathsource helps your business find suppliers and
              buyers from all over the world easily and quickly. The platform
              matches you smartly to save time and money. With Saathsource, you
              get reliable partners and better connections to grow and run your
              business well in the pharmaceutical field and more.
            </p>
            <div className="divbtn">
              <button>Contact Us</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default About;
