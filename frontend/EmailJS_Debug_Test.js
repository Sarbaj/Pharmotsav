// EmailJS Debug Test - Use this in browser console to test your template

// Test function to debug EmailJS template
function testEmailJS() {
  // Simple test data
  const testParams = {
    order_id: "TEST-123",
    orders: [
      { name: "Test Product 1", units: "1" },
      { name: "Test Product 2", units: "2" },
    ],
    to_email: "test@example.com",
    to_name: "Test Seller",
    from_name: "Test Buyer",
    from_email: "buyer@example.com",
  };

  console.log("Testing with params:", testParams);

  emailjs
    .send("service_hjz2pqr", "template_hq7t1cb", testParams, {
      publicKey: "ZpEEdREOAAWs3Qh0r",
    })
    .then(
      function (response) {
        console.log("SUCCESS!", response.status, response.text);
      },
      function (error) {
        console.log("FAILED...", error);
        console.log("Error details:", error.response || error.message);
      }
    );
}

// Alternative minimal test - ONLY template variables
function testEmailJSMinimal() {
  const minimalParams = {
    order_id: "MIN-TEST-123",
    orders: [{ name: "Minimal Test", units: "1" }],
    to_email: "test@example.com", // Required by EmailJS
  };

  console.log("Minimal test with params:", minimalParams);

  emailjs
    .send("service_hjz2pqr", "template_hq7t1cb", minimalParams, {
      publicKey: "ZpEEdREOAAWs3Qh0r",
    })
    .then(
      function (response) {
        console.log("MINIMAL SUCCESS!", response.status, response.text);
      },
      function (error) {
        console.log("MINIMAL FAILED...", error);
        console.log("Error details:", error.response || error.message);
      }
    );
}

// Ultra minimal test - matching your exact format
function testUltraMinimal() {
  const ultraMinimalParams = {
    order_id: "ULTRA-123",
    orders: [{ name: "Ultra Test", units: "1" }],
    name: "Test Buyer",
    email: "sarbajmalek3456@gmail.com",
  };

  console.log("Ultra minimal test with params:", ultraMinimalParams);

  emailjs
    .send("service_hjz2pqr", "template_hq7t1cb", ultraMinimalParams, {
      publicKey: "ZpEEdREOAAWs3Qh0r",
    })
    .then(
      function (response) {
        console.log("ULTRA SUCCESS!", response.status, response.text);
      },
      function (error) {
        console.log("ULTRA FAILED...", error);
        console.log("Error details:", error.response || error.message);
      }
    );
}

// Test with your exact template format (removed 'name' field)
function testYourFormat() {
  const testParams = {
    order_id: "TEST-ORDER-123",
    orders: [
      { name: "Test Product 1", units: "2" },
      { name: "Test Product 2", units: "1" },
    ],
    email: "sarbajmalek3456@gmail.com",
  };

  console.log("Testing with exact template params:", testParams);

  emailjs
    .send("service_hjz2pqr", "template_hq7t1cb", testParams, {
      publicKey: "ZpEEdREOAAWs3Qh0r",
    })
    .then(
      function (response) {
        console.log("YOUR FORMAT SUCCESS!", response.status, response.text);
      },
      function (error) {
        console.log("YOUR FORMAT FAILED...", error);
        console.log("Error details:", error.response || error.message);
      }
    );
}

// Instructions:
// 1. Open browser console on your ProfileDashboard page
// 2. Copy and paste this entire code
// 3. Run: testYourFormat() - Uses your exact format
// 4. If that works, try: testUltraMinimal() - Template variables
// 5. If that works, try: testEmailJS() - Full parameters
// 6. Check console for detailed error messages

// Your template structure:
// Thank You for connection
// We'll connect You Soon 🤝
// Order # {{order_id}}
// {{#orders}}
// {{name}}
// QTY: {{units}}
// {{/orders}}
