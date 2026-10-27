@echo off
REM ============================================
REM STEELMETRICS - Quick Test
REM Opens the built version directly
REM ============================================

cd /d "%~dp0"

echo.
echo  ================================================
echo     STEELMETRICS - Quick Test
echo  ================================================
echo.

REM Check if dist folder exists
if not exist "dist\" (
    echo  [INFO] Production build not found.
    echo  [INFO] Running build first...
    echo.
    call npm run build
    if %errorlevel% neq 0 (
        echo  [ERROR] Build failed!
        pause
        exit /b 1
    )
)

echo  [OK] Opening production build...
echo.
echo  If browser doesn't open, manually open:
echo  %~dp0dist\index.html
echo.

REM Try to open with a simple server
where npx >nul 2>nul
if %errorlevel% equ 0 (
    echo  [INFO] Starting preview server...
    echo  URL: http://localhost:4173
    echo.
    start /b cmd /c "timeout /t 2 /nobreak >nul && start http://localhost:4173"
    call npx vite preview --port 4173
) else (
    echo  [INFO] Opening index.html directly...
    start "" "%~dp0dist\index.html"
)

pause
