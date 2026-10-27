@echo off
REM ============================================
REM STEELMETRICS - Start Development Server
REM ============================================

REM Change to the directory where this bat file is located
cd /d "%~dp0"

echo.
echo ================================================
echo   STEELMETRICS v1.0 - Development Server
echo ================================================
echo.
echo Current directory: %cd%
echo.

REM Check if package.json exists
if not exist "package.json" (
    echo [ERROR] package.json not found!
    echo.
    echo Please make sure this file is in the project folder.
    echo.
    pause
    exit /b 1
)

echo [OK] package.json found
echo.

REM Check Node.js
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is not installed or not in PATH!
    echo.
    echo Please install Node.js from: https://nodejs.org
    echo Then restart your computer and try again.
    echo.
    pause
    exit /b 1
)

echo [OK] Node.js found:
node --version
echo.

REM Check npm
where npm >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] npm is not found!
    echo.
    pause
    exit /b 1
)

echo [OK] npm found:
npm --version
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
    echo [OK] Dependencies installed successfully.
    echo.
) else (
    echo [OK] Dependencies already installed.
    echo.
)

echo ================================================
echo.
echo [INFO] Starting development server...
echo.
echo ------------------------------------------------
echo   URL: http://localhost:3000
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

REM Wait a moment before opening browser
timeout /t 3 /nobreak >nul

REM Open browser
start http://localhost:3000

REM Start dev server
npm run dev

REM If server stops, pause before closing
echo.
echo ================================================
echo   Server stopped.
echo ================================================
echo.
pause
