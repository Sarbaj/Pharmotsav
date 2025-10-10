# Email Rate Limit Configuration

## Current Email Rate Limits

### **Email OTP Sending:**

- **Current**: 5 requests per 15 minutes
- **Phone OTP**: 3 requests per 15 minutes (separate limit)

## How to Change Email Rate Limits

### **Option 1: Increase Email Rate Limit**

Edit `backend/src/middlewares/rateLimiter.js`:

```javascript
// Current (5 requests per 15 minutes)
export const emailOtpRateLimiter = rateLimiter(5, 15 * 60 * 1000);

// Change to 10 requests per 15 minutes
export const emailOtpRateLimiter = rateLimiter(10, 15 * 60 * 1000);

// Or change to 5 requests per 10 minutes
export const emailOtpRateLimiter = rateLimiter(5, 10 * 60 * 1000);
```

### **Option 2: Different Time Windows**

```javascript
// 10 requests per 30 minutes
export const emailOtpRateLimiter = rateLimiter(10, 30 * 60 * 1000);

// 20 requests per hour
export const emailOtpRateLimiter = rateLimiter(20, 60 * 60 * 1000);

// 5 requests per 5 minutes (more restrictive)
export const emailOtpRateLimiter = rateLimiter(5, 5 * 60 * 1000);
```

### **Option 3: No Rate Limiting (Development Only)**

Comment out rate limiting in `backend/src/routes/otp.routes.js`:

```javascript
// Before
router.post(
  "/buyer/email/initiate",
  emailOtpRateLimiter,
  initiateBuyerEmailOTP
);

// After (no rate limiting)
router.post("/buyer/email/initiate", initiateBuyerEmailOTP);
```

## Current Configuration

### **Phone OTP:**

- **Sending**: 4 requests per 15 minutes
- **Verification**: 10 attempts per 15 minutes
- **Resend**: 4 requests per 15 minutes

### **Email OTP:**

- **Sending**: 5 requests per 15 minutes
- **Verification**: 10 attempts per 15 minutes
- **Resend**: 5 requests per 15 minutes

## Recommended Settings

### **Development:**

```javascript
export const emailOtpRateLimiter = rateLimiter(10, 15 * 60 * 1000); // 10 per 15 min
```

### **Production:**

```javascript
export const emailOtpRateLimiter = rateLimiter(3, 15 * 60 * 1000); // 3 per 15 min
```

### **High Volume:**

```javascript
export const emailOtpRateLimiter = rateLimiter(20, 60 * 60 * 1000); // 20 per hour
```

## Rate Limit Parameters

```javascript
rateLimiter(maxRequests, windowMs);
```

- **maxRequests**: Maximum number of requests allowed
- **windowMs**: Time window in milliseconds
  - `15 * 60 * 1000` = 15 minutes
  - `30 * 60 * 1000` = 30 minutes
  - `60 * 60 * 1000` = 1 hour

## Testing Rate Limits

### **Check Current Limits:**

```bash
# Test email OTP (will count against rate limit)
curl -X POST http://localhost:4000/api/v1/otp/buyer/email/initiate \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","userData":{"firstName":"Test","lastName":"User"}}'
```

### **Monitor Rate Limit Response:**

```json
{
  "success": false,
  "message": "⚠️ Please wait 5 minutes (300 seconds) before requesting a new OTP."
}
```

**For short waits (< 1 minute):**

```json
{
  "success": false,
  "message": "⚠️ Please wait 45 seconds before requesting a new OTP."
}
```

## Security Considerations

### **Email vs Phone Rate Limits:**

- **Email**: Usually higher limits (emails are cheaper to send)
- **Phone**: Lower limits (SMS costs more)
- **Verification**: Same limits for both (user experience)

### **Production Recommendations:**

- **Email**: 3-5 requests per 15 minutes
- **Phone**: 2-3 requests per 15 minutes
- **Verification**: 5-10 attempts per 15 minutes

## Error Messages

### **Rate Limit Messages:**

- `⚠️ Please wait X minutes (Y seconds) before requesting a new OTP.` - Rate limit exceeded (long wait)
- `⚠️ Please wait X seconds before requesting a new OTP.` - Rate limit exceeded (short wait)

### **OTP Error Messages:**

- `Invalid OTP` - Wrong OTP entered
- `OTP expired` - OTP is too old
- `OTP not found` - OTP was already used or expired

## Implementation Notes

- Rate limits are **per IP address**
- Limits reset automatically after the time window
- Old entries are cleaned up automatically
- Use Redis for production (better performance)
