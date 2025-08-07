import React from "react";

import "../CSS/About.css";

function About() {
  return (
    <div className="about_main">   
     <section className="about-section">
      <div className="about-header">
        <h1>About <span>Saathsource</span></h1>
        <p>
          Bridging licensed pharmacies, wholesalers, and manufacturers for seamless B2B growth in the pharmaceutical sector.
        </p>
      </div>

      <div className="about-details">
        <div className="about-box">
          <img src="https://www.bing.com/th/id/OIP.QSsd2p6np_J8y66x3tKbRQHaD8?w=240&h=211&c=8&rs=1&qlt=70&o=7&cb=thws4&dpr=1.1&pid=3.1&rm=3" alt="Mission" />
          <div className="text-content">
            <h2>Our Mission</h2>
            <p>
              Empowering businesses with seamless, compliant, and efficient B2B transactions — all in one digital platform.
            </p>
          </div>
        </div>

        <div className="about-box reverse">
          <img src="https://www.bing.com/th/id/OIP.yOoPMLCyNR12PFhAMvcUZAHaEK?w=240&h=211&c=8&rs=1&qlt=70&o=7&cb=thws4&dpr=1.1&pid=3.1&rm=3" alt="Vision" />
          <div className="text-content">
            <h2>Our Vision</h2>
            <p>
              To become the leading B2B hub in pharma, promoting trust, innovation, and long-term partnerships.
            </p>
          </div>
        </div>

        <div className="about-box">
          <img src="https://www.bing.com/th/id/OIP.9QFLs5SSy0m7yff0q8ap6QHaFY?w=255&h=211&c=8&rs=1&qlt=70&o=7&cb=thws4&dpr=1.1&pid=3.1&rm=3" alt="Offerings" />
          <div className="text-content">
            <h2>What We Offer</h2>
            <ul>
              <li>✅ Verified buyers & sellers</li>
              <li>✅ Secure, compliant trades</li>
              <li>✅ Transparent pricing & data</li>
              <li>✅ Tools for easy communication</li>
              <li>✅ Growth-focused platform</li>
            </ul>
          </div>
        </div>
      </div>

      <h2 className="team-title">Meet Our Team</h2>
      <div className="team-container">
        <div className="team-card">
          <img src="https://static.vecteezy.com/system/resources/previews/022/352/371/non_2x/showing-apps-or-ads-on-blank-screen-smartphone-of-handsome-asian-man-isolated-on-white-background-free-photo.jpg" alt="Team Member" />
          <h3>Amit Mehra</h3>
          <p>CEO & Co-Founder</p>
        </div>

        <div className="team-card">
          <img src="https://tse1.mm.bing.net/th/id/OIP.dyDuETi20xK38PbqPSqr2wHaF7?r=0&w=1024&h=819&rs=1&pid=ImgDetMain&o=7&rm=3" alt="Team Member" />
          <h3>Priya Sharma</h3>
          <p>Head of Operations</p>
        </div>

        <div className="team-card">
          <img src="https://th.bing.com/th/id/OIP.SfCjPEK970kXHsowxiCd0wHaE8?w=278&h=185&c=7&r=0&o=5&dpr=1.1&pid=1.7" alt="Team Member" />
          <h3>Ravi Desai</h3>
          <p>Lead Developer</p>
        </div>
      </div>

      <div className="join-cta">
        <h2>Join Us Today!</h2>
        <p>Be part of the revolution in pharmaceutical B2B commerce.</p>
        <button>Get Started</button>
      </div>
    </section>
    </div>
  )
}

export default About