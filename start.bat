@echo off
chcp 65001 >nul
title STEELMETRICS - سامانه مدیریت تولید فولاد
color 0B

echo.
echo  ╔══════════════════════════════════════════════════╗
echo  ║                                                  ║
echo  ║     ███████╗██████████████╗ ██████╗██╗  ██╗     ║
echo  ║     ██╔════╝██╔═════██╔══╝██╔════╝██║  ██║     ║
echo  ║     ███████╗█████╗  ██║   ██║     ███████║     ║
echo  ║     ╚════██║██╔══╝  ██║   ██║     ██╔══██║     ║
echo  ║     ███████║███████╗██║   ╚██████╗██║  ██║     ║
echo  ║     ╚══════╝╚══════╝╚═╝    ╚═════╝╚═╝  ╚═╝     ║
echo  ║                                                  ║
echo  ║        STEELMETRICS v1.0                         ║
echo  ║   سامانه مدیریت و تحلیل تولید فولاد             ║
echo  ║        steelmetrics.ir                           ║
echo  ║                                                  ║
echo  ╚══════════════════════════════════════════════════╝
echo.

REM Check Node.js
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo  [ERROR] Node.js نصب نیست!
    echo  لطفاً از https://nodejs.org نسخه LTS را دانلود و نصب کنید.
    echo.
    pause
    exit /b 1
)

echo  [✓] Node.js یافت شد:
node --version
echo.

REM Check npm
where npm >nul 2>nul
if %errorlevel% neq 0 (
    echo  [ERROR] npm نصب نیست!
    pause
    exit /b 1
)

echo  [✓] npm یافت شد:
npm --version
echo.

REM Install dependencies if needed
if not exist "node_modules\" (
    echo  [INFO] در حال نصب وابستگی‌ها...
    echo  (این مرحله ممکن است چند دقیقه طول بکشد)
    echo.
    call npm install
    if %errorlevel% neq 0 (
        echo.
        echo  [ERROR] خطا در نصب وابستگی‌ها!
        pause
        exit /b 1
    )
    echo.
    echo  [✓] وابستگی‌ها با موفقیت نصب شدند.
    echo.
) else (
    echo  [✓] وابستگی‌ها از قبل نصب هستند.
    echo.
)

echo  ══════════════════════════════════════════════════
echo.
echo  [INFO] سرور توسعه در حال راه‌اندازی...
echo.
echo  ┌──────────────────────────────────────────────────┐
echo  │  آدرس دسترسی:  http://localhost:3000             │
echo  │                                                    │
echo  │  کاربران آزمایشی:                                  │
echo  │  ─────────────────────────────────                │
echo  │  admin          → مدیر سامانه (دسترسی کامل)       │
echo  │  eaf_operator   → کاربر کوره قوس الکتریکی         │
echo  │  lf_operator    → کاربر کوره پاتیلی               │
echo  │  ccm_operator   → کاربر ریخته‌گری مداوم            │
echo  │  shift_sup      → سرپرست شیفت                     │
echo  │  prod_manager   → مدیر تولید                      │
echo  │                                                    │
echo  │  رمز عبور: هر مقداری وارد کنید (demo mode)        │
echo  │                                                    │
echo  │  برای توقف: Ctrl+C                                │
echo  └──────────────────────────────────────────────────┘
echo.

REM Open browser after delay
start /b cmd /c "timeout /t 3 /nobreak >nul && start http://localhost:3000"

REM Start dev server
call npm run dev

pause
