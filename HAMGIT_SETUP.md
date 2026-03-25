# 🔑 راهنمای Push به HamGit

## ✅ SSH Key ساخته شد

SSH key با موفقیت ساخته شد و آماده استفاده است.

## 📋 Public Key شما

این key رو باید در HamGit اضافه کنی:

```
ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIFnymxXtoFKb10FE8xQfRNq2ta2JPVkQJVaUvjNmqRl9 shokouhiniya@gmail.com
```

## 🚀 مراحل اضافه کردن SSH Key به HamGit

### 1. کپی کردن Public Key
Public key بالا رو کپی کن (کل خط)

### 2. اضافه کردن به HamGit
1. به https://hamgit.ir برو
2. وارد حساب کاربریت شو
3. به Settings → SSH Keys برو
4. روی "Add SSH Key" کلیک کن
5. Public key رو paste کن
6. یه عنوان بده (مثلاً: "My Laptop")
7. Save کن

### 3. تست کردن Connection
بعد از اضافه کردن key، این دستور رو اجرا کن:

```bash
ssh -T git@hamgit.ir
```

اگر موفق باشه، پیام خوش‌آمدگویی میبینی.

### 4. Push کردن به HamGit
```bash
git push hamgit main
```

## 🔄 Push به هر دو Repository

حالا می‌تونی به هر دو repository push کنی:

```bash
# Push به GitHub
git push origin main

# Push به HamGit
git push hamgit main

# یا هر دو با هم
git push --all
```

## 📝 نکات مهم

### اگر خطای Permission Denied گرفتی:
1. مطمئن شو SSH key رو در HamGit اضافه کردی
2. چک کن که public key رو کامل کپی کردی
3. SSH agent رو restart کن:
   ```bash
   # Windows
   Restart-Service ssh-agent
   
   # یا
   ssh-add ~/.ssh/id_ed25519
   ```

### اگر خطای "Repository not found" گرفتی:
- مطمئن شو repository در HamGit ساخته شده
- مطمئن شو URL درست است: `git@hamgit.ir:task-manager/taskmanager.git`
- مطمئن شو دسترسی push داری

## 🎯 Remote های فعلی

```bash
# لیست remote ها
git remote -v

# خروجی:
hamgit  git@hamgit.ir:task-manager/taskmanager.git (fetch)
hamgit  git@hamgit.ir:task-manager/taskmanager.git (push)
origin  https://github.com/shokouhiniya/taskmanager.git (fetch)
origin  https://github.com/shokouhiniya/taskmanager.git (push)
```

## 🔐 امنیت SSH Key

**مهم:** Private key (`id_ed25519`) رو هرگز به اشتراک نگذار!
- ✅ Public key (`id_ed25519.pub`) رو می‌تونی به اشتراک بذاری
- ❌ Private key (`id_ed25519`) رو نگه دار و به کسی نده

## 📍 مکان Key ها

```
C:\Users\shoko\.ssh\
├── id_ed25519       (Private - نگه دار!)
└── id_ed25519.pub   (Public - به اشتراک بذار)
```

## ✅ بعد از Setup

وقتی SSH key رو اضافه کردی، این دستور رو اجرا کن:

```bash
git push hamgit main
```

همه چیز آماده است! فقط SSH key رو در HamGit اضافه کن. 🚀
