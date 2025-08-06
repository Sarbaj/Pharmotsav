import React from "react";
import "../CSS/Contact.css";
const Contact = () => {
  return (
    <section className="contact-section container">
      <h2 className="title">Contact Us</h2>
      <p className="subtitle">
        Have questions or want to get in touch? Fill out the form below.
      </p>

      <div className="contact-content">
        <form className="contact-form">
          <label>
            Name*
            <input
              type="text"
              name="name"
              placeholder="Your full name"
              required
            />
          </label>
          <label>
            Email*
            <input
              type="email"
              name="email"
              placeholder="your.email@example.com"
              required
            />
          </label>
          <label>
            Subject
            <input
              type="text"
              name="subject"
              placeholder="Subject of your message"
            />
          </label>
          <label>
            Message*
            <textarea
              name="message"
              rows={5}
              placeholder="Write your message here"
              required
            ></textarea>
          </label>
          <button type="submit" className="submit-btn">
            Send Message
          </button>
        </form>

        <div className="contact-info">
          <h3>Our Office</h3>
          <p>123 Pharma Street, Health City, Country</p>
          <p>Email: contact@saathsource.com</p>
          <p>Phone: +123 456 7890</p>
          <h3>Business Hours</h3>
          <p>Mon - Fri: 9 AM to 6 PM</p>
          <p>Sat - Sun: Closed</p>
        </div>
      </div>
    </section>
  );
};

export default Contact;


// push to github from virpal to sarbaz