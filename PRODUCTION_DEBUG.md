# راهنمای عیب‌یابی سرور Production

## مشکل فعلی
کاربر "zahrabiabanaki" (baleId: 1025603494) که عضو کانال نیست، روی سرور production داشبورد رو میبینه.

## مراحل عیب‌یابی

### 1. بررسی نسخه کد روی سرور
```bash
cd /path/to/project
git log -1 --oneline
```
باید آخرین commit این باشه: `0e65d21 fix: Correct database path for local development`

### 2. Pull کردن آخرین تغییرات
```bash
git pull origin main
```

### 3. بررسی فایل .env
```bash
cat backend/.env
```
باید این مقادیر رو داشته باشه:
```
BALE_BOT_TOKEN=407715407:wf0tQMl7yRbnqsOhkUUyIMxb7p8simgjGmg
BALE_API_URL=https://tapi.bale.ai
BALE_CHANNEL_USERNAME=@tasksmanager
```

### 4. Rebuild و Restart کردن سرویس‌ها
```bash
# توقف سرویس‌ها
docker-compose down

# پاک کردن node_modules و rebuild
cd backend
rm -rf node_modules dist
npm install
npm run build

cd ../frontend
rm -rf node_modules dist
npm install
npm run build

# راه‌اندازی مجدد
cd ..
docker-compose up -d --build
```

### 5. بررسی لاگ‌های Backend
```bash
docker-compose logs -f backend
```
باید این پیام‌ها رو ببینید:
- ✅ Bale Bot initialized (polling disabled)
- 🔗 Bale API URL: https://tapi.bale.ai
- 📢 Channel: @tasksmanager

### 6. تست API عضویت کانال
با Postman یا curl این endpoint رو تست کنید:

```bash
curl -X POST http://your-server:3000/auth/test-membership \
  -H "Content-Type: application/json" \
  -d '{"userId": "1025603494"}'
```

پاسخ باید این باشه:
```json
{
  "userId": "1025603494",
  "isMember": false,
  "channelUsername": "@tasksmanager",
  "timestamp": "2026-03-26T..."
}
```

### 7. تست با مینی‌اپ
1. همه یوزرها رو از دیتابیس پاک کنید (به جز admin)
2. با یوزر "zahrabiabanaki" مینی‌اپ رو باز کنید
3. باید پیام "شما دسترسی ندارید" رو ببینید

### 8. بررسی دیتابیس
```bash
# اتصال به دیتابیس
sqlite3 backend/incident_system.db

# لیست یوزرها
SELECT id, username, name, baleId, role FROM user;

# پاک کردن یوزرهای غیر admin
DELETE FROM user WHERE role != 'admin';

# خروج
.exit
```

## نکات مهم

1. **Bot باید Admin کانال باشه**: بات باید با دسترسی "View Members" به کانال اضافه شده باشه
2. **localStorage پاک میشه**: هر بار که مینی‌اپ باز میشه، localStorage پاک میشه و دوباره authentication انجام میشه
3. **خطاها رو چک کنید**: اگر خطایی در لاگ backend دیدید، اونو بررسی کنید

## اگر مشکل حل نشد

اگر بعد از این مراحل هنوز مشکل داره، این اطلاعات رو بفرستید:
1. خروجی `git log -1`
2. محتوای `backend/.env`
3. لاگ‌های backend (آخرین 50 خط)
4. نتیجه تست endpoint `/auth/test-membership`
