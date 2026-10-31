@echo off
REM ============================================
REM STEELMETRICS - Stop All Services
REM ============================================
REM This script stops Backend and Frontend
REM Database data is preserved
REM ============================================

cd /d "%~dp0"

echo.
echo ================================================
echo   STEELMETRICS - Stopping All Services
echo ================================================
echo.

REM Stop Backend
echo [INFO] Stopping Backend...
taskkill /FI "WINDOWTITLE eq SteelMetrics-Backend" /T /F >nul 2>&1
if %errorlevel%==0 (
    echo [OK] Backend stopped
) else (
    echo [INFO] Backend was not running
)

REM Stop Frontend
echo [INFO] Stopping Frontend...
taskkill /FI "WINDOWTITLE eq SteelMetrics-Frontend" /T /F >nul 2>&1
if %errorlevel%==0 (
    echo [OK] Frontend stopped
) else (
    echo [INFO] Frontend was not running
)

REM Stop any node processes on port 5000 and 3001
echo [INFO] Stopping any remaining processes on ports 5000 and 3001...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":5000" ^| findstr "LISTENING"') do (
    taskkill /F /PID %%a >nul 2>&1
)
for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":3001" ^| findstr "LISTENING"') do (
    taskkill /F /PID %%a >nul 2>&1
)

echo.
echo ================================================
echo   Services Stopped
echo ================================================
echo.
echo [OK] Backend and Frontend stopped
echo [INFO] Database data is preserved
echo.
echo To start services again, run: Start-SteelMetrics.bat
echo.
pause
