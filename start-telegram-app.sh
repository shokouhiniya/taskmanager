#!/bin/bash

echo "🚀 راه‌اندازی Telegram Mini App"
echo "================================"
echo ""

# بررسی ngrok
if ! command -v ngrok &> /dev/null
then
    echo "❌ ngrok نصب نیست!"
    echo "لطفاً از https://ngrok.com/download دانلود کنید"
    exit 1
fi

echo "✅ ngrok یافت شد"
echo ""

# راه‌اندازی Backend
echo "📦 راه‌اندازی Backend..."
cd backend
npm run start:dev &
BACKEND_PID=$!
cd ..

sleep 5

# راه‌اندازی Frontend
echo "🎨 راه‌اندازی Frontend..."
cd frontend
npm run dev &
FRONTEND_PID=$!
cd ..

sleep 5

# راه‌اندازی ngrok
echo "🌐 راه‌اندازی ngrok..."
ngrok http 5173 &
NGROK_PID=$!

echo ""
echo "✅ همه سرویس‌ها راه‌اندازی شدند!"
echo ""
echo "📝 مراحل بعدی:"
echo "1. ngrok URL را از ترمینال ngrok کپی کنید"
echo "2. به @BotFather بروید و URL را تنظیم کنید"
echo "3. backend/.env را با URL جدید آپدیت کنید"
echo "4. Backend را restart کنید"
echo "5. دستور /start را در ربات بزنید"
echo ""
echo "برای توقف: Ctrl+C"

# منتظر ماندن
wait
