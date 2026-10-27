@echo off
chcp 65001 >nul
title STEELMETRICS - نصب اولیه
color 0E

echo.
echo  ╔══════════════════════════════════════════════════╗
echo  ║        STEELMETRICS - نصب اولیه                  ║
echo  ║   بررسی پیش‌نیازها و نصب وابستگی‌ها              ║
echo  ╚══════════════════════════════════════════════════╝
echo.

echo  [1/4] بررسی Node.js...
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo.
    echo  ╔══════════════════════════════════════════════════╗
    echo  ║  [!] Node.js نصب نیست                            ║
    echo  ║                                                    ║
    echo  ║  لطفاً مراحل زیر را انجام دهید:                   ║
    echo  ║                                                    ║
    echo  ║  1. به آدرس https://nodejs.org بروید              ║
    echo  ║  2. نسخه LTS (20.x) را دانلود کنید               ║
    echo  ║  3. فایل نصب را اجرا و مراحل را طی کنید          ║
    echo  ║  4. سیستم را ری‌استارت کنید                       ║
    echo  ║  5. مجدداً این فایل را اجرا کنید                  ║
    echo  ║                                                    ║
    echo  ╚══════════════════════════════════════════════════╝
    echo.
    start https://nodejs.org
    pause
    exit /b 1
)
echo  [✓] Node.js نصب است:
node --version
echo.

echo  [2/4] بررسی npm...
where npm >nul 2>nul
if %errorlevel% neq 0 (
    echo  [ERROR] npm یافت نشد!
    pause
    exit /b 1
)
echo  [✓] npm نصب است:
npm --version
echo.

echo  [3/4] بررسی Git (اختیاری)...
where git >nul 2>nul
if %errorlevel% neq 0 (
    echo  [!] Git نصب نیست (اختیاری - برای توسعه)
) else (
    echo  [✓] Git نصب است:
    git --version
)
echo.

echo  [4/4] نصب وابستگی‌های پروژه...
echo  (لطفاً صبر کنید...)
echo.
call npm install

if %errorlevel% neq 0 (
    echo.
    echo  [ERROR] خطا در نصب وابستگی‌ها!
    echo  لطفاً اتصال اینترنت خود را بررسی کنید.
    pause
    exit /b 1
)

echo.
echo  ══════════════════════════════════════════════════
echo.
echo  [✓] نصب با موفقیت انجام شد!
echo.
echo  حالا می‌توانید:
echo  - start.bat را اجرا کنید تا سامانه بالا بیاید
echo  - build.bat را اجرا کنید تا نسخه production بسازید
echo.
echo  ══════════════════════════════════════════════════
echo.

pause
