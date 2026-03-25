# ساختار پروژه

## 📁 ساختار کلی

```
incident-system/
├── backend/                    # NestJS Backend
│   ├── src/
│   │   ├── auth/              # احراز هویت (JWT)
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.service.ts
│   │   │   ├── auth.module.ts
│   │   │   ├── jwt.strategy.ts
│   │   │   └── jwt-auth.guard.ts
│   │   │
│   │   ├── users/             # مدیریت کاربران
│   │   │   ├── users.controller.ts
│   │   │   ├── users.service.ts
│   │   │   └── users.module.ts
│   │   │
│   │   ├── forms/             # فرم‌ساز
│   │   │   ├── forms.controller.ts
│   │   │   ├── forms.service.ts
│   │   │   └── forms.module.ts
│   │   │
│   │   ├── categories/        # دسته‌بندی‌ها
│   │   │   ├── categories.controller.ts
│   │   │   ├── categories.service.ts
│   │   │   └── categories.module.ts
│   │   │
│   │   ├── reports/           # مدیریت خبرها
│   │   │   ├── reports.controller.ts
│   │   │   ├── reports.service.ts
│   │   │   └── reports.module.ts
│   │   │
│   │   ├── actions/           # مدیریت اقدامات
│   │   │   ├── actions.controller.ts
│   │   │   ├── actions.service.ts
│   │   │   └── actions.module.ts
│   │   │
│   │   ├── seed/              # دیتای اولیه
│   │   │   ├── seed.controller.ts
│   │   │   ├── seed.service.ts
│   │   │   └── seed.module.ts
│   │   │
│   │   ├── database/
│   │   │   └── entities/      # Entity های TypeORM
│   │   │       ├── user.entity.ts
│   │   │       ├── form.entity.ts
│   │   │       ├── category.entity.ts
│   │   │       ├── report.entity.ts
│   │   │       ├── action.entity.ts
│   │   │       └── action-log.entity.ts
│   │   │
│   │   ├── app.module.ts      # ماژول اصلی
│   │   └── main.ts            # Entry point
│   │
│   ├── package.json
│   ├── tsconfig.json
│   ├── nest-cli.json
│   └── .env
│
├── frontend/                   # React Frontend
│   ├── src/
│   │   ├── pages/             # صفحات
│   │   │   ├── Login.tsx      # صفحه ورود
│   │   │   ├── Dashboard.tsx  # داشبورد
│   │   │   ├── FormBuilder.tsx # فرم‌ساز
│   │   │   ├── CreateReport.tsx # ثبت خبر
│   │   │   ├── ReportList.tsx  # لیست خبرها
│   │   │   ├── CreateAction.tsx # ایجاد اقدام
│   │   │   └── ActionList.tsx  # لیست اقدامات
│   │   │
│   │   ├── App.tsx            # کامپوننت اصلی
│   │   ├── main.tsx           # Entry point
│   │   └── index.css          # استایل‌ها
│   │
│   ├── index.html
│   ├── package.json
│   ├── tsconfig.json
│   ├── tsconfig.node.json
│   └── vite.config.ts
│
├── README.md                   # مستندات اصلی
├── GUIDE.md                    # راهنمای کامل
├── QUICK_START.md              # شروع سریع
├── PROJECT_STRUCTURE.md        # این فایل
├── test-api.http               # تست API ها
├── .gitignore
└── incident_system.db          # دیتابیس SQLite

```

## 🗄️ مدل دیتا

### User (کاربر)
- id: UUID
- phone: string (unique)
- name: string
- role: 'reporter' | 'operator' | 'admin'
- createdAt: Date

### Form (فرم)
- id: UUID
- title: string
- schema: JSON (فیلدهای فرم)
- isActive: boolean
- createdAt: Date
- updatedAt: Date

### Category (دسته‌بندی)
- id: UUID
- name: string
- description: string

### Report (خبر)
- id: UUID
- userId: UUID (FK → User)
- formId: UUID (FK → Form)
- categoryId: UUID (FK → Category)
- data: JSON (داده‌های فرم)
- status: 'new' | 'needs_action' | 'closed'
- createdAt: Date

### Action (اقدام)
- id: UUID
- title: string
- description: string
- assignedToId: UUID (FK → User)
- status: 'in_progress' | 'completed' | 'failed'
- createdAt: Date
- reports: Report[] (Many-to-Many)

### ActionLog (گزارش اقدام)
- id: UUID
- actionId: UUID (FK → Action)
- description: string
- result: string
- cost: number
- createdAt: Date

## 🔌 API Endpoints

### Auth
- `POST /auth/login` - ورود با شماره موبایل

### Users
- `GET /users` - لیست کاربران

### Forms
- `GET /forms` - لیست فرم‌ها
- `POST /forms` - ایجاد فرم
- `GET /forms/:id` - جزئیات فرم
- `PUT /forms/:id` - ویرایش فرم
- `DELETE /forms/:id` - حذف فرم

### Categories
- `GET /categories` - لیست دسته‌بندی‌ها
- `POST /categories` - ایجاد دسته‌بندی

### Reports
- `GET /reports` - همه خبرها
- `GET /reports/my` - خبرهای من
- `GET /reports/category/:categoryId` - خبرهای یک دسته
- `POST /reports` - ثبت خبر
- `PUT /reports/:id/status` - تغییر وضعیت

### Actions
- `GET /actions` - لیست اقدامات
- `GET /actions/:id` - جزئیات اقدام
- `POST /actions` - ایجاد اقدام
- `POST /actions/:id/logs` - ثبت گزارش
- `PUT /actions/:id/status` - تغییر وضعیت

### Seed
- `POST /seed` - ایجاد دیتای اولیه

## 🎨 صفحات Frontend

1. **Login** - ورود با شماره موبایل
2. **Dashboard** - صفحه اصلی با دسترسی سریع
3. **FormBuilder** - طراحی فرم‌های داینامیک (ادمین)
4. **CreateReport** - ثبت خبر جدید
5. **ReportList** - مشاهده و مدیریت خبرها
6. **CreateAction** - ایجاد اقدام جدید (اپراتور/ادمین)
7. **ActionList** - مشاهده و مدیریت اقدامات

## 🔐 نقش‌ها و دسترسی‌ها

### Reporter (کارمند)
- ثبت خبر
- مشاهده خبرهای خود

### Operator (کارشناس)
- همه دسترسی‌های Reporter
- مشاهده همه خبرها
- تغییر وضعیت خبرها
- ایجاد و مدیریت اقدامات

### Admin (ادمین)
- همه دسترسی‌های Operator
- طراحی فرم‌ها
- مدیریت دسته‌بندی‌ها
- مدیریت کاربران

## 🛠️ تکنولوژی‌ها

### Backend
- NestJS 10
- TypeORM
- SQLite
- JWT Authentication
- Passport

### Frontend
- React 18
- TypeScript
- React Router
- Axios
- Vite

## 📝 نکات فنی

1. **دیتابیس**: SQLite برای سادگی MVP
2. **احراز هویت**: JWT بدون OTP واقعی
3. **فرم‌ساز**: JSON Schema برای ذخیره ساختار فرم
4. **TypeORM Sync**: فعال است (فقط برای MVP)
5. **CORS**: فعال برای همه origin ها
