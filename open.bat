@echo off
REM ============================================
REM STEELMETRICS - Open Built Version Directly
REM No server needed - just opens the HTML file
REM ============================================

cd /d "%~dp0"

echo.
echo ================================================
echo   STEELMETRICS - Quick Open
echo ================================================
echo.

REM Check if dist folder exists
if not exist "dist\" (
    echo [INFO] Building production version first...
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

echo [OK] Opening application...
echo.
echo If browser doesn't open automatically,
echo manually open this file:
echo %cd%\dist\index.html
echo.

REM Open the HTML file
start "" "%cd%\dist\index.html"

echo.
echo ================================================
echo   Application opened in your browser!
echo ================================================
echo.
echo Demo Users (password: anything):
echo - admin          (Full Admin)
echo - eaf_operator   (EAF User)
echo - lf_operator    (LF User)
echo - ccm_operator   (CCM User)
echo - shift_sup      (Shift Supervisor)
echo - prod_manager   (Production Manager)
echo.
echo ================================================
echo.
pause
