@echo off
REM ============================================
REM STEELMETRICS - Simple Start
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

REM Install if needed
if not exist "node_modules\" (
    echo [INFO] Installing (first time)...
    call npm install
    echo.
)

REM Build if needed
if not exist "dist\" (
    echo [INFO] Building...
    call npm run build
    echo.
)

echo [OK] Starting server on port 3001...
echo.
echo ================================================
echo   Open: http://localhost:3001
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
