@echo off
echo ========================================
echo   Bale Mini App - Starting Services
echo ========================================
echo.

echo [1/3] Starting Backend...
start "Backend" cmd /k "cd backend && npm run start:dev"
timeout /t 3 /nobreak > nul

echo [2/3] Starting Frontend...
start "Frontend" cmd /k "cd frontend && npm run dev"
timeout /t 3 /nobreak > nul

echo [3/3] Starting ngrok...
start "ngrok" cmd /k "ngrok http 5173"

echo.
echo ========================================
echo   All services started!
echo ========================================
echo.
echo Backend:  http://localhost:3000
echo Frontend: http://localhost:5173
echo ngrok:    Check the ngrok terminal
echo.
echo Copy the ngrok URL and set it in your Bale bot
echo Command: /setminiapp
echo.
pause
