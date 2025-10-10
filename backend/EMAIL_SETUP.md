# Email Service Setup Guide

## Required Configuration

The email service is **REQUIRED** for the application to function. Without proper email configuration, the buyer registration will fail with "Failed to send email verification" error.

## Email Service Setup

### 1. Gmail Setup (Recommended)

1. **Enable 2-Factor Authentication** on your Gmail account
2. **Generate an App Password**:

   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Generate a new app password for "Mail"
   - Copy the 16-character password

3. **Add to your environment variables**:
   ```bash
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-16-character-app-password
   ```

### 2. Alternative Email Services

#### SendGrid

```bash
EMAIL_USER=apikey
EMAIL_PASS=your-sendgrid-api-key
```

#### Mailgun

```bash
EMAIL_USER=your-mailgun-smtp-username
EMAIL_PASS=your-mailgun-smtp-password
```

### 3. Environment Variables

Create a `.env` file in the backend directory with:

```env
# Database
MONGODB_URI=mongodb://localhost:27017/pharmotsav

# JWT
ACCESS_TOKEN_SECRET=your_access_token_secret
REFRESH_TOKEN_SECRET=your_refresh_token_secret

# Twilio (for SMS)
TWILIO_ACCOUNT_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_token
TWILIO_PHONE_NUMBER=your_twilio_number

# Email (for email verification)
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# Frontend URL
FRONTEND_URL=http://localhost:3000

# Password Encryption
PASSWORD_BCRYPT_ROUNDS=10
```

## Current Behavior

- **Email Service Required**: Application will fail without proper email configuration
- **Production Only**: Actual emails are sent to users
- **No Fallback**: Must configure email service for registration to work

## Testing

1. Configure email service (see setup above)
2. Start the backend server
3. Try the buyer registration
4. Check your email for the OTP
5. Use the OTP from email for verification
6. Complete registration successfully

## Troubleshooting

- Make sure nodemailer is installed: `npm install nodemailer`
- Check that environment variables are properly set
- Verify Gmail app password is correct
- Ensure 2FA is enabled on Gmail account
