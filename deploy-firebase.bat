@echo off
echo ========================================================
echo  Deploy Web Biodata Zahlan ke Firebase Hosting
echo  Project: biodata-zahlan
echo ========================================================
echo.

echo [1/3] Memeriksa akun Firebase...
call firebase login:list
if errorlevel 1 (
    echo.
    echo Silakan login ke akun Firebase Anda terlebih dahulu:
    call firebase login
)

echo.
echo [2/3] Memulai proses deploy ke Firebase Hosting...
call firebase deploy --only hosting

echo.
if errorlevel 0 (
    echo ========================================================
    echo  BERHASIL! Website Anda telah aktif di:
    echo  https://biodata-zahlan.web.app
    echo  https://biodata-zahlan.firebaseapp.com
    echo ========================================================
) else (
    echo.
    echo Terjadi kendala saat deploy. Pastikan Anda sudah login
    echo dengan akun Google yang memiliki akses ke proyek 'biodata-zahlan'.
)

echo.
pause
