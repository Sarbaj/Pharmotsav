import React, { useState, useRef, useEffect } from "react";
import "../CSS/VideoLoader.css";
import capsuleVideo from "../assets/video/Capsule_vidio.mp4";

const VideoLoader = ({ onComplete }) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [showWhiteOverlay, setShowWhiteOverlay] = useState(false);
  const videoRef = useRef(null);
  const overlayRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    
    if (video) {
      // Play video
      video.play().catch((error) => {
        console.log("Video autoplay failed:", error);
      });

      // Handle time update to show white overlay at 6 seconds
      const handleTimeUpdate = () => {
        if (video.currentTime >= 6 && !showWhiteOverlay) {
          setShowWhiteOverlay(true);
        }
      };

      // Handle video end
      const handleVideoEnd = () => {
        setIsPlaying(false);
        if (onComplete) {
          onComplete();
        }
      };

      video.addEventListener("timeupdate", handleTimeUpdate);
      video.addEventListener("ended", handleVideoEnd);

      return () => {
        video.removeEventListener("timeupdate", handleTimeUpdate);
        video.removeEventListener("ended", handleVideoEnd);
      };
    }
  }, [onComplete, showWhiteOverlay]);

  if (!isPlaying) return null;

  return (
    <div className="video-loader-overlay">
      <video
        ref={videoRef}
        className="video-loader"
        muted
        playsInline
        preload="auto"
      >
        <source src={capsuleVideo} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      {showWhiteOverlay && (
        <div ref={overlayRef} className="white-fade-overlay"></div>
      )}
    </div>
  );
};

export default VideoLoader;
