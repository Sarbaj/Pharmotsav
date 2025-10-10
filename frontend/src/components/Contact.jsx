import React, { useState } from "react";
import "../CSS/Contact.css";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus("");

    try {
      const response = await fetch("http://localhost:4000/api/v1/contact", {
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
          <div className="form-section">
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
                    <span className="button-icon">📧</span>
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
          <div className="info-section">
            <div className="info-header">
              <h2>Contact Information</h2>
              <p>Reach out to us through any of these channels</p>
            </div>

            <div className="contact-methods">
              <div className="contact-method">
                <div className="method-icon">📍</div>
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
                <div className="method-icon">📧</div>
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
                <div className="method-icon">📞</div>
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
      </div>
    </section>
  );
};

export default Contact;

// push to github from virpal gayyyyyy to sarbaz
