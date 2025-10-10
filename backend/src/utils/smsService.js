import twilio from "twilio";

// Initialize Twilio client
const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

/**
 * Send OTP SMS using Twilio
 * @param {string} mobileNumber - The mobile number to send SMS to
 * @param {string} otp - The OTP to send
 * @returns {Promise<boolean>} Success status
 */
export const sendOTPSMS = async (mobileNumber, otp) => {
  try {
    // Check if Twilio is configured
    if (
      !process.env.TWILIO_ACCOUNT_SID ||
      !process.env.TWILIO_AUTH_TOKEN ||
      !process.env.TWILIO_PHONE_NUMBER
    ) {
      throw new Error("Twilio configuration missing");
    }

    // Format mobile number (ensure it starts with +)
    const formattedNumber = mobileNumber.startsWith("+")
      ? mobileNumber
      : `+${mobileNumber}`;

    const message = await client.messages.create({
      body: `Your SaathSource verification code is: ${otp}. This code will expire in 10 minutes.`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: formattedNumber,
    });

    console.log(`SMS sent successfully. SID: ${message.sid}`);
    return true;
  } catch (error) {
    console.error("Error sending SMS:", error);
    throw new Error("Failed to send SMS");
  }
};

/**
 * Send welcome SMS after successful registration
 * @param {string} mobileNumber - The mobile number to send SMS to
 * @param {string} firstName - The user's first name
 * @returns {Promise<boolean>} Success status
 */
export const sendWelcomeSMS = async (mobileNumber, firstName) => {
  try {
    if (
      !process.env.TWILIO_ACCOUNT_SID ||
      !process.env.TWILIO_AUTH_TOKEN ||
      !process.env.TWILIO_PHONE_NUMBER
    ) {
      throw new Error("Twilio configuration missing");
    }

    const formattedNumber = mobileNumber.startsWith("+")
      ? mobileNumber
      : `+${mobileNumber}`;

    const message = await client.messages.create({
      body: `Welcome to Saathsource, ${firstName}! Your seller account has been created successfully.`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: formattedNumber,
    });

    console.log(`Welcome SMS sent successfully. SID: ${message.sid}`);
    return true;
  } catch (error) {
    console.error("Error sending welcome SMS:", error);
    throw new Error("Failed to send welcome SMS");
  }
};
