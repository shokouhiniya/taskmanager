@echo off
chcp 65001 >nul
echo ========================================
echo 🌐 اجرای سامانه در Browser
echo ========================================
echo.

REM بررسی node
where node >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Node.js نصب نیست!
    echo لطفاً از https://nodejs.org دانلود کنید
    pause
    exit /b 1
)

echo ✅ Node.js یافت شد
echo.

REM اجرای Backend
echo 📦 شروع Backend...
start "Backend Server" cmd /k "cd backend && npm run start:dev"
timeout /t 3 >nul

REM اجرای Frontend
echo 🎨 شروع Frontend...
start "Frontend Server" cmd /k "cd frontend && npm run dev"
timeout /t 5 >nul

REM باز کردن Browser
echo 🌐 باز کردن Browser...
timeout /t 3 >nul
start http://localhost:5173

echo.
echo ========================================
echo ✅ سامانه آماده است!
echo ========================================
echo.
echo 📍 URL: http://localhost:5173
echo 👤 Username: admin
echo 🔑 Password: 1236987450
echo.
echo برای توقف سرورها، پنجره‌های cmd را ببندید
echo ========================================
pause
