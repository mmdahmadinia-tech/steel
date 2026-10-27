@echo off
REM ============================================
REM STEELMETRICS - Quick Start (Guaranteed)
REM ============================================

cd /d "%~dp0"

echo.
echo ================================================
echo   STEELMETRICS - Quick Start
echo ================================================
echo.

REM Check Node.js
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Node.js not installed!
    echo.
    echo Please install from: https://nodejs.org
    echo Then restart your computer.
    echo.
    pause
    exit /b 1
)

echo [OK] Node.js found
echo.

REM Install dependencies
if not exist "node_modules\" (
    echo [INFO] Installing dependencies...
    call npm install
    if %errorlevel% neq 0 (
        echo [ERROR] Install failed!
        pause
        exit /b 1
    )
    echo [OK] Done
    echo.
)

REM Build
if not exist "dist\index.html" (
    echo [INFO] Building application...
    call npm run build
    if %errorlevel% neq 0 (
        echo [ERROR] Build failed!
        pause
        exit /b 1
    )
    echo [OK] Done
    echo.
)

echo [OK] Starting server...
echo.
echo ================================================
echo   URL: http://localhost:3001
echo.
echo   Users (password: anything):
echo   - admin
echo   - eaf_operator
echo   - lf_operator
echo   - ccm_operator
echo   - shift_sup
echo   - prod_manager
echo.
echo   Press Ctrl+C to stop
echo ================================================
echo.

timeout /t 2 /nobreak >nul
start http://localhost:3001

npx serve dist -l 3001

pause
