#!/bin/bash

echo "🚀 Deployment Script for tasksmanager.mardomi.org"
echo "=================================================="
echo ""

# رنگ‌ها برای خروجی
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# مسیر پروژه روی سرور
PROJECT_PATH="/var/www/taskmanager"

echo -e "${YELLOW}مرحله 1: Pull کردن آخرین تغییرات${NC}"
cd $PROJECT_PATH
git pull origin main

echo ""
echo -e "${YELLOW}مرحله 2: بروزرسانی Backend${NC}"
cd $PROJECT_PATH/backend

# نصب dependencies
echo -e "${BLUE}  → نصب dependencies...${NC}"
npm install

# Build
echo -e "${BLUE}  → Build کردن...${NC}"
npm run build

# Restart PM2
echo -e "${BLUE}  → Restart کردن Backend...${NC}"
pm2 restart taskmanager-backend

echo ""
echo -e "${YELLOW}مرحله 3: بروزرسانی Frontend${NC}"
cd $PROJECT_PATH/frontend

# پاک کردن dist قبلی
echo -e "${BLUE}  → پاک کردن build قبلی...${NC}"
rm -rf dist

# حذف .env.local اگر وجود داره (ممکنه مشکل ساز باشه)
rm -f .env.local

# نمایش محتویات .env.production
echo -e "${BLUE}  → بررسی .env.production:${NC}"
cat .env.production

# نصب dependencies
echo -e "${BLUE}  → نصب dependencies...${NC}"
npm install

# Build با environment variable صریح
echo -e "${BLUE}  → Build کردن با VITE_API_URL=/api...${NC}"
VITE_API_URL=/api npm run build

# بررسی که dist ساخته شده
if [ -d "dist" ]; then
    echo -e "${GREEN}  ✓ Build موفق بود${NC}"
    ls -lh dist/
else
    echo -e "${RED}  ✗ خطا: پوشه dist ساخته نشد!${NC}"
    exit 1
fi

# Restart PM2
echo -e "${BLUE}  → Restart کردن Frontend...${NC}"
pm2 restart taskmanager-frontend

echo ""
echo -e "${YELLOW}مرحله 4: بررسی وضعیت${NC}"
pm2 status

echo ""
echo -e "${YELLOW}مرحله 5: نمایش لاگ‌های اخیر${NC}"
echo -e "${BLUE}Backend logs:${NC}"
pm2 logs taskmanager-backend --lines 5 --nostream

echo ""
echo -e "${GREEN}✅ Deployment کامل شد!${NC}"
echo ""
echo "🌐 سایت: https://tasksmanager.mardomi.org"
echo "📊 لاگ‌های کامل: pm2 logs"
echo "🔍 تست Backend: curl http://localhost:3000"
echo ""
