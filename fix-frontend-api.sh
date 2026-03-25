#!/bin/bash

echo "🔧 Fix Frontend API URL"
echo "======================="
echo ""

cd /var/www/taskmanager/frontend

echo "1️⃣ پاک کردن build قبلی..."
rm -rf dist
rm -rf node_modules/.vite

echo ""
echo "2️⃣ حذف .env.local (اگر وجود داره)..."
rm -f .env.local

echo ""
echo "3️⃣ ایجاد/بروزرسانی .env.production..."
cat > .env.production << 'EOF'
# Production API URL
VITE_API_URL=/api
EOF

echo "محتویات .env.production:"
cat .env.production

echo ""
echo "4️⃣ Build کردن با VITE_API_URL=/api..."
VITE_API_URL=/api npm run build

echo ""
echo "5️⃣ بررسی فایل‌های build شده..."
if [ -d "dist" ]; then
    echo "✅ Build موفق بود"
    echo "فایل‌های dist:"
    ls -lh dist/
    
    # بررسی که API URL درست compile شده
    echo ""
    echo "6️⃣ بررسی API URL در فایل‌های build شده..."
    if grep -r "api.tasksmanager" dist/ 2>/dev/null; then
        echo "⚠️  هنوز api.tasksmanager در کد هست!"
    else
        echo "✅ api.tasksmanager در کد نیست"
    fi
    
    if grep -r "VITE_API_URL" dist/ 2>/dev/null; then
        echo "⚠️  VITE_API_URL جایگزین نشده!"
    else
        echo "✅ VITE_API_URL به درستی جایگزین شده"
    fi
else
    echo "❌ خطا: Build ناموفق بود!"
    exit 1
fi

echo ""
echo "7️⃣ Restart کردن Frontend..."
pm2 restart taskmanager-frontend

echo ""
echo "8️⃣ نمایش لاگ..."
pm2 logs taskmanager-frontend --lines 10 --nostream

echo ""
echo "✅ تمام!"
echo ""
echo "حالا سایت رو تست کن: https://tasksmanager.mardomi.org"
echo "باید به /api درخواست بده نه api.tasksmanager.mardomi.org"
echo ""
