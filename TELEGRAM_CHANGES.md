# 🤖 تغییرات Telegram Mini App

## ✅ فایل‌های جدید

### Backend:
1. **`backend/src/telegram/telegram.service.ts`**
   - سرویس مدیریت ربات تلگرام
   - دستورات `/start` و `/help`
   - ارسال اعلان به کاربران

2. **`backend/src/telegram/telegram.module.ts`**
   - ماژول Telegram

3. **`backend/src/telegram/telegram-auth.guard.ts`**
   - Guard برای احراز هویت Telegram WebApp
   - اعتبارسنجی initData با HMAC-SHA256

### Frontend:
1. **`frontend/src/telegram/useTelegram.ts`**
   - Hook برای استفاده از Telegram WebApp SDK

2. **`frontend/src/components/TelegramNav.tsx`**
   - Bottom Navigation برای Telegram Mini App
   - Haptic Feedback

### مستندات:
1. **`TELEGRAM_SETUP.md`** - راهنمای راه‌اندازی (انگلیسی)
2. **`راهنمای_تلگرام.md`** - راهنمای کامل (فارسی)
3. **`start-telegram-app.bat`** - اسکریپت راه‌اندازی ویندوز
4. **`start-telegram-app.sh`** - اسکریپت راه‌اندازی لینوکس/مک

---

## 🔄 فایل‌های تغییر یافته

### Backend:

1. **`backend/.env`**
   ```env
   + TELEGRAM_BOT_TOKEN=8787350194:AAHzqvnJhvPOh1Fg6I7L8dEbav95N6e1u04
   + WEBAPP_URL=http://localhost:5173
   ```

2. **`backend/src/app.module.ts`**
   ```typescript
   + import { TelegramModule } from './telegram/telegram.module';
   + TelegramModule, // در imports
   ```

3. **`backend/src/database/entities/user.entity.ts`**
   ```typescript
   + @Column({ unique: true, nullable: true })
   + telegramId: string;
   ```

4. **`backend/src/auth/auth.service.ts`**
   ```typescript
   + async loginWithTelegram(telegramId, firstName, lastName, username)
   ```

5. **`backend/src/auth/auth.controller.ts`**
   ```typescript
   + @Post('telegram')
   + async loginWithTelegram(@Body() body)
   ```

6. **`backend/package.json`**
   ```json
   + "node-telegram-bot-api": "^0.66.0"
   + "@types/node-telegram-bot-api": "^0.64.7"
   ```

### Frontend:

1. **`frontend/index.html`**
   ```html
   + <script src="https://telegram.org/js/telegram-web-app.js"></script>
   + <meta name="viewport" content="..., user-scalable=no" />
   ```

2. **`frontend/src/App.tsx`**
   - احراز هویت خودکار با Telegram
   - تشخیص Telegram WebApp
   - نمایش TelegramNav در حالت Telegram
   - مخفی کردن Navbar در حالت Telegram

3. **`frontend/src/pages/Dashboard.tsx`**
   ```typescript
   + export default function Dashboard({ user, isTelegramWebApp })
   ```

4. **`frontend/src/index.css`**
   ```css
   + /* Telegram Mini App Optimizations */
   + .telegram-webapp body { ... }
   + @media (max-width: 768px) { ... }
   ```

5. **`frontend/package.json`**
   ```json
   + "@twa-dev/sdk": "^7.10.1"
   ```

---

## 🎯 ویژگی‌های جدید

### 1. احراز هویت Telegram
- کاربران با Telegram ID خود لاگین می‌شوند
- ایجاد خودکار حساب کاربری
- نقش پیش‌فرض: Reporter

### 2. Bot Commands
- `/start` - شروع و نمایش دکمه ورود
- `/help` - راهنما

### 3. Bottom Navigation
- دسترسی سریع به بخش‌های مختلف
- Haptic Feedback
- نشانگر صفحه فعلی

### 4. UI بهینه شده
- بدون Navbar در Telegram
- فضای بیشتر برای محتوا
- بهینه برای موبایل

