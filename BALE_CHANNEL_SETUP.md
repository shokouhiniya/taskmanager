# راهنمای تنظیم کانال بله برای بررسی عضویت

## مشکل فعلی
خطا: `Forbidden: permission_denied`

این خطا به این معنی است که ربات بله شما اجازه دسترسی به اطلاعات کانال را ندارد.

## راه حل: اضافه کردن ربات به عنوان ادمین کانال

### مرحله 1: پیدا کردن ربات
1. در بله، به ربات خود بروید: `@TasksManagerBot` (یا هر نام دیگری که دارید)
2. یا از لینک زیر استفاده کنید تا ربات را پیدا کنید

### مرحله 2: اضافه کردن ربات به کانال
1. به کانال "رابطین" بروید (لینک: http://ble.ir/tasksmanager)
2. روی تنظیمات کانال کلیک کنید
3. گزینه "مدیران" یا "Administrators" را انتخاب کنید
4. روی "افزودن مدیر" یا "Add Administrator" کلیک کنید
5. ربات خود را جستجو و اضافه کنید

### مرحله 3: تنظیم دسترسی‌های ربات
ربات به این دسترسی‌ها نیاز دارد:
- ✅ **مشاهده اعضا** (View Members) - برای بررسی عضویت کاربران
- ❌ سایر دسترسی‌ها اختیاری هستند

### مرحله 4: تست
بعد از اضافه کردن ربات به عنوان ادمین، دوباره تست کنید:

```bash
# تست عضویت یک کاربر
curl -X POST http://localhost:3000/auth/test-membership \
  -H "Content-Type: application/json" \
  -d '{"userId":"USER_ID_HERE"}'
```

## اطلاعات کانال

- **نام کانال**: رابطین
- **Username**: @tasksmanager
- **Chat ID**: 5509681284
- **لینک**: http://ble.ir/tasksmanager

## اطلاعات ربات

- **Token**: 407715407:wf0tQMl7yRbnqsOhkUUyIMxb7p8simgjGmg
- **API URL**: https://tapi.bale.ai

## نکات مهم

1. ✅ ربات باید **ادمین کانال** باشد (نه فقط عضو)
2. ✅ ربات باید دسترسی "مشاهده اعضا" داشته باشد
3. ✅ کانال باید **عمومی** (Public) باشد یا ربات باید به آن دسترسی داشته باشد
4. ✅ Username کانال در `.env` باید درست باشد: `@tasksmanager`

## تست دستی با API بله

### 1. دریافت اطلاعات کانال
```bash
curl "https://tapi.bale.ai/bot407715407:wf0tQMl7yRbnqsOhkUUyIMxb7p8simgjGmg/getChat?chat_id=@tasksmanager"
```

### 2. بررسی عضویت یک کاربر
```bash
curl "https://tapi.bale.ai/bot407715407:wf0tQMl7yRbnqsOhkUUyIMxb7p8simgjGmg/getChatMember?chat_id=@tasksmanager&user_id=USER_ID"
```

جایگزین کردن `USER_ID` با شناسه کاربر بله

## وضعیت‌های عضویت

API بله این وضعیت‌ها را برمی‌گرداند:
- ✅ `creator` - سازنده کانال (مجاز)
- ✅ `administrator` - ادمین کانال (مجاز)
- ✅ `member` - عضو عادی (مجاز)
- ❌ `left` - کاربر کانال را ترک کرده (غیرمجاز)
- ❌ `kicked` - کاربر از کانال اخراج شده (غیرمجاز)

## خطاهای رایج

### 1. `Forbidden: permission_denied`
**علت**: ربات ادمین کانال نیست یا دسترسی کافی ندارد
**راه حل**: ربات را به عنوان ادمین کانال اضافه کنید

### 2. `Bad Request: chat not found`
**علت**: Username کانال اشتباه است
**راه حل**: Username را در `.env` بررسی کنید

### 3. `Bad Request: user not found`
**علت**: User ID اشتباه است
**راه حل**: User ID را از Mini App دریافت کنید

## بعد از تنظیم

وقتی ربات را به عنوان ادمین اضافه کردید:
1. Backend را restart کنید
2. تمام کاربران را پاک کنید (با اسکریپت `delete-users.ps1`)
3. 4 نفر را تست کنید:
   - 2 نفر عضو کانال → باید وارد شوند
   - 2 نفر غیر عضو → باید پیام "دسترسی ندارید" ببینند

## دستورات مفید

```powershell
# پاک کردن تمام کاربران
./delete-users.ps1

# تست عضویت
$response = Invoke-RestMethod -Uri "http://localhost:3000/auth/test-membership" -Method POST -Body '{"userId":"USER_ID"}' -ContentType "application/json"
$response | ConvertTo-Json
```
