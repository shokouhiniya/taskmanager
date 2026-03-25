# 🐳 تغییرات Docker و Deployment

## خلاصه تغییرات از HamGit

تغییرات مهمی برای آماده‌سازی پروژه جهت deployment با Docker انجام شده است.

---

## 📦 فایل‌های جدید اضافه شده

### 1. `.dockerignore`
فایل ignore برای Docker که از کپی شدن فایل‌های غیرضروری جلوگیری می‌کند:
- `node_modules` (هر دو frontend و backend)
- فایل‌های `.md` (مستندات)
- فایل‌های `.db` (دیتابیس محلی)
- فایل `.env` (تنظیمات محلی)
- پوشه‌های `dist` (فایل‌های build شده)

### 2. `Dockerfile` (Backend)
Docker image برای backend با ویژگی‌های زیر:
- Base image: `hub.megan.ir/node:18-alpine`
- استفاده از registry ایرانی: `hub.megan.ir/npm`
- نصب dependencies بدون native build: `--ignore-scripts`
- Build کردن TypeScript به JavaScript
- Expose port: `3000`
- اجرای production: `node dist/main.js`

### 3. `Dockerfile.frontend` (Frontend)
Docker image برای frontend با ویژگی‌های زیر:
- Base image: `hub.megan.ir/node:18-alpine`
- استفاده از registry ایرانی
- Build کردن Vite project
- Expose port: `4173`
- اجرای preview mode: `vite preview`

---

## 🔧 تغییرات در فایل‌های موجود

### Backend Changes

#### 1. `backend/package.json`
**تغییر dependencies برای سازگاری با Docker:**

```diff
- "bcrypt": "^5.1.1"           // نیاز به native build دارد
+ "bcryptjs": "^2.4.3"         // Pure JavaScript، بدون نیاز به build

- "sqlite3": "^5.1.6"          // نیاز به native build دارد
+ "sql.js": "^1.10.0"          // Pure JavaScript، بدون نیاز به build
```

**دلیل:** `bcrypt` و `sqlite3` نیاز به `node-gyp` و native compilation دارند که در Docker Alpine مشکل ایجاد می‌کند.

#### 2. `backend/src/app.module.ts`
**تغییر TypeORM configuration:**

```diff
- type: 'sqlite',
- database: 'incident_system.db',
+ type: 'sqljs',
+ location: 'incident_system.db',
+ autoSave: true,
```

**دلیل:** `sql.js` یک implementation کامل SQLite در JavaScript است که نیازی به native module ندارد.

#### 3. `backend/src/auth/auth.service.ts`
```diff
- import * as bcrypt from 'bcrypt';
+ import * as bcrypt from 'bcryptjs';
```

#### 4. `backend/src/seed/seed.service.ts`
```diff
- import * as bcrypt from 'bcrypt';
+ import * as bcrypt from 'bcryptjs';
```

#### 5. `backend/src/users/users.service.ts`
```diff
- import * as bcrypt from 'bcrypt';
+ import * as bcrypt from 'bcryptjs';
```

### Frontend Changes

#### 1. `frontend/src/api/axios.ts`
**ساده‌سازی و استفاده از environment variable:**

```diff
- // تشخیص محیط Telegram Mini App
- const isTelegramWebApp = window.Telegram?.WebApp?.platform !== 'unknown';
+ // آدرس API از environment variable یا fallback به همون origin با /api
+ const API_URL = import.meta.env.VITE_API_URL || '/api';

- const api = axios.create({
-   baseURL: isTelegramWebApp
-     ? '/api'
-     : 'http://localhost:3000',
- });
+ const api = axios.create({
+   baseURL: API_URL,
+ });

- console.log('🌐 API Base URL:', api.defaults.baseURL);
- console.log('📱 Is Telegram WebApp:', isTelegramWebApp);
```

**مزایا:**
- قابلیت تنظیم API URL از طریق environment variable
- ساده‌تر و قابل نگهداری‌تر
- مناسب برای deployment در محیط‌های مختلف

#### 2. `frontend/vite.config.ts`
**حذف محدودیت allowedHosts:**

