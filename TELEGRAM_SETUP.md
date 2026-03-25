# 🤖 راهنمای راه‌اندازی Telegram Mini App

## مراحل راه‌اندازی

### 1️⃣ نصب ngrok (برای تست محلی)

Telegram Mini Apps نیاز به HTTPS دارند. برای تست محلی از ngrok استفاده می‌کنیم:

```bash
# دانلود ngrok از:
https://ngrok.com/download

# یا با chocolatey:
choco install ngrok

# یا با scoop:
scoop install ngrok
```

### 2️⃣ راه‌اندازی Backend

```bash
cd backend
npm run start:dev
```

✅ Backend باید روی `http://localhost:3000` اجرا شود

### 3️⃣ راه‌اندازی Frontend

```bash
cd frontend
npm run dev
```

✅ Frontend باید روی `http://localhost:5173` اجرا شود

### 4️⃣ راه‌اندازی ngrok

در یک ترمینال جدید:

```bash
ngrok http 5173
```

✅ یک URL مثل `https://xxxx-xx-xx-xx-xx.ngrok-free.app` دریافت می‌کنید

**مهم:** این URL را کپی کنید!

### 5️⃣ پیکربندی Bot در BotFather

1. به [@BotFather](https://t.me/BotFather) در تلگرام بروید
2. دستور `/mybots` را بزنید
3. ربات خود را انتخاب کنید
4. روی "Bot Settings" کلیک کنید
5. روی "Menu Button" کلیک کنید
6. روی "Configure Menu Button" کلیک کنید
7. URL ngrok خود را وارد کنید: `https://xxxx.ngrok-free.app`
8. متن دکمه: `🚀 ورود به سامانه`

### 6️⃣ آپدیت WEBAPP_URL در Backend

فایل `backend/.env` را باز کنید و URL ngrok را جایگزین کنید:

```env
WEBAPP_URL=https://xxxx-xx-xx-xx-xx.ngrok-free.app
```

سپس backend را restart کنید.

### 7️⃣ تست Mini App

1. به ربات خود در تلگرام بروید
2. دستور `/start` را بزنید
3. روی دکمه "🚀 ورود به سامانه" کلیک کنید
4. Mini App باید باز شود و شما به صورت خودکار لاگین شوید!

---

## 🎯 ویژگی‌های Telegram Mini App

### احراز هویت خودکار
- کاربران با Telegram ID خود به صورت خودکار لاگین می‌شوند
- نیازی به username/password نیست
- اولین بار که وارد می‌شوند، حساب کاربری برایشان ساخته می‌شود

### Navigation بهینه شده
- Bottom Navigation Bar برای دسترسی سریع
- Haptic Feedback برای تعامل بهتر
- UI بهینه شده برای موبایل

### یکپارچگی با Telegram
- رنگ‌های Telegram theme
- دکمه بستن با `WebApp.close()`
- Haptic feedback برای کلیک‌ها

---

## 🔧 تنظیمات پیشرفته

### تنظیم Domain دائمی

اگر می‌خواهید Mini App را به صورت دائمی در دسترس باشد:

1. یک سرور با HTTPS راه‌اندازی کنید
2. Frontend را build کنید:
   ```bash
   cd frontend
   npm run build
   ```
3. فایل‌های `dist` را روی سرور آپلود کنید
4. Backend را روی سرور deploy کنید
5. URL سرور را در BotFather تنظیم کنید

### تنظیم Webhook (اختیاری)

برای دریافت پیام‌های ربات:

```bash
curl -X POST "https://api.telegram.org/bot8787350194:AAHzqvnJhvPOh1Fg6I7L8dEbav95N6e1u04/setWebhook" \
  -H "Content-Type: application/json" \
  -d '{"url": "https://your-backend-url.com/telegram/webhook"}'
```

---

## 🎨 سفارشی‌سازی UI برای Telegram

### استفاده از Telegram Theme Colors

در `index.css` می‌توانید از متغیرهای Telegram استفاده کنید:

```css
body {
  background: var(--tg-theme-bg-color);
  color: var(--tg-theme-text-color);
}

button {
  background: var(--tg-theme-button-color);
  color: var(--tg-theme-button-text-color);
}
```

### Haptic Feedback

در کامپوننت‌ها:

```typescript
import WebApp from '@twa-dev/sdk';

// برای کلیک‌ها
WebApp.HapticFeedback.impactOccurred('light');

// برای موفقیت
WebApp.HapticFeedback.notificationOccurred('success');

// برای خطا
WebApp.HapticFeedback.notificationOccurred('error');
```

---

## 🐛 عیب‌یابی

### Mini App باز نمی‌شود

1. **بررسی ngrok:**
   ```bash
   # مطمئن شوید ngrok در حال اجرا است
   # URL باید HTTPS باشد
   ```

2. **بررسی CORS:**
   ```bash
   # در backend/src/main.ts:
   app.enableCors();
   ```

3. **بررسی URL در BotFather:**
   - URL باید با https:// شروع شود
   - بدون / در انتها

### خطای احراز هویت

1. **بررسی Token:**
   ```bash
   # در backend/.env:
   TELEGRAM_BOT_TOKEN=8787350194:AAHzqvnJhvPOh1Fg6I7L8dEbav95N6e1u04
   ```

2. **بررسی Console:**
   - F12 در مرورگر
   - به دنبال خطاهای Telegram auth

### ngrok URL تغییر می‌کند

ngrok رایگان هر بار URL جدید می‌دهد. راه‌حل‌ها:

1. **ngrok Pro:** URL ثابت
2. **Deploy روی سرور:** URL دائمی
3. **هر بار URL را در BotFather آپدیت کنید**

---

## 📱 تست در Telegram

### دستورات Bot:

- `/start` - شروع و ورود به سامانه
- `/help` - راهنما

### تست کامل:

1. ✅ باز شدن Mini App
2. ✅ لاگین خودکار با Telegram
3. ✅ نمایش داشبورد
4. ✅ ثبت خبر جدید
5. ✅ مشاهده خبرها
6. ✅ Bottom Navigation
7. ✅ Haptic Feedback

---

## 🚀 مراحل بعدی (اختیاری)

### 1. اعلان‌های Telegram
- ارسال پیام وقتی خبر تایید می‌شود
- ارسال پیام وقتی اقدام محول می‌شود

### 2. Inline Keyboard
- دکمه‌های سریع در چت
- پاسخ‌های سریع

### 3. Payment Integration
- پرداخت از طریق Telegram

### 4. Share Button
- اشتراک‌گذاری خبرها در تلگرام

---

## 📞 اطلاعات Bot

- **Bot Token:** `8787350194:AAHzqvnJhvPOh1Fg6I7L8dEbav95N6e1u04`
- **Bot Username:** (از BotFather دریافت کنید)
- **WebApp URL:** (URL ngrok یا سرور شما)

---

## ✅ چک‌لیست نهایی

- [ ] Backend در حال اجرا است
- [ ] Frontend در حال اجرا است
- [ ] ngrok در حال اجرا است و URL دریافت شده
- [ ] URL در BotFather تنظیم شده
- [ ] WEBAPP_URL در backend/.env آپدیت شده
- [ ] Backend restart شده
- [ ] دستور /start در ربات زده شده
- [ ] Mini App باز می‌شود
- [ ] لاگین خودکار کار می‌کند

موفق باشید! 🎉
