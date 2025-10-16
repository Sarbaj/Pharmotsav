import crypto from "crypto";
import { createTransport } from "nodemailer";

// Create SMTP transporter
const createTransporter = () => {
  return createTransport({
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: process.env.SMTP_PORT || 587,
    secure: process.env.SMTP_SECURE === "true" || false, // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
    tls: {
      rejectUnauthorized: false, // For self-signed certificates
    },
  });
};

/**
 * Send email verification OTP
 * @param {string} email - The email address to send OTP to
 * @param {string} otp - The OTP to send
 * @param {string} firstName - The user's first name
 * @returns {Promise<boolean>} Success status
 */
export const sendEmailVerificationOTP = async (email, otp, firstName) => {
  try {
    // Check if email service is configured
    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
      throw new Error(
        "Email service configuration missing. Please configure SMTP_USER and SMTP_PASS environment variables."
      );
    }

    const transporter = createTransporter();

    const mailOptions = {
      from: process.env.SMTP_USER,
      to: email,
      subject: "Verify Your Email - SaathSource",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background-color: #f8f9fa; padding: 20px; text-align: center;">
            <h1 style="color: #2c3e50; margin: 0;">Saathsource</h1>
            <p style="color: #7f8c8d; margin: 5px 0 0 0;">Your Pharmaceutical Marketplace</p>
          </div>
          
          <div style="padding: 30px 20px; background-color: white;">
            <h2 style="color: #2c3e50; margin-top: 0;">Hello ${firstName}!</h2>
            
            <p style="color: #34495e; line-height: 1.6;">
              Thank you for registering with Saathsource. To complete your registration, 
              please verify your email address using the OTP below:
            </p>
            
            <div style="background-color: #ecf0f1; padding: 20px; text-align: center; margin: 20px 0; border-radius: 8px;">
              <h1 style="color: #e74c3c; font-size: 32px; margin: 0; letter-spacing: 5px;">${otp}</h1>
            </div>
            
            <p style="color: #7f8c8d; font-size: 14px;">
              This OTP will expire in 10 minutes. If you didn't request this verification, 
              please ignore this email.
            </p>
            
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ecf0f1;">
              <p style="color: #95a5a6; font-size: 12px; margin: 0;">
                Best regards,<br>
                The SaathSource Team
              </p>
            </div>
          </div>
        </div>
      `,
    };

    const result = await transporter.sendMail(mailOptions);
    console.log(
      `Email verification OTP sent successfully. Message ID: ${result.messageId}`
    );
    return true;
  } catch (error) {
    console.error("Error sending email verification OTP:", error);
    throw new Error("Failed to send email verification OTP");
  }
};

/**
 * Send welcome email after successful registration
 * @param {string} email - The email address to send welcome email to
 * @param {string} firstName - The user's first name
 * @returns {Promise<boolean>} Success status
 */
export const sendWelcomeEmail = async (email, firstName) => {
  try {
    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
      throw new Error(
        "Email service configuration missing. Please configure SMTP_USER and SMTP_PASS environment variables."
      );
    }

    const transporter = createTransporter();

    const mailOptions = {
      from: process.env.SMTP_USER,
      to: email,
      subject: "Welcome to Saathsource!",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background-color: #27ae60; padding: 20px; text-align: center;">
            <h1 style="color: white; margin: 0;">Welcome to Saathsource!</h1>
            <p style="color: #d5f4e6; margin: 5px 0 0 0;">Your Pharmaceutical Marketplace</p>
          </div>
          
          <div style="padding: 30px 20px; background-color: white;">
            <h2 style="color: #2c3e50; margin-top: 0;">Hello ${firstName}!</h2>
            
            <p style="color: #34495e; line-height: 1.6;">
              Congratulations! Your buyer account has been successfully created and verified. 
              You can now start exploring our vast catalog of pharmaceutical products.
            </p>
            
            <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #2c3e50; margin-top: 0;">What you can do now:</h3>
              <ul style="color: #34495e; line-height: 1.8;">
                <li>Browse our extensive product catalog</li>
                <li>Submit inquiries for products you're interested in</li>
                <li>Connect with verified pharmaceutical suppliers</li>
                <li>Track your inquiries and responses</li>
              </ul>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.FRONTEND_URL || "http://localhost:3000"}" 
                 style="background-color: #3498db; color: white; padding: 12px 30px; 
                        text-decoration: none; border-radius: 5px; display: inline-block;">
                Start Exploring
              </a>
            </div>
            
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ecf0f1;">
              <p style="color: #95a5a6; font-size: 12px; margin: 0;">
                Best regards,<br>
                The Saathsource Team
              </p>
            </div>
          </div>
        </div>
      `,
    };

    const result = await transporter.sendMail(mailOptions);
    console.log(
      `Welcome email sent successfully. Message ID: ${result.messageId}`
    );
    return true;
  } catch (error) {
    console.error("Error sending welcome email:", error);
    throw new Error("Failed to send welcome email");
  }
};

