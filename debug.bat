@echo off
REM ============================================
REM STEELMETRICS - Debug/Diagnostic Tool
REM Run this if other bat files don't work
REM ============================================

cd /d "%~dp0"

echo.
echo ================================================
echo   STEELMETRICS - Debug Tool
echo ================================================
echo.
echo Current directory: %cd%
echo.
echo ================================================
echo   System Information
echo ================================================
echo.

REM Check Windows version
echo Windows Version:
ver
echo.

REM Check Node.js
echo ================================================
echo   Checking Node.js
echo ================================================
echo.

where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Node.js NOT found in PATH
    echo.
    echo Please install Node.js from: https://nodejs.org
    echo After installation, restart your computer.
    echo.
) else (
    echo [OK] Node.js location:
    where node
    echo.
    echo [OK] Node.js version:
    node --version
    echo.
)

REM Check npm
echo ================================================
echo   Checking npm
echo ================================================
echo.

where npm >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] npm NOT found in PATH
    echo.
) else (
    echo [OK] npm location:
    where npm
    echo.
    echo [OK] npm version:
    npm --version
    echo.
)

REM Check project files
echo ================================================
echo   Checking Project Files
echo ================================================
echo.

if exist "package.json" (
    echo [OK] package.json exists
) else (
    echo [ERROR] package.json NOT found!
)

if exist "node_modules\" (
    echo [OK] node_modules folder exists
) else (
    echo [INFO] node_modules folder NOT found
    echo        (will be created when you run install.bat)
)

if exist "dist\" (
    echo [OK] dist folder exists
) else (
    echo [INFO] dist folder NOT found
    echo        (will be created when you run build.bat)
)

if exist "src\App.tsx" (
    echo [OK] Source files exist
) else (
    echo [ERROR] Source files NOT found!
)

echo.
echo ================================================
echo   Testing npm commands
echo ================================================
echo.

echo Testing: npm --version
call npm --version
echo.

echo Testing: node --version
call node --version
echo.

echo ================================================
echo   Next Steps
echo ================================================
echo.
echo If everything looks OK above:
echo.
echo 1. Run install.bat (first time only)
echo 2. Run start.bat (development server)
echo    OR
echo    Run open.bat (opens built version directly)
echo.
echo If you see errors above:
echo - Make sure Node.js is installed
echo - Restart your computer after installing Node.js
echo - Try running as Administrator
echo.
echo ================================================
echo.
pause
