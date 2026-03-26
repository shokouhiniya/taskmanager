# راهنمای به‌روزرسانی سرور Production

## ✅ کد با موفقیت به HamGit push شد
Commit: `882349b` - "feat: Implement Bale channel membership check system"

## 🚀 مراحل به‌روزرسانی سرور Production

### مرحله 1: اتصال به سرور
```bash
ssh user@your-server
cd /path/to/taskmanager
```

### مرحله 2: Pull کردن کد جدید
```bash
git pull origin main
```

### مرحله 3: نصب وابستگی‌های جدید
```bash
# Backend - نصب axios
cd backend
npm install

# Frontend (اگر لازم باشد)
cd ../frontend
npm install
```

### مرحله 4: بررسی .env
مطمئن شو که این متغیرها در `backend/.env` هستند:
```env
BALE_BOT_TOKEN=407715407:wf0tQMl7yRbnqsOhkUUyIMxb7p8simgjGmg
BALE_API_URL=https://tapi.bale.ai
BALE_CHANNEL_USERNAME=@tasksmanager
```

### مرحله 5: Build کردن
```bash
# Backend
cd backend
npm run build

# Frontend
cd ../frontend
npm run build
```

### مرحله 6: Restart کردن سرویس‌ها

#### اگر از Docker استفاده می‌کنی:
```bash
docker-compose down
docker-compose up -d --build
```

#### اگر از PM2 استفاده می‌کنی:
```bash
pm2 restart backend
pm2 restart frontend
```

#### اگر از systemd استفاده می‌کنی:
```bash
sudo systemctl restart taskmanager-backend
sudo systemctl restart taskmanager-frontend
```

### مرحله 7: پاک کردن کاربران قدیمی (اختیاری)
```bash
# اگر می‌خوای تمام کاربران قدیمی رو پاک کنی
curl -X POST https://api.tasksmanager.mardomi.org/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"1236987450"}'

# توکن رو کپی کن و بعد:
curl -X DELETE https://api.tasksmanager.mardomi.org/users/cleanup/all \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### مرحله 8: تست
1. مینی اپ رو با یک کاربر عضو کانال باز کن → باید وارد داشبورد بشه
2. مینی اپ رو با یک کاربر غیر عضو باز کن → باید پیام "دسترسی ندارید" ببینه

## 🔍 بررسی لاگ‌ها

### Docker:
```bash
docker-compose logs -f backend
```

### PM2:
```bash
pm2 logs backend
```

### systemd:
```bash
sudo journalctl -u taskmanager-backend -f
```

## ⚠️ نکات مهم

1. ✅ ربات باید ادمین کانال باشد (قبلاً انجام دادی)
2. ✅ `BALE_CHANNEL_USERNAME=@tasksmanager` در `.env` باشد
3. ✅ Backend باید restart بشه تا تغییرات اعمال شوند
4. ✅ Frontend باید rebuild بشه

## 🐛 اگر مشکل داشتی

### مشکل 1: کاربر عضو نمی‌تونه وارد بشه
- لاگ backend رو چک کن
- مطمئن شو ربات ادمین کانال هست
- مطمئن شو `BALE_CHANNEL_USERNAME` درست است

### مشکل 2: کاربر غیر عضو وارد میشه
- مطمئن شو کد جدید pull شده
- مطمئن شو backend restart شده
- لاگ backend رو چک کن

### مشکل 3: صفحه لودینگ می‌مونه
- Network tab رو در Developer Tools چک کن
- ببین آیا request به `/auth/bale` میره یا نه
- ببین چه خطایی برمی‌گردونه

## 📞 دستورات مفید برای Debug

```bash
# چک کردن وضعیت سرویس‌ها
docker-compose ps
# یا
pm2 status

# دیدن لاگ‌های زنده
docker-compose logs -f
# یا
pm2 logs

# تست API
curl https://api.tasksmanager.mardomi.org/auth/test-membership \
  -H "Content-Type: application/json" \
  -d '{"userId":"697280583"}'
```