/**
 * Send password reset email
 * @param {string} email - The email address to send reset link to
 * @param {string} firstName - The user's first name
 * @param {string} resetToken - The password reset token
 * @returns {Promise<boolean>} Success status
 */
export const sendPasswordResetEmail = async (email, firstName, resetToken) => {
  try {
    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
      throw new Error(
        "Email service configuration missing. Please configure SMTP_USER and SMTP_PASS environment variables."
      );
    }

    const transporter = createTransporter();
    const resetUrl = `${
      process.env.FRONTEND_URL || "http://localhost:3000"
    }/reset-password?token=${resetToken}`;

    const mailOptions = {
      from: process.env.SMTP_USER,
      to: email,
      subject: "Reset Your Password - SaathSource",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background-color: #e74c3c; padding: 20px; text-align: center;">
            <h1 style="color: white; margin: 0;">Password Reset Request</h1>
            <p style="color: #fadbd8; margin: 5px 0 0 0;">SaathSource - Your Pharmaceutical Marketplace</p>
          </div>
          
          <div style="padding: 30px 20px; background-color: white;">
            <h2 style="color: #2c3e50; margin-top: 0;">Hello ${firstName}!</h2>
            
            <p style="color: #34495e; line-height: 1.6;">
              We received a request to reset your password for your SaathSource account. 
              If you made this request, click the button below to reset your password:
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${resetUrl}" 
                 style="background-color: #e74c3c; color: white; padding: 15px 30px; 
                        text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">
                Reset Password
              </a>
            </div>
            
            <p style="color: #7f8c8d; font-size: 14px;">
              If the button doesn't work, you can copy and paste this link into your browser:
            </p>
            <p style="color: #3498db; font-size: 12px; word-break: break-all; background-color: #f8f9fa; padding: 10px; border-radius: 4px;">
              ${resetUrl}
            </p>
            
            <div style="background-color: #fff3cd; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ffc107;">
              <p style="color: #856404; margin: 0; font-size: 14px;">
                <strong>Important:</strong> This link will expire in 15 minutes for security reasons. 
                If you didn't request this password reset, please ignore this email.
              </p>
            </div>
            
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ecf0f1;">
              <p style="color: #95a5a6; font-size: 12px; margin: 0;">
                Best regards,<br>
                The SaathSource Team
              </p>
            </div>
          </div>
        </div>
      `,
    };

    const result = await transporter.sendMail(mailOptions);
    console.log(
      `Password reset email sent successfully. Message ID: ${result.messageId}`
    );
    return true;
  } catch (error) {
    console.error("Error sending password reset email:", error);
    throw new Error("Failed to send password reset email");
  }
};

/**
 * Generate email verification token
 * @returns {string} Verification token
 */
export const generateEmailVerificationToken = () => {
  return crypto.randomBytes(32).toString("hex");
};
