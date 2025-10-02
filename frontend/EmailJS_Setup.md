# EmailJS Setup Instructions

## Overview

The ProfileDashboard component now includes EmailJS integration for sending inquiry emails to sellers. Follow these steps to set up EmailJS:

## Step 1: Create EmailJS Account

1. Go to [EmailJS.com](https://www.emailjs.com/)
2. Sign up for a free account
3. Verify your email address

## Step 2: Create Email Service

1. In your EmailJS dashboard, go to "Email Services"
2. Click "Add New Service"
3. Choose your email provider (Gmail, Outlook, etc.)
4. Follow the setup instructions for your provider
5. Note down your **Service ID**

## Step 3: Create Email Template

1. Go to "Email Templates" in your dashboard
2. Click "Create New Template"
3. Use this template structure (or use the existing template_hq7t1cb):

```
Thank You for connection

We'll connect You Soon 🤝

Order # {{order_id}}
{{#orders}}
{{name}}
QTY: {{units}}

{{/orders}}
```

4. Save the template and note down your **Template ID**
   - Current template ID: `template_hq7t1cb`

## Step 4: Get Public Key

1. Go to "Account" → "General"
2. Find your **Public Key** (User ID)

## Step 5: Update the Code

In `ProfileDashboard.jsx`, the EmailJS configuration is already set up around line 380:

```javascript
await emailjs.send(
  "service_hjz2pqr", // Your EmailJS service ID
  "template_hq7t1cb", // Your EmailJS template ID
  templateParams,
  {
    publicKey: "ZpEEdREOAAWs3Qh0r", // Your EmailJS public key in options object
  }
);
```

**Note**: The credentials are already configured. If you need to change them, update the values above.

## Step 6: Test the Integration

1. Create some test inquiries from the Product page
2. Go to ProfileDashboard
3. Click "Send Mail" for a seller
4. Select products and send the email
5. Check if the email is received

## Troubleshooting

- Make sure your email service is properly configured
- Check the browser console for any errors
- Verify that all IDs are correctly copied
- Ensure your EmailJS account has sufficient quota

## Security Note

For production applications, consider implementing server-side email sending to keep your EmailJS credentials secure.
