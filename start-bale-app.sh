#!/bin/bash

echo "========================================"
echo "  Bale Mini App - Starting Services"
echo "========================================"
echo ""

echo "[1/3] Starting Backend..."
cd backend
npm run start:dev &
BACKEND_PID=$!
cd ..
sleep 3

echo "[2/3] Starting Frontend..."
cd frontend
npm run dev &
FRONTEND_PID=$!
cd ..
sleep 3

echo "[3/3] Starting ngrok..."
ngrok http 5173 &
NGROK_PID=$!

echo ""
echo "========================================"
echo "  All services started!"
echo "========================================"
echo ""
echo "Backend:  http://localhost:3000"
echo "Frontend: http://localhost:5173"
echo "ngrok:    Check http://localhost:4040"
echo ""
echo "Copy the ngrok URL and set it in your Bale bot"
echo "Command: /setminiapp"
echo ""
echo "Press Ctrl+C to stop all services"
echo ""

# Wait for Ctrl+C
trap "kill $BACKEND_PID $FRONTEND_PID $NGROK_PID; exit" INT
wait