### 5. یکپارچگی با Telegram
- رنگ‌های Telegram theme
- دکمه بستن
- Expand به تمام صفحه

---

## 📊 API های جدید

### POST /auth/telegram
احراز هویت با Telegram

**Request:**
```json
{
  "telegramId": "123456789",
  "firstName": "علی",
  "lastName": "احمدی",
  "username": "ali_ahmadi"
}
```

**Response:**
```json
{
  "access_token": "eyJhbGc...",
  "user": {
    "id": "uuid",
    "username": "ali_ahmadi",
    "name": "علی احمدی",
    "role": "reporter",
    "telegramId": "123456789"
  }
}
```

---

## 🔧 تنظیمات مورد نیاز

### 1. Environment Variables

**Backend (.env):**
```env
TELEGRAM_BOT_TOKEN=8787350194:AAHzqvnJhvPOh1Fg6I7L8dEbav95N6e1u04
WEBAPP_URL=https://your-ngrok-url.ngrok-free.app
```

### 2. BotFather Settings

1. Menu Button URL: `https://your-ngrok-url.ngrok-free.app`
2. Menu Button Text: `🚀 ورود به سامانه`

### 3. ngrok

```bash
ngrok http 5173
```

---

## 🚀 راه‌اندازی

### روش سریع:

**ویندوز:**
```bash
start-telegram-app.bat
```

**لینوکس/مک:**
```bash
./start-telegram-app.sh
```

### روش دستی:

```bash
# ترمینال 1
cd backend
npm run start:dev

# ترمینال 2
cd frontend
npm run dev

# ترمینال 3
ngrok http 5173
```

---

## 🎨 تفاوت‌های UI

### حالت عادی (Web):
- ✅ Navbar در بالا
- ✅ دکمه خروج
- ✅ لینک‌های Navigation
- ✅ دکمه تغییر رمز

### حالت Telegram:
- ✅ Bottom Navigation
- ✅ بدون Navbar
- ✅ Haptic Feedback
- ✅ رنگ‌های Telegram
- ✅ دکمه بستن با WebApp.close()

---

## 🔐 امنیت

### احراز هویت Telegram:
1. دریافت initData از Telegram
2. اعتبارسنجی با HMAC-SHA256
3. بررسی hash
4. ایجاد/بازیابی کاربر
5. صدور JWT token

### نقش‌های کاربری:
- کاربران جدید Telegram: **Reporter**
- تغییر نقش: از پنل مدیریت کاربران

---

## 📱 تست

### چک‌لیست:
- [ ] Backend اجرا می‌شود
- [ ] Frontend اجرا می‌شود
- [ ] ngrok اجرا می‌شود
- [ ] URL در BotFather تنظیم شده
- [ ] WEBAPP_URL در .env آپدیت شده
- [ ] دستور /start کار می‌کند
- [ ] Mini App باز می‌شود
- [ ] لاگین خودکار کار می‌کند
- [ ] Bottom Navigation کار می‌کند
- [ ] Haptic Feedback کار می‌کند

---

## 🐛 مشکلات احتمالی

### Mini App باز نمی‌شود:
- بررسی URL در BotFather (باید HTTPS باشد)
- بررسی ngrok (باید در حال اجرا باشد)
- بررسی CORS در backend

### خطای احراز هویت:
- بررسی TELEGRAM_BOT_TOKEN در .env
- بررسی Console (F12)
- Backend را restart کنید

### Bottom Nav نمایش داده نمی‌شود:
- مطمئن شوید از Telegram باز کرده‌اید
- Cache را پاک کنید
- Hard reload (Ctrl+Shift+R)

---

## 📚 مستندات

- **TELEGRAM_SETUP.md** - راهنمای راه‌اندازی تکنیکال
- **راهنمای_تلگرام.md** - راهنمای کامل فارسی
- **TELEGRAM_CHANGES.md** - این فایل

---

موفق باشید! 🎉
