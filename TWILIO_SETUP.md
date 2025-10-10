# Twilio SMS Setup Guide

## 1. Create Twilio Account

1. Go to [twilio.com](https://twilio.com)
2. Sign up for a free account
3. Verify your phone number
4. Complete account setup

## 2. Get Twilio Credentials

1. Login to [Twilio Console](https://console.twilio.com)
2. Go to **Settings** → **General**
3. Copy your:
   - **Account SID**
   - **Auth Token**

## 3. Buy a Phone Number

1. In Twilio Console, go to **Phone Numbers** → **Manage** → **Buy a number**
2. Choose a number with SMS capabilities
3. Purchase the number (costs ~$1/month)

## 4. Set Environment Variables

Create or update your `.env` file in the backend directory:

```env
# Twilio Configuration
TWILIO_ACCOUNT_SID=your_account_sid_here
TWILIO_AUTH_TOKEN=your_auth_token_here
TWILIO_PHONE_NUMBER=+1234567890
```

## 5. Test Your Setup

Run the backend server and test the OTP functionality:

```bash
cd backend
npm start
```

## 6. Pricing Information

### Free Tier:

- $15 free credit (enough for ~100 SMS)
- No credit card required

### Paid Pricing:

- **SMS**: $0.0075 per SMS (≈₹0.60)
- **Phone Number**: $1/month (≈₹80)

### Cost Examples:

- 100 SMS/month: ~₹60
- 500 SMS/month: ~₹300
- 1000 SMS/month: ~₹600

## 7. Security Features

✅ **Rate Limiting**: 3 OTP requests per 15 minutes
✅ **OTP Expiry**: 10 minutes
✅ **Max Attempts**: 3 attempts per OTP
✅ **Secure Storage**: OTPs are hashed before storage
✅ **Auto Cleanup**: Expired OTPs are automatically deleted

## 8. Troubleshooting

### Common Issues:

1. **"Twilio configuration missing"**

   - Check your `.env` file has all required variables
   - Restart the server after adding environment variables

2. **"Failed to send SMS"**

   - Verify your Twilio credentials
   - Check if you have sufficient balance
   - Ensure phone number format is correct (+countrycode)

3. **"Invalid phone number"**
   - Ensure mobile number includes country code
   - Format: +91XXXXXXXXXX (for India)

### Support:

- Twilio Documentation: [twilio.com/docs](https://twilio.com/docs)
- Twilio Support: Available in console
