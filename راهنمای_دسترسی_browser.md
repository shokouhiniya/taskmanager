# 🌐 راهنمای دسترسی از Browser معمولی

## مراحل دسترسی

### 1️⃣ اجرای Backend
```bash
cd backend
npm run start:dev
```
Backend روی `http://localhost:3000` اجرا می‌شود.

### 2️⃣ اجرای Frontend
```bash
cd frontend
npm run dev
```
Frontend روی `http://localhost:5173` اجرا می‌شود.

### 3️⃣ باز کردن در Browser
در مرورگر خود این آدرس را باز کنید:
```
http://localhost:5173
```

## 🔐 اطلاعات ورود

صفحه Login نمایش داده می‌شود با فرم username و password:

**Admin:**
- نام کاربری: `admin`
- رمز عبور: `1236987450`

## 🎯 تفاوت Browser و Mini App

### در Browser معمولی:
- ✅ صفحه Login نمایش داده می‌شود
- ✅ باید username و password وارد کنید
- ✅ Navbar بالای صفحه نمایش داده می‌شود
- ✅ بدون محدودیت Telegram/Bale

### در Mini App (Telegram/Bale):
- ✅ Login خودکار با اطلاعات Telegram/Bale
- ✅ Navigation پایین صفحه (Bottom Nav)
- ✅ UI موبایل با glassmorphism
- ✅ نیازی به username/password نیست

## 🔄 چگونگی تشخیص

کد شما به صورت هوشمند تشخیص می‌دهد:

```typescript
const isTg = WebApp.platform !== 'unknown';
```

- اگر `platform === 'unknown'` → Browser معمولی → Login Page
- اگر `platform !== 'unknown'` → Mini App → Auto Login

## 📝 نکات مهم

### 1. Backend باید در حال اجرا باشد
```bash
# چک کردن
curl http://localhost:3000
```

### 2. Frontend باید در حال اجرا باشد
```bash
# چک کردن
curl http://localhost:5173
```

### 3. Vite Proxy
در حالت development، Vite به صورت خودکار `/api` را به `localhost:3000` proxy می‌کند:

```typescript
// frontend/vite.config.ts
proxy: {
  '/api': {
    target: 'http://localhost:3000',
    changeOrigin: true,
    rewrite: (path) => path.replace(/^\/api/, '')
  }
}
```

### 4. اگر Backend روی پورت دیگری است
فایل `frontend/vite.config.ts` را ویرایش کنید:

```typescript
proxy: {
  '/api': {
    target: 'http://localhost:YOUR_PORT',  // تغییر دهید
    // ...
  }
}
```

## 🚀 دستورات سریع

### اجرای همزمان (در ترمینال‌های جداگانه)

**ترمینال 1 - Backend:**
```bash
cd backend
npm run start:dev
```

**ترمینال 2 - Frontend:**
```bash
cd frontend
npm run dev
```

**ترمینال 3 - باز کردن Browser:**
```bash
# Windows
start http://localhost:5173

# Mac/Linux
open http://localhost:5173
```

## 🐛 عیب‌یابی

### مشکل: صفحه سفید
**راه حل:**
1. Console browser را باز کنید (F12)
2. خطاها را بررسی کنید
3. مطمئن شوید Backend در حال اجرا است

### مشکل: Network Error
**راه حل:**
```bash
# چک کردن Backend
curl http://localhost:3000/auth/login

# اگر خطا داد، Backend را restart کنید
cd backend
npm run start:dev
```

### مشکل: Cannot GET /
**راه حل:**
- Frontend را restart کنید
- Cache browser را پاک کنید (Ctrl+Shift+R)

### مشکل: Login نمی‌شود
**راه حل:**
1. اطلاعات ورود را چک کنید:
   - Username: `admin`
   - Password: `1236987450`
2. Console را بررسی کنید
3. Network tab را بررسی کنید

## 📊 مقایسه URLs

| محیط | Frontend URL | Backend URL | نیاز به ngrok |
|------|-------------|-------------|---------------|
| Browser معمولی | `http://localhost:5173` | `http://localhost:3000` | ❌ خیر |
| Telegram Mini App | `https://your-ngrok.ngrok-free.dev` | `http://localhost:3000` | ✅ بله |
| Bale Mini App | `https://your-ngrok.ngrok-free.dev` | `http://localhost:3000` | ✅ بله |
| Production | `https://yourdomain.com` | `https://api.yourdomain.com` | ❌ خیر |

## ✅ چک لیست

قبل از باز کردن در Browser:

- [ ] Node.js نصب است
- [ ] Dependencies نصب شده (`npm install` در هر دو پوشه)
- [ ] Backend در حال اجرا است (`localhost:3000`)
- [ ] Frontend در حال اجرا است (`localhost:5173`)
- [ ] اطلاعات ورود را می‌دانید (`admin` / `1236987450`)

## 🎉 موفقیت

اگر همه چیز درست باشد:

1. ✅ صفحه Login نمایش داده می‌شود
2. ✅ با وارد کردن username و password وارد می‌شوید
3. ✅ Dashboard نمایش داده می‌شود
4. ✅ Navbar بالای صفحه قابل مشاهده است
5. ✅ تمام صفحات قابل دسترسی هستند

---

**خلاصه:**
```
URL: http://localhost:5173
Username: admin
Password: 1236987450
```

موفق باشید! 🚀
