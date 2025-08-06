import React, { useState } from "react";
import Card from "../Content_Cards/Card";

function Buyer() {
  const [data, setdata] = useState([
    {
      imageurl:
        "https://fastly.picsum.photos/id/296/500/500.jpg?hmac=rBOzu8mvOZGUCyndcJPEmZzwmm_cPMgHHVOma9uAbhk",
      title: "Card 1 Rendered",
      content:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Excepturi sapiente deleniti illo optio qui eaque, tenetur consectetur, dicta cumque accusamus quis dolore possimus eum vel.",
    },
    {
      imageurl:
        "https://fastly.picsum.photos/id/237/500/500.jpg?hmac=idOEkrJhLd7nEU5pNrAGCyJ6HHJdR_sit1qDt5J3Wo0",
      title: "Card 2 Rendered",
      content:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Excepturi sapiente deleniti illo optio qui eaque, tenetur consectetur, dicta cumque accusamus quis dolore possimus eum vel.",
    },
    {
      imageurl:
        "https:www.shutterstock.com/image-vector/set-packaging-rectangular-boxes-mockups-side-2466739731",
      title: "Card 3 Rendered",
      content:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Excepturi sapiente deleniti illo optio qui eaque, tenetur consectetur, dicta cumque accusamus quis dolore possimus eum vel.",
    },
    {
      imageurl:
        "https://www.shutterstock.com/image-photo/close-lab-coat-doctor-pharmacy-medical-2308292631",
      title: "Card 4 Rendered",
      content:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Excepturi sapiente deleniti illo optio qui eaque, tenetur consectetur, dicta cumque accusamus quis dolore possimus eum vel.",
    },
  ]);

  return (
    <>
      <div className="Buyer_all_card">
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
    </>
  );
}

export default Buyer;
