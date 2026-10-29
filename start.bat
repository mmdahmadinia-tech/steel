@echo off
REM ============================================
REM STEELMETRICS - Start Application
REM ============================================

cd /d "%~dp0"

echo.
echo ================================================
echo   STEELMETRICS - Starting...
echo ================================================
echo.

REM Check Node.js
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Node.js not found!
    echo Install from: https://nodejs.org
    pause
    exit /b 1
)

echo [OK] Node.js: 
node --version
echo.

REM Install dependencies
echo [INFO] Installing dependencies...
call npm install
if %errorlevel% neq 0 (
    echo.
    echo [ERROR] Installation failed!
    echo Please check your internet connection.
    pause
    exit /b 1
)
echo [OK] Dependencies installed
echo.

REM Build
echo [INFO] Building application...
call npx vite build
if %errorlevel% neq 0 (
    echo.
    echo [ERROR] Build failed!
    pause
    exit /b 1
)
echo [OK] Build completed
echo.

echo [OK] Starting server on port 3001...
echo.
echo ================================================
echo   Open: http://localhost:3001
echo.
echo   Users (password: same as username):
echo   - 19029 (Admin)
echo   - 19377 (EAF)
echo   - 19513 (LF)
echo   - 19616 (CCM)
echo   - 19452 (Analyst)
echo.
echo   Press Ctrl+C to stop
echo ================================================
echo.

timeout /t 2 /nobreak >nul
start http://localhost:3001

call npx serve dist -l 3001

pause
