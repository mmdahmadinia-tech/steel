@echo off
chcp 65001 >nul
title STEELMETRICS - Build Production
color 0A

echo.
echo  ╔══════════════════════════════════════════════════╗
echo  ║        STEELMETRICS - Build Production           ║
echo  ║   ساخت نسخه نهایی برای استقرار                  ║
echo  ╚══════════════════════════════════════════════════╝
echo.

REM Check Node.js
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo  [ERROR] Node.js نصب نیست!
    pause
    exit /b 1
)

echo  [INFO] شروع ساخت نسخه production...
echo.

REM Install dependencies if needed
if not exist "node_modules\" (
    echo  [INFO] نصب وابستگی‌ها...
    call npm install
)

REM Build
echo  [INFO] در حال build...
echo.
call npm run build

if %errorlevel% neq 0 (
    echo.
    echo  [ERROR] خطا در build!
    pause
    exit /b 1
)

echo.
echo  ══════════════════════════════════════════════════
echo.
echo  [✓] Build با موفقیت انجام شد!
echo.
echo  فایل‌های خروجی در پوشه dist/ قرار دارند.
echo.
echo  برای استقرار:
echo  1. محتویات پوشه dist/ را روی سرور وب کپی کنید
echo  2. سرور وب را روی HTTPS تنظیم کنید
echo  3. Backend API را راه‌اندازی کنید
echo  4. پایگاه داده PostgreSQL را ایجاد کنید
echo.
echo  ══════════════════════════════════════════════════
echo.

pause
