# اسکریپت برای نمایش لاگ‌های زنده backend

Write-Host "📊 Watching backend logs..." -ForegroundColor Cyan
Write-Host "Press Ctrl+C to stop" -ForegroundColor Yellow
Write-Host ""

# نمایش لاگ‌های جدید
Get-Content "backend\dist\*.log" -Wait -Tail 50 -ErrorAction SilentlyContinue
