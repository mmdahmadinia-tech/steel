@echo off
REM ============================================
REM STEELMETRICS - Open Application
REM ============================================

cd /d "%~dp0"

echo.
echo ================================================
echo   STEELMETRICS - Open Application
echo ================================================
echo.

REM Check if dist folder exists
if not exist "dist\" (
    echo [INFO] dist folder not found.
    echo [INFO] Building application first...
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
    echo [OK] Build completed successfully.
    echo.
)

REM Check if index.html exists
if not exist "dist\index.html" (
    echo [ERROR] dist\index.html not found!
    echo.
    echo Please run build.bat first.
    echo.
    pause
    exit /b 1
)

echo [OK] Opening application...
echo.
echo File: %cd%\dist\index.html
echo.

REM Open the HTML file directly
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
