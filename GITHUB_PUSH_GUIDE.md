# 📤 راهنمای Push به GitHub

## ✅ آماده‌سازی انجام شده

- ✅ Git initialized
- ✅ Files committed
- ✅ README.md updated
- ✅ .gitignore configured

## 🚀 مراحل Push به GitHub

### روش 1: از طریق GitHub Website (ساده‌تر)

#### 1. ساخت Repository جدید
1. به [GitHub](https://github.com) برو
2. روی `+` کلیک کن → `New repository`
3. اطلاعات رو پر کن:
   - **Repository name:** `telegram-incident-management` (یا هر اسم دیگه)
   - **Description:** `Telegram Mini App for Incident & Action Management`
   - **Visibility:** Public یا Private
   - ⚠️ **مهم:** هیچ چیزی رو تیک نزن (نه README، نه .gitignore، نه License)
4. روی `Create repository` کلیک کن

#### 2. Push کردن کد
بعد از ساخت repository، GitHub یه صفحه نشون میده با دستورات. این دستورات رو اجرا کن:

```bash
# اضافه کردن remote
git remote add origin https://github.com/YOUR_USERNAME/telegram-incident-management.git

# Push کردن
git branch -M main
git push -u origin main
```

**نکته:** `YOUR_USERNAME` رو با username GitHub خودت عوض کن.

### روش 2: با GitHub CLI (اگر نصب کنی)

```bash
# نصب GitHub CLI
winget install --id GitHub.cli

# Login
gh auth login

# ساخت repo و push
gh repo create telegram-incident-management --public --source=. --remote=origin --push
```

## 📋 دستورات کامل (Copy & Paste)

بعد از ساخت repository در GitHub:

```bash
# 1. اضافه کردن remote (URL رو از GitHub کپی کن)
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git

# 2. تغییر نام branch به main
git branch -M main

# 3. Push کردن
git push -u origin main
```

## ✅ بعد از Push

Repository شما شامل موارد زیر خواهد بود:

### 📁 ساختار پروژه
```
telegram-incident-management/
├── backend/                 # NestJS backend
├── frontend/                # React frontend
├── docs/                    # مستندات فارسی و انگلیسی
├── README.md               # مستندات کامل
├── .gitignore              # فایل‌های ignore شده
└── package files
```

### 📚 مستندات موجود
- README.md - مستندات کامل انگلیسی
- راهنمای_تلگرام.md - راهنمای کامل فارسی
- شروع_سریع_تلگرام.md - شروع سریع
- راهنمای_گام_به_گام_تلگرام.md - گام به گام
- راهنمای_مدیریت_کاربران.md - مدیریت کاربران
- راهنمای_رفع_مشکل_لاگین.md - رفع مشکلات

### 🔒 فایل‌های Ignore شده
- `node_modules/` - وابستگی‌ها
- `*.db` - دیتابیس
- `.env` - متغیرهای محیطی
- `dist/` - فایل‌های build

## 🎯 نکات مهم

1. **قبل از Push:**
   - مطمئن شو `.env` در `.gitignore` هست ✅
   - مطمئن شو `node_modules` در `.gitignore` هست ✅
   - مطمئن شو `*.db` در `.gitignore` هست ✅

2. **بعد از Push:**
   - README.md رو در GitHub چک کن
   - مطمئن شو فایل‌های حساس push نشدن
   - یه screenshot از Mini App بگیر و به README اضافه کن

3. **برای آپدیت‌های بعدی:**
   ```bash
   git add .
   git commit -m "توضیحات تغییرات"
   git push
   ```

## 🌟 پیشنهادات

### اضافه کردن Topics به Repository
در GitHub، به Settings → Topics برو و این topics رو اضافه کن:
- `telegram-bot`
- `telegram-mini-app`
- `nestjs`
- `react`
- `typescript`
- `incident-management`
- `persian`

### اضافه کردن License
یه فایل LICENSE اضافه کن (MIT پیشنهاد میشه):
```bash
# در root پروژه
echo "MIT License..." > LICENSE
git add LICENSE
git commit -m "docs: Add MIT license"
git push
```

### اضافه کردن Screenshots
یه پوشه `screenshots/` بساز و عکس‌های Mini App رو اضافه کن:
```bash
mkdir screenshots
# عکس‌ها رو اضافه کن
git add screenshots/
git commit -m "docs: Add screenshots"
git push
```

## 🎉 تمام!

Repository شما آماده است! لینک رو با دوستات به اشتراک بذار:
```
https://github.com/YOUR_USERNAME/telegram-incident-management
```

موفق باشی! 🚀
