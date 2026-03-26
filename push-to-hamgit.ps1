# اسکریپت برای push کردن به HamGit

Write-Host "🔄 Pushing to HamGit..." -ForegroundColor Cyan

# امتحان با SSH
Write-Host "`n1️⃣ Trying SSH..." -ForegroundColor Yellow
git remote set-url hamgit git@hamgit.ir:task-manager/taskmanager.git
$result = git push hamgit main 2>&1
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Successfully pushed to HamGit via SSH!" -ForegroundColor Green
    exit 0
}

Write-Host "❌ SSH failed: $result" -ForegroundColor Red

# امتحان با HTTPS
Write-Host "`n2️⃣ Trying HTTPS..." -ForegroundColor Yellow
git remote set-url hamgit https://hamgit.ir/task-manager/taskmanager.git
$result = git push hamgit main 2>&1
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Successfully pushed to HamGit via HTTPS!" -ForegroundColor Green
    exit 0
}

Write-Host "❌ HTTPS failed: $result" -ForegroundColor Red

Write-Host "`n⚠️ Could not push to HamGit!" -ForegroundColor Red
Write-Host "Possible solutions:" -ForegroundColor Yellow
Write-Host "  1. Enable VPN and run this script again" -ForegroundColor White
Write-Host "  2. Check if hamgit.ir is accessible in your browser" -ForegroundColor White
Write-Host "  3. Push manually from HamGit web interface" -ForegroundColor White
