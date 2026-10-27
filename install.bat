@echo off
REM ============================================
REM STEELMETRICS - Initial Setup
REM ============================================

REM Go to the directory where this bat file is located
cd /d "%~dp0"

echo.
echo  ================================================
echo     STEELMETRICS - Initial Setup
echo     Checking prerequisites and installing
echo  ================================================
echo.

echo  [1/4] Checking Node.js...
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo.
    echo  ================================================
    echo   [!] Node.js is NOT installed
    echo  ================================================
    echo.
    echo   Please follow these steps:
    echo.
    echo   1. Go to: https://nodejs.org
    echo   2. Download LTS version (20.x)
    echo   3. Run the installer
    echo   4. Restart your computer
    echo   5. Run this file again
    echo.
    echo  ================================================
    echo.
    start https://nodejs.org
    pause
    exit /b 1
)
echo  [OK] Node.js installed:
node --version
echo.

echo  [2/4] Checking npm...
where npm >nul 2>nul
if %errorlevel% neq 0 (
    echo  [ERROR] npm not found!
    pause
    exit /b 1
)
echo  [OK] npm installed:
npm --version
echo.

echo  [3/4] Checking Git (optional)...
where git >nul 2>nul
if %errorlevel% neq 0 (
    echo  [!] Git not installed (optional - for development)
) else (
    echo  [OK] Git installed:
    git --version
)
echo.

echo  [4/4] Installing project dependencies...
echo  (Please wait...)
echo.
call npm install

if %errorlevel% neq 0 (
    echo.
    echo  [ERROR] Failed to install dependencies!
    echo  Please check your internet connection.
    pause
    exit /b 1
)

echo.
echo  ================================================
echo.
echo  [OK] Setup completed successfully!
echo.
echo  Now you can:
echo  - Run start.bat to start the development server
echo  - Run build.bat to create production build
echo.
echo  ================================================
echo.

pause
