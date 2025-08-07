import React, { useState } from "react";
import Card from "../Content_Cards/Card";
import "../../CSS/Seller.css";

function Seller() {
  const [data, setdata] = useState([
    {
      imageurl:
        "https://images.unsplash.com/photo-1483935254693-d16df5d8741a?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjB8fHdoaXRlc2FoZGV8ZW58MHx8MHx8fDA%3D",
      title: "Card 1 Rendered",
      content:
        "Connect your licensed pharmacy or manufacturing business with trusted buyers in a few easy steps.",
    },
    {
      imageurl:
        "https://images.unsplash.com/photo-1528750164675-112c3f715fd9?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fHdoaXRlc2FoZGV8ZW58MHx8MHx8fDA%3D",
      title: "Card 2 Rendered",
      content:
        "Expand your sales channels across verified wholesale and retail networks seamlessly.",
    },
    {
      imageurl:
        "https://images.unsplash.com/photo-1508784411316-02b8cd4d3a3a?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTZ8fHdoaXRlc2FoZGV8ZW58MHx8MHx8fDA%3D",
      title: "Card 3 Rendered",
      content:
        "Ensure transparent deals with secure payment processes and real-time tracking.",
    },
    {
      imageurl:
        "https://images.unsplash.com/photo-1584928585752-4a7e7acbb08b?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8d2hpdGVzYWhkZXxlbnwwfHwwfHx8MA%3D%3D",
      title: "Card 4 Rendered",
      content:
        "Get insights on buyer behavior, demand trends, and product visibility.",
    },
  ]);

  return (
    <>
      <div>
        <div className="Seller_first_section">
          <div className="Seller_first_content">
            <div className="Seller_first_title">
              <h1>Selling Pharma & Healthcare Products Made Smarter</h1>
            </div>
            <p>List, Connect & Grow Your Reach Effortlessly.</p>
            <button className="Seller_button_start">Start Selling</button>
          </div>
          <div className="Seller_first_image">
            <img
              src="https://media.istockphoto.com/id/1281242223/photo/a-white-dove-sits-on-the-first-snow.webp?a=1&b=1&s=612x612&w=0&k=20&c=6hTkF29p5av6YMGoqEXkn7Q4HAoRh29uKW1K_c1Ix0c="
              alt=""
            />
          </div>
        </div>

        <h2 className="seller_guid_title">Seller's Guide</h2>
        <div className="Seller_all_card">
          {data.map((data, ind) => {
            return (
              <Card
                key={ind}
                image={data.imageurl}
                title={data.title}
                content={data.content}
                reverse={ind % 2 !== 0}
              />
            );
          })}
        </div>
      </div>
    </>
  );
}

export default Seller;
