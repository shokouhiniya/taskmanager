# 🤖 Telegram Mini App - سامانه مدیریت خبر و اقدام

## 📱 درباره این پروژه

این پروژه یک سیستم مدیریت خبر و اقدام است که به صورت **Telegram Mini App** قابل استفاده است.

### ویژگی‌های کلیدی:
- ✅ احراز هویت خودکار با Telegram
- ✅ ثبت و مدیریت خبرها
- ✅ ارجاع خبر به کاربران
- ✅ مدیریت اقدامات
- ✅ فرم‌ساز داینامیک
- ✅ مدیریت دسته‌بندی‌ها
- ✅ UI شیشه‌ای با فونت فارسی
- ✅ Bottom Navigation برای دسترسی سریع

---

## 🚀 راه‌اندازی سریع

### 1. نصب Dependencies

```bash
# Backend
cd backend
npm install

# Frontend
cd frontend
npm install
```

### 2. نصب ngrok

```bash
# ویندوز (با Chocolatey)
choco install ngrok

# یا دانلود از:
https://ngrok.com/download
```

### 3. تنظیم ngrok

```bash
# ثبت‌نام در ngrok.com و دریافت authtoken
ngrok config add-authtoken YOUR_AUTHTOKEN
```

### 4. راه‌اندازی

**روش آسان (ویندوز):**
```bash
start-telegram-app.bat
```

**روش دستی:**
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

### 5. تنظیم Bot

1. به [@BotFather](https://t.me/BotFather) بروید
2. `/mybots` → انتخاب ربات
3. Bot Settings → Menu Button → Configure
4. URL ngrok را وارد کنید
5. متن: `🚀 ورود به سامانه`

### 6. آپدیت Backend

فایل `backend/.env`:
```env
WEBAPP_URL=https://your-ngrok-url.ngrok-free.app
```

Backend را restart کنید.

### 7. تست

1. به ربات در تلگرام بروید
2. `/start`
3. کلیک روی دکمه
4. Mini App باز می‌شود!

---

## 📚 مستندات

### راهنماهای فارسی:
- **شروع_سریع_تلگرام.md** - راه‌اندازی در 5 دقیقه
- **راهنمای_گام_به_گام_تلگرام.md** - راهنمای کامل مرحله‌به‌مرحله
- **راهنمای_تلگرام.md** - راهنمای جامع
- **خلاصه_تبدیل_به_تلگرام.md** - خلاصه تغییرات

### راهنماهای انگلیسی:
- **TELEGRAM_SETUP.md** - راهنمای تکنیکال
- **TELEGRAM_CHANGES.md** - لیست تغییرات

### راهنماهای عمومی:
- **README.md** - معرفی پروژه
- **GUIDE.md** - راهنمای استفاده
- **DEBUG_GUIDE.md** - عیب‌یابی

---

## 🎯 نقش‌های کاربری

### Reporter (کاربر عادی):
- ثبت خبر جدید
- مشاهده خبرهای خود
- مشاهده خبرهای ارجاع شده
- مدیریت اقدامات محول شده

### Admin (مدیر):
- همه قابلیت‌های Reporter
- مشاهده همه خبرها
- تایید/رد/ارجاع خبرها
- مدیریت فرم‌ها
- مدیریت دسته‌بندی‌ها
- مدیریت کاربران
- ایجاد اقدامات

---

## 🔐 احراز هویت

### در Telegram:
- خودکار با Telegram ID
- بدون نیاز به username/password
- نقش پیش‌فرض: Reporter

### در Web (مرورگر):
- Username: `admin`
- Password: `1236987450`

---

## 🛠️ تکنولوژی‌ها

### Backend:
- NestJS
- TypeORM
- SQLite
- JWT
- Telegram Bot API

### Frontend:
- React
- TypeScript
- Vite
- Telegram WebApp SDK
- Axios

---

## 📊 ساختار پروژه

```
project/
├── backend/
│   ├── src/
│   │   ├── telegram/          ✨ جدید
│   │   ├── auth/
│   │   ├── reports/
│   │   ├── actions/
│   │   ├── forms/
│   │   ├── categories/
│   │   └── users/
│   └── .env
├── frontend/
│   ├── src/
│   │   ├── telegram/          ✨ جدید
│   │   ├── components/
│   │   │   └── TelegramNav    ✨ جدید
│   │   ├── pages/
│   │   └── api/
│   └── index.html
└── مستندات/
```

---

## 🎨 ویژگی‌های UI

- Glassmorphism Design
- فونت Vazirmatn (فارسی)
- Bottom Navigation (Telegram)
- Haptic Feedback
- Responsive
- Dark/Light Theme Support

---

## 🔧 تنظیمات

### Environment Variables:

**Backend (.env):**
```env
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=7d
PORT=3000
TELEGRAM_BOT_TOKEN=8787350194:AAHzqvnJhvPOh1Fg6I7L8dEbav95N6e1u04
WEBAPP_URL=https://your-ngrok-url.ngrok-free.app
```

---

## 🌐 Deploy

### Development (ngrok):
- Frontend: ngrok tunnel
- Backend: localhost:3000
- Database: SQLite local

### Production:
- Frontend: Vercel/Netlify
- Backend: Railway/Heroku
- Database: PostgreSQL/MySQL

---

## 📞 پشتیبانی

### مشکلات رایج:

**Mini App باز نمی‌شود:**
- بررسی ngrok
- بررسی URL در BotFather
- بررسی HTTPS

**خطای احراز هویت:**
- بررسی Token در .env
- Restart Backend
- Clear Cache

**مستندات کامل:**
- `DEBUG_GUIDE.md`
- `راهنمای_تلگرام.md`

---

## 🎓 یادگیری بیشتر

### Telegram Mini Apps:
- https://core.telegram.org/bots/webapps

### Telegram Bot API:
- https://core.telegram.org/bots/api

### ngrok:
- https://ngrok.com/docs

---

## 📄 لایسنس

این پروژه برای استفاده داخلی سازمان طراحی شده است.

---

## 🎉 تشکر

از استفاده از این سیستم متشکریم!

برای سوالات و پشتیبانی، به مستندات مراجعه کنید.

موفق باشید! 🚀
