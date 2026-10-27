@echo off
REM ============================================
REM STEELMETRICS - Final Run Script
REM ============================================

cd /d "%~dp0"

echo.
echo ================================================
echo   STEELMETRICS - Final Run
echo ================================================
echo.

REM Check Node.js
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is not installed!
    echo.
    echo Please install from: https://nodejs.org
    echo Then restart your computer.
    echo.
    pause
    exit /b 1
)

echo [OK] Node.js found
echo.

REM Install if needed
if not exist "node_modules\" (
    echo [INFO] Installing dependencies (first time)...
    echo.
    call npm install
    if %errorlevel% neq 0 (
        echo [ERROR] Installation failed!
        pause
        exit /b 1
    )
    echo [OK] Installation complete
    echo.
)

REM Build if needed
if not exist "dist\index.html" (
    echo [INFO] Building application...
    echo.
    call npm run build
    if %errorlevel% neq 0 (
        echo [ERROR] Build failed!
        pause
        exit /b 1
    )
    echo [OK] Build complete
    echo.
)

echo ================================================
echo.
echo [OK] Starting application...
echo.
echo ------------------------------------------------
echo   URL: http://localhost:3001
echo ------------------------------------------------
echo.
echo   Login with any of these users:
echo   (password: type anything)
echo.
echo   - admin
echo   - eaf_operator
echo   - lf_operator
echo   - ccm_operator
echo   - shift_sup
echo   - prod_manager
echo.
echo ------------------------------------------------
echo.
echo Press Ctrl+C to stop
echo.

REM Open browser
timeout /t 3 /nobreak >nul
start http://localhost:3001

REM Start server using npx serve
npx serve dist -l 3001

echo.
echo Server stopped.
echo.
pause
