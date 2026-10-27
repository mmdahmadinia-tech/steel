@echo off
REM ============================================
REM STEELMETRICS - Development Server
REM ============================================

REM Go to the directory where this bat file is located
cd /d "%~dp0"

echo.
echo  ================================================
echo     STEELMETRICS v1.0 - Development Server
echo     Steel Production Management System
echo     steelmetrics.ir
echo  ================================================
echo.

REM Check Node.js
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo  [ERROR] Node.js is not installed!
    echo  Please download from: https://nodejs.org
    echo.
    pause
    exit /b 1
)

echo  [OK] Node.js found:
node --version
echo.

REM Check npm
where npm >nul 2>nul
if %errorlevel% neq 0 (
    echo  [ERROR] npm is not installed!
    pause
    exit /b 1
)

echo  [OK] npm found:
npm --version
echo.

REM Install dependencies if needed
if not exist "node_modules\" (
    echo  [INFO] Installing dependencies...
    echo  (This may take a few minutes)
    echo.
    call npm install
    if %errorlevel% neq 0 (
        echo.
        echo  [ERROR] Failed to install dependencies!
        pause
        exit /b 1
    )
    echo.
    echo  [OK] Dependencies installed successfully.
    echo.
) else (
    echo  [OK] Dependencies already installed.
    echo.
)

echo  ================================================
echo.
echo  [INFO] Starting development server...
echo.
echo  ------------------------------------------------
echo   URL: http://localhost:3000
echo  ------------------------------------------------
echo.
echo   Demo Users:
echo   ---------------------------
echo   admin          - Full Admin Access
echo   eaf_operator   - EAF User
echo   lf_operator    - LF User
echo   ccm_operator   - CCM User
echo   shift_sup      - Shift Supervisor
echo   prod_manager   - Production Manager
echo.
echo   Password: Enter anything (demo mode)
echo  ------------------------------------------------
echo.
echo   Press Ctrl+C to stop the server
echo.

REM Open browser after delay
start /b cmd /c "timeout /t 4 /nobreak >nul && start http://localhost:3000"

REM Start dev server
call npm run dev

pause
