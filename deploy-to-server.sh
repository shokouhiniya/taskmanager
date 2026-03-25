#!/bin/bash

echo "🚀 Deployment Script for tasksmanager.mardomi.org"
echo "=================================================="
echo ""

# رنگ‌ها برای خروجی
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
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
npm install

# Build
npm run build

# Restart PM2
pm2 restart taskmanager-backend

echo ""
echo -e "${YELLOW}مرحله 3: بروزرسانی Frontend${NC}"
cd $PROJECT_PATH/frontend

# نصب dependencies
npm install

# Build با environment variable
npm run build

# Restart PM2
pm2 restart taskmanager-frontend

echo ""
echo -e "${YELLOW}مرحله 4: بررسی وضعیت${NC}"
pm2 status

echo ""
echo -e "${GREEN}✅ Deployment کامل شد!${NC}"
echo ""
echo "🌐 سایت: https://tasksmanager.mardomi.org"
echo "📊 لاگ‌ها: pm2 logs"
echo ""
