# 📱 راهنمای راه‌اندازی Mini App برای بله

## ✅ تغییرات اعمال شده

### Backend
- ✅ اضافه شدن `BALE_BOT_TOKEN` و `BALE_API_URL` به `.env`
- ✅ آپدیت `TelegramService` برای پشتیبانی از Bale API
- ✅ اضافه شدن فیلد `baleId` به User entity
- ✅ اضافه شدن endpoint `/auth/bale`
- ✅ پشتیبانی همزمان از Telegram و Bale

### Frontend
- ✅ تشخیص خودکار Telegram یا Bale
- ✅ استفاده از endpoint مناسب برای هر پلتفرم
- ✅ لاگ‌های دقیق برای debugging

## 🔧 تنظیمات

### 1. Backend Configuration

فایل `backend/.env`:
```env
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=7d
PORT=3000

# Bale Configuration
BALE_BOT_TOKEN=407715407:wf0tQMl7yRbnqsOhkUUyIMxb7p8simgjGmg
BALE_API_URL=https://tapi.bale.ai

# WebApp URL (ngrok)
WEBAPP_URL=https://your-ngrok-url.ngrok-free.dev
```

### 2. Database Migration

فیلد جدید `baleId` به User entity اضافه شده. دیتابیس خودکار آپدیت می‌شود.

## 🚀 راه‌اندازی

### مرحله 1: نصب و اجرا

```bash
# Backend
cd backend
npm install
npm run start:dev

# Frontend
cd frontend
npm install
npm run dev

# ngrok
ngrok http 5173
```

### مرحله 2: تنظیم ربات بله

1. به ربات [@BotFather](https://ble.ir/BotFather) در بله بروید
2. دستور `/newbot` را ارسال کنید
3. نام و username ربات را وارد کنید
4. توکن ربات را دریافت کنید (قبلاً دریافت شده)

### مرحله 3: تنظیم Mini App

1. به ربات خود در بله بروید
2. دستور `/setminiapp` را ارسال کنید
3. URL ngrok را وارد کنید:
   ```
   https://your-ngrok-url.ngrok-free.dev
   ```
4. عنوان دکمه را وارد کنید:
   ```
   🚀 ورود به سامانه
   ```

### مرحله 4: تست

1. ربات را در بله باز کنید
2. `/start` را ارسال کنید
3. روی دکمه Mini App کلیک کنید
4. Mini App باز می‌شود و شما خودکار وارد می‌شوید

## 🔍 Debugging

### Console Logs

در Mini App، Console را باز کنید (در نسخه دسکتاپ بله):
```
🔍 Telegram/Bale WebApp detected
📱 Platform: bale
👤 User: { id: ..., first_name: ... }
🚀 Attempting Bale login...
✅ Login successful: { access_token: ..., user: ... }
```

### تست API

```bash
# تست endpoint بله
curl -X POST http://localhost:3000/auth/bale \
  -H "Content-Type: application/json" \
  -d '{
    "baleId": "123456789",
    "firstName": "علی",
    "lastName": "احمدی",
    "username": "ali_test"
  }'
```

## 🎯 تفاوت‌های Telegram و Bale

### Backend
| Feature | Telegram | Bale |
|---------|----------|------|
| API URL | api.telegram.org | tapi.bale.ai |
| Token | TELEGRAM_BOT_TOKEN | BALE_BOT_TOKEN |
| User Field | telegramId | baleId |
| Endpoint | /auth/telegram | /auth/bale |

### Frontend
- تشخیص خودکار پلتفرم
- استفاده از endpoint مناسب
- لاگ‌های جداگانه

## 📱 ویژگی‌های Mini App

همه ویژگی‌های Telegram Mini App در بله هم کار می‌کند:
- ✅ احراز هویت خودکار
- ✅ Bottom Navigation
- ✅ UI بهینه شده برای موبایل
- ✅ Glassmorphism Design
- ✅ تمام قابلیت‌های سیستم

## 🔄 پشتیبانی همزمان

این نسخه از هر دو پلتفرم پشتیبانی می‌کند:
- کاربران Telegram با `telegramId` ذخیره می‌شوند
- کاربران Bale با `baleId` ذخیره می‌شوند
- هر کاربر می‌تواند از هر دو پلتفرم استفاده کند

## ⚠️ نکات مهم

### 1. ngrok URL
- حتماً URL ngrok را در `.env` آپدیت کنید
- URL باید با `https://` شروع شود

### 2. Bot Token
- توکن ربات بله: `407715407:wf0tQMl7yRbnqsOhkUUyIMxb7p8simgjGmg`
- این توکن در `.env` تنظیم شده است

### 3. API URL
- Bale API: `https://tapi.bale.ai`
- این URL در کد تنظیم شده است

### 4. Database
- فیلد `baleId` به User entity اضافه شده
- دیتابیس خودکار migrate می‌شود

## 🐛 رفع مشکلات

### خطا: "اطلاعات کاربر یافت نشد"
- مطمئن شوید از طریق دکمه Mini App ربات وارد می‌شوید
- URL را مستقیم در مرورگر باز نکنید

### خطا: "Network Error"
- Backend را چک کنید (باید روی port 3000 اجرا شود)
- Frontend را چک کنید (باید روی port 5173 اجرا شود)
- ngrok را restart کنید

### خطا: "Bot Token Invalid"
- توکن ربات را در `.env` چک کنید
- مطمئن شوید `BALE_BOT_TOKEN` درست تنظیم شده

## 📊 مقایسه با Telegram

| ویژگی | Telegram | Bale | وضعیت |
|-------|----------|------|-------|
| Mini App | ✅ | ✅ | پشتیبانی کامل |
| Auto Login | ✅ | ✅ | پشتیبانی کامل |
| Bottom Nav | ✅ | ✅ | پشتیبانی کامل |
| WebApp SDK | ✅ | ✅ | سازگار |
| API | api.telegram.org | tapi.bale.ai | تنظیم شده |

## 🎉 آماده!

Mini App شما حالا برای بله آماده است!

**مراحل:**
1. ✅ Backend با Bale API تنظیم شد
2. ✅ Frontend تشخیص خودکار دارد
3. ✅ Database آپدیت شد
4. ✅ Endpoints اضافه شدند

فقط ngrok را اجرا کنید و URL را در ربات بله تنظیم کنید! 🚀
