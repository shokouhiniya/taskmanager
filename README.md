# سامانه مدیریت خبر و اقدام

## نصب و راه‌اندازی

### پیش‌نیازها
- Node.js 18+

### مراحل راه‌اندازی

1. **نصب و اجرای Backend:**
```bash
cd backend
npm install
npm run start:dev
```

2. **نصب و اجرای Frontend:**
```bash
cd frontend
npm install
npm run dev
```

3. **ایجاد دیتای اولیه:**
```bash
# در ترمینال دیگر
curl -X POST http://localhost:3000/seed
# یا در PowerShell:
Invoke-WebRequest -Uri http://localhost:3000/seed -Method POST
```

4. **دسترسی:**
- Frontend: http://localhost:5173
- Backend API: http://localhost:3000

## کاربران پیش‌فرض

برای ورود از هر شماره موبایلی استفاده کنید (MVP بدون OTP)

## ساختار پروژه

```
├── backend/          # NestJS API
│   ├── src/
│   │   ├── auth/     # احراز هویت
│   │   ├── forms/    # فرم‌ساز
│   │   ├── reports/  # مدیریت خبرها
│   │   ├── actions/  # مدیریت اقدامات
│   │   └── categories/
├── frontend/         # React UI
└── docker-compose.yml
```

## API Endpoints

- POST /auth/login
- GET /forms
- POST /forms
- GET /reports
- POST /reports
- GET /actions
- POST /actions
