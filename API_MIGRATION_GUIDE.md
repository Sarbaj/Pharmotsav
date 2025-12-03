# API Base URL Migration Guide

## ✅ Completed Setup

### 1. Environment Variable Created
- **File**: `frontend/.env`
- **Variable**: `VITE_API_BASE_URL=http://localhost:4000`

### 2. API Configuration File Created
- **File**: `frontend/src/config/api.js`
- **Exports**: `API_BASE_URL` and `API_ENDPOINTS` object with all endpoints

## 📝 Files That Need Updates

### Import Statement to Add
```javascript
import { API_ENDPOINTS } from '../config/api';
// or adjust path based on file location
```

### Files to Update:

#### 1. **Login.jsx**
- Line 27-28: Replace with `API_ENDPOINTS.BUYER_LOGIN` and `API_ENDPOINTS.SELLER_LOGIN`

#### 2. **BuyerRegister.jsx**
- Line 328: Replace with `API_ENDPOINTS.OTP_BUYER_PHONE_INITIATE`
- Line 366: Replace with `API_ENDPOINTS.OTP_BUYER_EMAIL_INITIATE`
- Line 407: Replace with `API_ENDPOINTS.OTP_BUYER_PHONE_VERIFY`
- Line 443: Replace with `API_ENDPOINTS.OTP_BUYER_EMAIL_VERIFY`
- Line 486: Replace with `API_ENDPOINTS.BUYER_REGISTER`

#### 3. **SellerRegister.jsx**
- Line 136: Replace with `API_ENDPOINTS.OTP_INITIATE`
- Line 181: Replace with `API_ENDPOINTS.OTP_VERIFY`
- Line 219: Replace with `API_ENDPOINTS.OTP_SELLER_EMAIL_INITIATE`
- Line 260: Replace with `API_ENDPOINTS.OTP_SELLER_EMAIL_VERIFY`
- Line 384: Replace with `API_ENDPOINTS.SELLER_REGISTER`

#### 4. **ProfileDashboard.jsx** (Buyer Dashboard)
- Line 114: Replace with `API_ENDPOINTS.INQUIRIES_BUYER`
- Line 126: Replace with `API_ENDPOINTS.INQUIRIES_RECENT`
- Line 490: Replace with `API_ENDPOINTS.SELLER_DETAILS(sellerId)`
- Line 620: Replace with `API_ENDPOINTS.INQUIRIES_MOVE_TO_RECENT`
- Line 705: Replace with `API_ENDPOINTS.BUYER_PROFILE_UPDATE`
- Line 727: Replace with `API_ENDPOINTS.BUYER_EMAIL_UPDATE`
- Line 755: Replace with `API_ENDPOINTS.BUYER_MOBILE_UPDATE`
- Line 825: Replace with `API_ENDPOINTS.BUYER_CHANGE_PASSWORD`
- Line 862: Replace with `API_ENDPOINTS.BUYER_FORGOT_PASSWORD`
- Line 897: Replace with `API_ENDPOINTS.OTP_BUYER_PHONE_UPDATE_INITIATE`
- Line 934: Replace with `API_ENDPOINTS.OTP_BUYER_PHONE_UPDATE_VERIFY`
- Line 973: Replace with `API_ENDPOINTS.OTP_BUYER_EMAIL_UPDATE_INITIATE`
- Line 1008: Replace with `API_ENDPOINTS.OTP_BUYER_EMAIL_UPDATE_VERIFY`
- Line 1063: Replace with `API_ENDPOINTS.INQUIRIES_DELETE(inquiryId)`

#### 5. **SellerDashboard.jsx**
- Line 108: Replace with `API_ENDPOINTS.CATEGORIES_GET_ALL`
- Line 177: Replace with `API_ENDPOINTS.INQUIRIES_SELLER_RECENT`
- Line 260: Replace with `API_ENDPOINTS.BUYER_DETAILS(buyerId)`
- Line 524: Replace with `API_ENDPOINTS.PRODUCTS_ADD`
- Line 680: Replace with `API_ENDPOINTS.PRODUCTS_ADD`
- Line 751: Replace with `API_ENDPOINTS.SELLER_PROFILE_UPDATE`
- Line 773: Replace with `API_ENDPOINTS.SELLER_EMAIL_UPDATE`
- Line 801: Replace with `API_ENDPOINTS.SELLER_MOBILE_UPDATE`
- Line 874: Replace with `API_ENDPOINTS.SELLER_CHANGE_PASSWORD`
- Line 912: Replace with `API_ENDPOINTS.SELLER_FORGOT_PASSWORD`
- Line 946: Replace with `API_ENDPOINTS.OTP_SELLER_PHONE_UPDATE_INITIATE`
- Line 983: Replace with `API_ENDPOINTS.OTP_SELLER_PHONE_UPDATE_VERIFY`
- Line 1022: Replace with `API_ENDPOINTS.OTP_SELLER_EMAIL_UPDATE_INITIATE`
- Line 1057: Replace with `API_ENDPOINTS.OTP_SELLER_EMAIL_UPDATE_VERIFY`

#### 6. **SellerProfile.jsx**
- Line 86: Replace with `API_ENDPOINTS.INQUIRIES_SELLER`
- Line 126: Replace with `API_ENDPOINTS.BUYER_DETAILS(buyerId)`
- Line 154: Replace with `API_ENDPOINTS.INQUIRIES_UPDATE_STATUS(inquiryId)`

#### 7. **Product.jsx**
- Line 41: Replace with `API_ENDPOINTS.CATEGORIES_GET_ALL`
- Line 97: Replace with `API_ENDPOINTS.PRODUCTS_BY_CATEGORY`
- Line 168: Replace with `API_ENDPOINTS.PRODUCTS_GET_ALL`
- Line 318: Replace with `API_ENDPOINTS.INQUIRIES_CREATE`

#### 8. **Contact.jsx**
- Line 107: Replace with `API_ENDPOINTS.CONTACT`

#### 9. **AdminLogin.jsx**
- Line 25: Replace with `API_ENDPOINTS.ADMIN_LOGIN`

#### 10. **AdminDashboard.jsx**
- Line 44: Replace with `API_ENDPOINTS.ADMIN_GET_ALL_BUYERS`

#### 11. **Header.jsx**
- Update buyer/seller refresh token endpoints (if present)

## 🔧 How to Change Base URL

### For Development:
Edit `frontend/.env`:
```
VITE_API_BASE_URL=http://localhost:4000
```

### For Production:
```
VITE_API_BASE_URL=https://your-production-api.com
```

### For Staging:
```
VITE_API_BASE_URL=https://staging-api.your-domain.com
```

## 📌 Benefits

1. **Single Source of Truth**: Change API URL in one place
2. **Environment-Specific**: Different URLs for dev/staging/production
3. **Type Safety**: All endpoints defined in one file
4. **Easy Maintenance**: Update endpoints without searching through files
5. **No Hardcoded URLs**: Clean, maintainable code

## ⚠️ Important Notes

- Restart dev server after changing `.env` file
- Don't commit `.env` with production URLs
- Create `.env.example` for team reference
- Use `import.meta.env` for Vite projects (not `process.env`)
