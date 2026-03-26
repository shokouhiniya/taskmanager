# اسکریپت برای پاک کردن تمام کاربران به جز ادمین

Write-Host "🗑️ در حال پاک کردن تمام کاربران به جز ادمین..." -ForegroundColor Yellow

# دریافت توکن ادمین
$loginResponse = Invoke-RestMethod -Uri "http://localhost:3000/auth/login" -Method POST -Body (@{
    username = "admin"
    password = "1236987450"
} | ConvertTo-Json) -ContentType "application/json"

$token = $loginResponse.access_token

Write-Host "✅ ورود موفق" -ForegroundColor Green

# حذف تمام کاربران
$deleteResponse = Invoke-RestMethod -Uri "http://localhost:3000/users/cleanup/all" -Method DELETE -Headers @{
    Authorization = "Bearer $token"
}

Write-Host "✅ $($deleteResponse.message)" -ForegroundColor Green
Write-Host "📊 تعداد کاربران حذف شده: $($deleteResponse.deletedCount)" -ForegroundColor Cyan

# نمایش لیست کاربران باقی مانده
$users = Invoke-RestMethod -Uri "http://localhost:3000/users" -Method GET -Headers @{
    Authorization = "Bearer $token"
}

Write-Host "`n📋 کاربران باقی مانده:" -ForegroundColor Cyan
$users | ForEach-Object {
    Write-Host "  - $($_.name) (@$($_.username)) - نقش: $($_.role)" -ForegroundColor White
}

Write-Host "`n✅ عملیات با موفقیت انجام شد!" -ForegroundColor Green
