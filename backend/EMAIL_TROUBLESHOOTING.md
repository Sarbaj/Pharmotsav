# Email Troubleshooting Guide

## Current Issue: Gmail Authentication Failed

### Error Message:

```
535-5.7.8 Username and Password not accepted
```

### Root Cause:

The email address format is incorrect in your `.env` file.

### Current Configuration (INCORRECT):

```env
SMTP_USER=sarbajmalek3456.gmail.com  # ❌ WRONG - has dot instead of @
```

### Required Fix:

Update your `.env` file to use the correct email format:

```env
SMTP_USER=sarbajmalek3456@gmail.com  # ✅ CORRECT - with @ symbol
```

## Step-by-Step Fix:

### 1. Update .env File

Open `backend/.env` and change:

```env
# Change this line:
SMTP_USER=sarbajmalek3456.gmail.com

# To this:
SMTP_USER=sarbajmalek3456@gmail.com
```

### 2. Verify Gmail Settings

Make sure your Gmail account has:

- ✅ 2-Factor Authentication enabled
- ✅ App Password generated (not regular password)
- ✅ "Less secure app access" is NOT enabled (use App Password instead)

### 3. Generate New App Password (if needed)

1. Go to [Google Account Security](https://myaccount.google.com/security)
2. Enable 2-Step Verification if not already enabled
3. Go to "App passwords"
4. Generate new app password for "Mail"
5. Copy the 16-character password
6. Update `SMTP_PASS` in `.env` file

### 4. Test Configuration

After updating, test with:

```bash
node -r dotenv/config -e "console.log('SMTP_USER:', process.env.SMTP_USER);"
```

## Alternative Solutions:

### Option 1: Use Different Email Provider

If Gmail continues to have issues, try:

#### Outlook/Hotmail:

```env
SMTP_USER=your-email@outlook.com
SMTP_PASS=your-password
SMTP_HOST=smtp-mail.outlook.com
SMTP_PORT=587
SMTP_SECURE=false
```

#### Yahoo:

```env
SMTP_USER=your-email@yahoo.com
SMTP_PASS=your-app-password
SMTP_HOST=smtp.mail.yahoo.com
SMTP_PORT=587
SMTP_SECURE=false
```

### Option 2: Use Email Service Provider

#### SendGrid:

```env
SMTP_USER=apikey
SMTP_PASS=your-sendgrid-api-key
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_SECURE=false
```

## Testing After Fix:

### 1. Test Email Service:

```bash
node -r dotenv/config -e "const { sendEmailVerificationOTP } = require('./src/utils/emailService.js'); sendEmailVerificationOTP('test@example.com', '123456', 'Test').then(() => console.log('✅ Email sent')).catch(err => console.error('❌ Failed:', err.message));"
```

### 2. Test Buyer Registration:

1. Start backend: `npm start`
2. Try buyer registration
3. Check email for OTP
4. Complete verification

## Common Issues:

### Issue 1: "Username and Password not accepted"

- **Cause**: Wrong email format or invalid credentials
- **Fix**: Check email format (@ instead of .) and use App Password

### Issue 2: "Connection timeout"

- **Cause**: Firewall or network issues
- **Fix**: Check firewall settings, try different port (465 with secure=true)

### Issue 3: "Invalid credentials"

- **Cause**: Using regular password instead of App Password
- **Fix**: Generate new App Password from Google Account

## Quick Fix Commands:

### Check current configuration:

```bash
node -r dotenv/config -e "console.log('SMTP_USER:', process.env.SMTP_USER);"
```

### Test email service:

```bash
node -r dotenv/config -e "const { sendEmailVerificationOTP } = require('./src/utils/emailService.js'); sendEmailVerificationOTP('test@example.com', '123456', 'Test').then(() => console.log('✅ Success')).catch(err => console.error('❌ Error:', err.message));"
```

## Expected Result:

After fixing the email format, you should see:

```
✅ Email sent successfully
```

Instead of:

```
❌ Email failed: Invalid login: 535-5.7.8 Username and Password not accepted
```
