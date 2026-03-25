# 🔍 راهنمای عیب‌یابی (Debugging Guide)

## مشکلات رایج و راه‌حل‌ها

### 1. خبرها نمایش داده نمی‌شوند

#### علائم:
- بعد از ثبت خبر، در لیست خبرها نمایش داده نمی‌شود
- صفحه خالی است یا پیام "هنوز خبری ثبت نشده" نمایش داده می‌شود

#### راه‌حل‌ها:

**الف) بررسی Console در مرورگر:**
```bash
# در مرورگر F12 را بزنید و به تب Console بروید
# به دنبال خطاهای زیر بگردید:
- JSON parse errors
- 401 Unauthorized
- Network errors
```

**ب) بررسی Backend:**
```bash
# در ترمینال backend به دنبال خطا بگردید
# اگر خطایی نیست، بررسی کنید که endpoint درست کار می‌کند:
curl -X GET http://localhost:3000/reports \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**ج) بررسی Database:**
```bash
# اگر SQLite browser دارید، فایل را باز کنید:
backend/incident_system.db

# یا با sqlite3:
sqlite3 backend/incident_system.db
SELECT * FROM reports;
```

**د) Clear Cache و Reload:**
```bash
# در مرورگر:
1. Ctrl+Shift+Delete
2. Clear cache
3. Hard reload: Ctrl+Shift+R
```

### 2. خطای 401 Unauthorized

#### علائم:
- بعد از لاگین، درخواست‌ها با خطای 401 مواجه می‌شوند
- به صفحه لاگین redirect می‌شوید

#### راه‌حل‌ها:

**الف) بررسی Token:**
```javascript
// در Console مرورگر:
console.log(localStorage.getItem('token'));
console.log(localStorage.getItem('user'));
```

**ب) بررسی JWT Secret:**
```bash
# در backend/.env بررسی کنید:
JWT_SECRET=your-secret-key-here

# مطمئن شوید که با مقدار در jwt.strategy.ts یکسان است
```

**ج) Logout و Login مجدد:**
```bash
# گاهی token منقضی می‌شود
# خروج و ورود مجدد مشکل را حل می‌کند
```

### 3. دسترسی به صفحات محدود شده

#### علائم:
- با URL مستقیم می‌توانید به صفحات ادمین دسترسی پیدا کنید
- ProtectedRoute کار نمی‌کند

#### راه‌حل:
این مشکل در آخرین نسخه رفع شده است. اگر هنوز مشکل دارید:

```bash
# مطمئن شوید که frontend را restart کرده‌اید:
cd frontend
npm run dev
```

### 4. فرم‌ها یا دسته‌بندی‌ها نمایش داده نمی‌شوند

#### راه‌حل:

**الف) بررسی Database:**
```sql
-- در sqlite3:
SELECT * FROM forms;
SELECT * FROM categories;
```

**ب) Seed کردن دیتا:**
```bash
# اگر دیتابیس خالی است:
curl -X POST http://localhost:3000/seed
```

### 5. خطای CORS

#### علائم:
```
Access to XMLHttpRequest at 'http://localhost:3000/...' from origin 'http://localhost:5173' has been blocked by CORS policy
```

#### راه‌حل:
```bash
# در backend/src/main.ts بررسی کنید که CORS فعال است:
app.enableCors();

# اگر نیست، اضافه کنید و backend را restart کنید
```

## 🧪 تست‌های دستی

### تست 1: ثبت و نمایش خبر

```bash
# 1. لاگین کنید (admin یا reporter)
# 2. برو به "ثبت خبر جدید"
# 3. یک فرم انتخاب کنید
# 4. فیلدها را پر کنید
# 5. دسته‌بندی انتخاب کنید
# 6. ثبت کنید
# 7. برو به "خبرها" و بررسی کنید که نمایش داده می‌شود
```

### تست 2: Access Control

```bash
# 1. با یوزر reporter لاگین کنید
# 2. سعی کنید به این URLها دسترسی پیدا کنید:
http://localhost:5173/users
http://localhost:5173/forms
http://localhost:5173/categories

# باید به داشبورد redirect شوید
```

### تست 3: ارجاع خبر

```bash
# 1. با admin لاگین کنید
# 2. یک خبر جدید ثبت کنید
# 3. در لیست خبرها، روی "تایید و ارجاع" کلیک کنید
# 4. یک کاربر انتخاب کنید
# 5. با آن کاربر لاگین کنید
# 6. برو به "خبرهای ارجاع شده"
# 7. باید خبر را ببینید
```

## 📊 بررسی وضعیت سیستم

### Backend Health Check:
```bash
curl http://localhost:3000
# باید پاسخ بدهد (حتی اگر 404 باشد، یعنی سرور کار می‌کند)
```

### Frontend Health Check:
```bash
# باز کردن http://localhost:5173 در مرورگر
# باید صفحه لاگین نمایش داده شود
```

### Database Health Check:
```bash
ls -lh backend/incident_system.db
# باید فایل وجود داشته باشد و حجم بیشتر از 0 باشد
```

## 🔧 Reset کامل سیستم

اگر همه چیز خراب شد:

```bash
# 1. Stop کردن سرورها (Ctrl+C)

# 2. پاک کردن دیتابیس
rm backend/incident_system.db

# 3. Restart Backend
cd backend
npm run start:dev

# 4. Seed کردن دیتا
curl -X POST http://localhost:3000/seed

# 5. Clear Browser Cache
# در مرورگر: Ctrl+Shift+Delete

# 6. Restart Frontend
cd frontend
npm run dev

# 7. لاگین با admin/1236987450
```

## 📞 اطلاعات تماس برای پشتیبانی

اگر مشکل حل نشد:
1. Screenshot از Console errors بگیرید
2. Log های Backend را کپی کنید
3. مراحلی که انجام دادید را شرح دهید
