#!/bin/bash

echo "========================================"
echo "🌐 اجرای سامانه در Browser"
echo "========================================"
echo ""

# بررسی node
if ! command -v node &> /dev/null
then
    echo "❌ Node.js نصب نیست!"
    echo "لطفاً از https://nodejs.org دانلود کنید"
    exit 1
fi

echo "✅ Node.js یافت شد"
echo ""

# اجرای Backend
echo "📦 شروع Backend..."
cd backend
gnome-terminal -- bash -c "npm run start:dev; exec bash" 2>/dev/null || \
xterm -e "npm run start:dev" 2>/dev/null || \
osascript -e 'tell app "Terminal" to do script "cd \"'$(pwd)'\" && npm run start:dev"' 2>/dev/null &
cd ..
sleep 3

# اجرای Frontend
echo "🎨 شروع Frontend..."
cd frontend
gnome-terminal -- bash -c "npm run dev; exec bash" 2>/dev/null || \
xterm -e "npm run dev" 2>/dev/null || \
osascript -e 'tell app "Terminal" to do script "cd \"'$(pwd)'\" && npm run dev"' 2>/dev/null &
cd ..
sleep 5

# باز کردن Browser
echo "🌐 باز کردن Browser..."
sleep 3
if command -v xdg-open &> /dev/null; then
    xdg-open http://localhost:5173
elif command -v open &> /dev/null; then
    open http://localhost:5173
else
    echo "لطفاً http://localhost:5173 را در مرورگر باز کنید"
fi

echo ""
echo "========================================"
echo "✅ سامانه آماده است!"
echo "========================================"
echo ""
echo "📍 URL: http://localhost:5173"
echo "👤 Username: admin"
echo "🔑 Password: 1236987450"
echo ""
echo "برای توقف سرورها، Ctrl+C را در ترمینال‌ها بزنید"
echo "========================================"
