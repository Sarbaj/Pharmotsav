// Test script for OTP endpoints
import fetch from "node-fetch";

const BASE_URL = "http://localhost:4000/api/v1/otp";

async function testOTPFlow() {
  console.log("🧪 Testing OTP Flow...\n");

  try {
    // Test 1: Initiate OTP
    console.log("1️⃣ Testing OTP Initiation...");
    const initiateResponse = await fetch(`${BASE_URL}/initiate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        mobileNumber: "+1234567890",
        userData: {
          firstName: "Test",
          lastName: "User",
          email: "test@example.com",
        },
      }),
    });

    const initiateData = await initiateResponse.json();
    console.log("✅ Initiate Response:", initiateData);

    if (!initiateResponse.ok) {
      console.log("❌ Initiate failed:", initiateData);
      return;
    }

    // Test 2: Verify OTP (using a dummy OTP for testing)
    console.log("\n2️⃣ Testing OTP Verification...");
    const verifyResponse = await fetch(`${BASE_URL}/verify`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        mobileNumber: "+1234567890",
        otp: "123456", // Dummy OTP for testing
      }),
    });

    const verifyData = await verifyResponse.json();
    console.log("✅ Verify Response:", verifyData);

    // Test 3: Check OTP Status
    console.log("\n3️⃣ Testing OTP Status...");
    const statusResponse = await fetch(`${BASE_URL}/status/+1234567890`);
    const statusData = await statusResponse.json();
    console.log("✅ Status Response:", statusData);

    console.log("\n🎉 OTP Flow Test Completed!");
  } catch (error) {
    console.error("❌ Test failed:", error.message);
  }
}

// Run the test
testOTPFlow();
