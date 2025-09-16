import React from "react";
import "../../CSS/BSCard.css";
function Card({ image, title, content, reverse }) {
  return (
    <div className={`card_container ${reverse ? "reverse" : ""}`}>
      <div className="image_container">
        <img src={image} alt="card" className="card_image" />
      </div>
      <div className="card_content_container">
        <h3 className="card_title">{title}</h3>
        <p className="card_content">{content}</p>
      </div>
    </div>
  );
}

export default Card;
