# ⚠️ REQUIRED CONFIGURATION

## Email Service is MANDATORY

The application now requires proper email configuration to function. Without it, buyer registration will fail.

## Quick Setup

### 1. Create `.env` file in backend directory:

```env
# Database
MONGODB_URI=mongodb://localhost:27017/pharmotsav

# JWT Secrets
ACCESS_TOKEN_SECRET=your_access_token_secret_here
REFRESH_TOKEN_SECRET=your_refresh_token_secret_here

# Twilio (for SMS)
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=your_twilio_phone_number

# Email (REQUIRED)
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# SMTP Configuration (Optional - defaults to Gmail)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false

# Frontend URL
FRONTEND_URL=http://localhost:3000

# Password Encryption
PASSWORD_BCRYPT_ROUNDS=10
```

### 2. Gmail SMTP Setup (Recommended):

1. **Enable 2-Factor Authentication** on your Gmail account
2. **Generate App Password**:
   - Go to Google Account → Security → 2-Step Verification → App passwords
   - Generate new app password for "Mail"
   - Copy the 16-character password
3. **Update `.env` file**:
   ```env
   SMTP_USER=your-email@gmail.com
   SMTP_PASS=your-16-character-app-password
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_SECURE=false
   ```

### 3. Alternative Email Services:

#### SendGrid SMTP:

```env
SMTP_USER=apikey
SMTP_PASS=your-sendgrid-api-key
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_SECURE=false
```

#### Mailgun SMTP:

```env
SMTP_USER=your-mailgun-smtp-username
SMTP_PASS=your-mailgun-smtp-password
SMTP_HOST=smtp.mailgun.org
SMTP_PORT=587
SMTP_SECURE=false
```

#### Outlook/Hotmail SMTP:

```env
SMTP_USER=your-email@outlook.com
SMTP_PASS=your-password
SMTP_HOST=smtp-mail.outlook.com
SMTP_PORT=587
SMTP_SECURE=false
```

#### Yahoo SMTP:

```env
SMTP_USER=your-email@yahoo.com
SMTP_PASS=your-app-password
SMTP_HOST=smtp.mail.yahoo.com
SMTP_PORT=587
SMTP_SECURE=false
```

## What Happens Without Configuration:

- ❌ Buyer registration will fail
- ❌ "Failed to send email verification" error
- ❌ Application will not function properly

## What Happens With Configuration:

- ✅ Emails sent to users
- ✅ Professional HTML email templates
- ✅ Complete registration flow works
- ✅ Welcome emails after registration

## Testing:

1. Configure email service
2. Start backend: `npm start`
3. Try buyer registration
4. Check email for OTP
5. Complete verification

## Troubleshooting:

- Ensure `.env` file is in backend directory
- Verify Gmail app password is correct
- Check that 2FA is enabled on Gmail
- Make sure nodemailer is installed: `npm install nodemailer`