```diff
- allowedHosts: [
-   'enchondromatous-aerobiologically-kristie.ngrok-free.dev',
-   '.ngrok-free.dev',
-   '.ngrok.io',
-   'localhost'
- ],
+ allowedHosts: true,
```

**دلیل:** با `true` همه hostها مجاز هستند، مناسب برای deployment روی domainهای مختلف.

---

## 🎯 مزایای این تغییرات

### 1. سازگاری با Docker
- حذف وابستگی به native modules
- استفاده از Pure JavaScript alternatives
- کاهش حجم image و سرعت build

### 2. استفاده از Registry ایرانی
- دسترسی سریع‌تر به packages
- عدم نیاز به VPN
- پایداری بیشتر در deployment

### 3. قابلیت Configuration
- استفاده از environment variables
- انعطاف‌پذیری در تنظیمات
- مناسب برای محیط‌های مختلف (dev, staging, production)

### 4. ساده‌سازی
- کد تمیزتر و قابل نگهداری‌تر
- کاهش پیچیدگی
- بهبود performance

---

## 🚀 نحوه استفاده

### Build کردن Images

```bash
# Backend
docker build -f Dockerfile -t taskmanager-backend .

# Frontend
docker build -f Dockerfile.frontend -t taskmanager-frontend .
```

### اجرای Containers

```bash
# Backend
docker run -p 3000:3000 taskmanager-backend

# Frontend
docker run -p 4173:4173 taskmanager-frontend
```

### استفاده از Docker Compose (پیشنهادی)

می‌توانید یک `docker-compose.yml` بسازید:

```yaml
version: '3.8'

services:
  backend:
    build:
      context: .
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    environment:
      - JWT_SECRET=your-secret-key
      - TELEGRAM_BOT_TOKEN=your-telegram-token
      - BALE_BOT_TOKEN=your-bale-token
    volumes:
      - ./data:/app/incident_system.db

  frontend:
    build:
      context: .
      dockerfile: Dockerfile.frontend
    ports:
      - "4173:4173"
    environment:
      - VITE_API_URL=/api
    depends_on:
      - backend
```

---

## ⚠️ نکات مهم

### 1. Database Persistence
در production باید volume برای دیتابیس تنظیم کنید تا اطلاعات حفظ شود:
```yaml
volumes:
  - ./data:/app/incident_system.db
```

### 2. Environment Variables
حتماً environment variableهای زیر را تنظیم کنید:
- `JWT_SECRET`
- `TELEGRAM_BOT_TOKEN`
- `BALE_BOT_TOKEN`
- `VITE_API_URL` (برای frontend)

### 3. Security
در production:
- از `.env` file استفاده نکنید
- از Docker secrets یا environment variables استفاده کنید
- JWT_SECRET را تصادفی و قوی انتخاب کنید

### 4. Performance
- برای production از multi-stage build استفاده کنید
- Static assets را با nginx سرو کنید
- از caching برای npm install استفاده کنید

---

## 📊 مقایسه قبل و بعد

| مورد | قبل | بعد |
|------|-----|-----|
| bcrypt | Native module | bcryptjs (Pure JS) |
| sqlite3 | Native module | sql.js (Pure JS) |
| API URL | Hardcoded | Environment variable |
| Allowed Hosts | محدود | همه (true) |
| Docker Support | ❌ | ✅ |
| Registry | npm (خارجی) | hub.megan.ir (ایرانی) |

---

## ✅ چک لیست Deployment

- [x] Dockerfiles ایجاد شده
- [x] Dependencies به Pure JS تبدیل شده
- [x] Registry ایرانی تنظیم شده
- [x] Environment variables پیاده‌سازی شده
- [x] .dockerignore اضافه شده
- [ ] Docker Compose تنظیم شود (اختیاری)
- [ ] CI/CD Pipeline تنظیم شود (اختیاری)
- [ ] Nginx برای production تنظیم شود (اختیاری)

---

تاریخ: 25 مارس 2026
وضعیت: ✅ آماده برای deployment
