@echo off
echo 🚀 راه‌اندازی Telegram Mini App
echo ================================
echo.

REM بررسی ngrok
where ngrok >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ ngrok نصب نیست!
    echo لطفاً از https://ngrok.com/download دانلود کنید
    pause
    exit /b 1
)

echo ✅ ngrok یافت شد
echo.

echo 📦 راه‌اندازی Backend...
start "Backend" cmd /k "cd backend && npm run start:dev"

timeout /t 5 /nobreak >nul

echo 🎨 راه‌اندازی Frontend...
start "Frontend" cmd /k "cd frontend && npm run dev"

timeout /t 5 /nobreak >nul

echo 🌐 راه‌اندازی ngrok...
start "ngrok" cmd /k "ngrok http 5173"

echo.
echo ✅ همه سرویس‌ها راه‌اندازی شدند!
echo.
echo 📝 مراحل بعدی:
echo 1. ngrok URL را از پنجره ngrok کپی کنید
echo 2. به @BotFather بروید و URL را تنظیم کنید
echo 3. backend/.env را با URL جدید آپدیت کنید
echo 4. Backend را restart کنید
echo 5. دستور /start را در ربات بزنید
echo.
pause
