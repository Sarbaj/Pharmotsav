import React, { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "../CSS/Contact.css";
import { API_BASE_URL, API_ENDPOINTS } from "../config/api";

gsap.registerPlugin(ScrollTrigger);

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState("");
  
  const formRef = useRef(null);
  const infoRef = useRef(null);
  const mapRef = useRef(null);
  const quickContactRef = useRef([]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  useEffect(() => {
    // Quick contact items animation
    quickContactRef.current.forEach((item, index) => {
      if (item) {
        // Set initial state
        gsap.set(item, {
          opacity: 0,
          y: 30,
          scale: 0.9,
        });
        
        // Animate to visible state
        gsap.to(item, {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.7,
          delay: 0.3 + index * 0.2,
          ease: "back.out(1.7)",
        });
      }
    });

    // Form animation
    if (formRef.current) {
      gsap.from(formRef.current, {
        scrollTrigger: {
          trigger: formRef.current,
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
        opacity: 0,
        x: -50,
        duration: 0.8,
        ease: "power3.out",
      });
    }

    // Info section animation
    if (infoRef.current) {
      gsap.from(infoRef.current, {
        scrollTrigger: {
          trigger: infoRef.current,
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
        opacity: 0,
        x: 50,
        duration: 0.8,
        ease: "power3.out",
      });
    }

    // Map animation
    if (mapRef.current) {
      gsap.from(mapRef.current, {
        scrollTrigger: {
          trigger: mapRef.current,
          start: "top 85%",
          toggleActions: "play none none reverse",
        },
        opacity: 0,
        y: 50,
        duration: 1,
        ease: "power2.out",
      });
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus("");

    try {
      const response = await fetch(`${API_ENDPOINTS.CONTACT.SUBMIT}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        setSubmitStatus("success");
        setFormData({ name: "", email: "", subject: "", message: "" });
        // Reset status after 5 seconds
        setTimeout(() => setSubmitStatus(""), 5000);
      } else {
        setSubmitStatus("error");
        setTimeout(() => setSubmitStatus(""), 5000);
      }
    } catch (error) {
      console.error("Error sending message:", error);
      setSubmitStatus("error");
      setTimeout(() => setSubmitStatus(""), 5000);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="contact-section">
      <div className="contact-container">
        {/* Header Section */}
        <div className="contact-header">
          <h1 className="contact-title">Get In Touch</h1>
          <p className="contact-subtitle">
            Ready to transform your pharmaceutical business? Let's discuss how
            SaathSource can help you connect with the right partners and grow
            your network.
          </p>
        </div>



        <div className="contact-content">
          {/* Contact Form */}
          <div className="form-section" ref={formRef}>
            <div className="form-header">
              <h2>Send us a Message</h2>
              <p>We'll get back to you within 24 hours</p>
            </div>

            <form className="contact-form" onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="name">
                    <span className="label-text">Full Name</span>
                    <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter your full name"
                    required
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email">
                    <span className="label-text">Email Address</span>
                    <span className="required">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="your.email@example.com"
                    required
                    className="form-input"
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="subject">
                  <span className="label-text">Subject</span>
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  placeholder="What's this about?"
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label htmlFor="message">
                  <span className="label-text">Message</span>
                  <span className="required">*</span>
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  rows={6}
                  placeholder="Tell us about your requirements, questions, or how we can help you..."
                  required
                  className="form-textarea"
                ></textarea>
              </div>

              <button
                type="submit"
                className={`submit-button ${isSubmitting ? "loading" : ""}`}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <span className="spinner"></span>
                    Sending...
                  </>
                ) : (
                  <>
                    <span className="button-icon">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
                      </svg>
                    </span>
                    Send Message
                  </>
                )}
              </button>

              {submitStatus === "success" && (
                <div className="success-message">
                  ✅ Message sent successfully! We'll get back to you soon.
                </div>
              )}

              {submitStatus === "error" && (
                <div className="error-message">
                  ❌ Failed to send message. Please try again.
                </div>
              )}
            </form>
          </div>

          {/* Contact Information */}
          <div className="info-section" ref={infoRef}>
            <div className="info-header">
              <h2>Contact Information</h2>
              <p>Reach out to us through any of these channels</p>
            </div>

            <div className="contact-methods">
              <div className="contact-method">
                <div className="method-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                  </svg>
                </div>
                <div className="method-content">
                  <h3>Office Address</h3>
                  <p>
                    123 Pharma Street
                    <br />
                    Health City, HC 12345
                    <br />
                    Country
                  </p>
                </div>
              </div>

              <div className="contact-method">
                <div className="method-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                  </svg>
                </div>
                <div className="method-content">
                  <h3>Email Us</h3>
                  <p>
                    contact@saathsource.com
                    <br />
                    support@saathsource.com
                  </p>
                </div>
              </div>

              <div className="contact-method">
                <div className="method-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
                  </svg>
                </div>
                <div className="method-content">
                  <h3>Call Us</h3>
                  <p>
                    +1 (555) 123-4567
                    <br />
                    +1 (555) 987-6543
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Map Section */}
        <div className="map-section" ref={mapRef}>
          <h2 className="map-title">Find Us Here</h2>
          <div className="map-container">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d235013.74842443654!2d72.41493028359374!3d23.020474!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x395e848aba5bd449%3A0x4fcedd11614f6516!2sAhmedabad%2C%20Gujarat!5e0!3m2!1sen!2sin!4v1234567890123!5m2!1sen!2sin"
              width="100%"
              height="450"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Ahmedabad Location"
            ></iframe>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;

// push to github from virpal gayyyyyy to sarbaz

