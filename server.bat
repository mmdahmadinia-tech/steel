@echo off
REM ============================================
REM STEELMETRICS - Simple Server
REM Uses Python or Node.js to serve files
REM ============================================

cd /d "%~dp0"

echo.
echo ================================================
echo   STEELMETRICS - Simple Server
echo ================================================
echo.

REM Check if dist exists
if not exist "dist\index.html" (
    echo [INFO] Building application first...
    echo.
    call npm run build
    if %errorlevel% neq 0 (
        echo [ERROR] Build failed!
        pause
        exit /b 1
    )
    echo [OK] Build completed.
    echo.
)

echo [INFO] Starting simple server...
echo.

REM Try Python first
where python >nul 2>nul
if %errorlevel% equ 0 (
    echo [OK] Using Python server
    echo.
    echo ------------------------------------------------
    echo   URL: http://localhost:8000
    echo ------------------------------------------------
    echo.
    echo Demo Users (password: anything):
    echo - admin, eaf_operator, lf_operator, ccm_operator
    echo - shift_sup, prod_manager
    echo.
    echo Press Ctrl+C to stop
    echo.
    timeout /t 2 /nobreak >nul
    start http://localhost:8000
    cd dist
    python -m http.server 8000
    goto :end
)

REM Try Node.js npx serve
where npx >nul 2>nul
if %errorlevel% equ 0 (
    echo [OK] Using Node.js server
    echo.
    echo ------------------------------------------------
    echo   URL: http://localhost:5000
    echo ------------------------------------------------
    echo.
    echo Demo Users (password: anything):
    echo - admin, eaf_operator, lf_operator, ccm_operator
    echo - shift_sup, prod_manager
    echo.
    echo Press Ctrl+C to stop
    echo.
    timeout /t 2 /nobreak >nul
    start http://localhost:5000
    npx serve dist -l 5000
    goto :end
)

REM If no server available, just open the file
echo [WARNING] No local server found.
echo [INFO] Opening file directly...
echo.
echo NOTE: Some features may not work without a server.
echo.
start "" "%cd%\dist\index.html"

:end
echo.
echo ================================================
echo   Server stopped.
echo ================================================
echo.
pause
