@echo off
REM ============================================
REM STEELMETRICS - Build Production
REM ============================================

REM Go to the directory where this bat file is located
cd /d "%~dp0"

echo.
echo  ================================================
echo     STEELMETRICS - Build Production
echo     Building optimized files for deployment
echo  ================================================
echo.

REM Check Node.js
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo  [ERROR] Node.js is not installed!
    pause
    exit /b 1
)

echo  [INFO] Starting production build...
echo.

REM Install dependencies if needed
if not exist "node_modules\" (
    echo  [INFO] Installing dependencies...
    call npm install
)

REM Build
echo  [INFO] Building...
echo.
call npm run build

if %errorlevel% neq 0 (
    echo.
    echo  [ERROR] Build failed!
    pause
    exit /b 1
)

echo.
echo  ================================================
echo.
echo  [OK] Build completed successfully!
echo.
echo  Output files are in the "dist" folder.
echo.
echo  To deploy:
echo  1. Copy contents of dist/ to your web server
echo  2. Configure web server for HTTPS
echo  3. Set up Backend API
echo  4. Create PostgreSQL database
echo.
echo  ================================================
echo.

pause
