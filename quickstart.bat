@echo off
REM ============================================
REM STEELMETRICS - Quick Start (Build + Open)
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
    echo [ERROR] Node.js is not installed!
    echo.
    echo Please install Node.js from: https://nodejs.org
    echo.
    pause
    exit /b 1
)

echo [OK] Node.js found
echo.

REM Install dependencies if needed
if not exist "node_modules\" (
    echo [INFO] Installing dependencies...
    echo This may take a few minutes...
    echo.
    call npm install
    if %errorlevel% neq 0 (
        echo.
        echo [ERROR] Failed to install dependencies!
        echo.
        pause
        exit /b 1
    )
    echo.
    echo [OK] Dependencies installed.
    echo.
)

REM Build if dist doesn't exist
if not exist "dist\index.html" (
    echo [INFO] Building application...
    echo.
    call npm run build
    if %errorlevel% neq 0 (
        echo.
        echo [ERROR] Build failed!
        echo.
        pause
        exit /b 1
    )
    echo.
    echo [OK] Build completed.
    echo.
)

echo ================================================
echo.
echo [INFO] Starting preview server...
echo.
echo ------------------------------------------------
echo   URL: http://localhost:4173
echo ------------------------------------------------
echo.
echo   Demo Users (password: anything):
echo   - admin          (Full Admin)
echo   - eaf_operator   (EAF User)
echo   - lf_operator    (LF User)
echo   - ccm_operator   (CCM User)
echo   - shift_sup      (Shift Supervisor)
echo   - prod_manager   (Production Manager)
echo.
echo ------------------------------------------------
echo.
echo Press Ctrl+C to stop the server
echo.

REM Wait and open browser
timeout /t 3 /nobreak >nul
start http://localhost:4173

REM Start preview server
call npx vite preview --port 4173

echo.
echo ================================================
echo   Server stopped.
echo ================================================
echo.
pause
