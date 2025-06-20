# start-dev.ps1

# B1. Chạy ngrok (ẩn output)
Start-Process ngrok -ArgumentList "http 8080" -WindowStyle Hidden

# B2. Đợi ngrok khởi động
Start-Sleep -Seconds 3

# B3. Lấy URL từ ngrok
$ngrokApi = "http://127.0.0.1:4040/api/tunnels"
$response = Invoke-RestMethod $ngrokApi
$publicUrl = $response.tunnels[0].public_url

# B4. Ghi đè file .env
$envFile = ".env"
(Get-Content $envFile) -replace "VITE_API_BASE_URL=.*", "VITE_API_BASE_URL=$publicUrl" | Set-Content $envFile

Write-Host "✅ Cập nhật xong .env: $publicUrl"

# B5. (Tuỳ chọn) Chạy frontend (React)
Start-Process "npm" -ArgumentList "run dev"
