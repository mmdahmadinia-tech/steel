@echo off
REM ============================================
REM STEELMETRICS - Start All Services
REM ============================================
REM This script starts PostgreSQL, Backend, and Frontend
REM ============================================

cd /d "%~dp0"

echo.
echo ================================================
echo   STEELMETRICS - Starting All Services
echo ================================================
echo.

REM Check if already running
tasklist /FI "WINDOWTITLE eq SteelMetrics-Backend" 2>NUL | find /I /N "cmd.exe">NUL
if %ERRORLEVEL%==0 (
    echo [WARNING] Backend appears to be already running
    echo [INFO] Use Stop-SteelMetrics.bat to stop all services first
    pause
    exit /b 1
)

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

echo [OK] Node.js found:
node --version
echo.

REM Check PostgreSQL
where psql >nul 2>nul
if %errorlevel% neq 0 (
    echo [WARNING] PostgreSQL command line tools not found in PATH
    echo [INFO] Please ensure PostgreSQL is installed and running
    echo.
) else (
    echo [OK] PostgreSQL tools found
    echo.
)

REM Check if server dependencies are installed
if not exist "server\node_modules\" (
    echo [INFO] Installing Backend dependencies...
    cd server
    call npm install
    if %errorlevel% neq 0 (
        echo [ERROR] Backend dependencies installation failed!
        cd ..
        pause
        exit /b 1
    )
    cd ..
    echo [OK] Backend dependencies installed
    echo.
)

REM Check if frontend dependencies are installed
if not exist "node_modules\" (
    echo [INFO] Installing Frontend dependencies...
    call npm install
    if %errorlevel% neq 0 (
        echo [ERROR] Frontend dependencies installation failed!
        pause
        exit /b 1
    )
    echo [OK] Frontend dependencies installed
    echo.
)

REM Check if database exists and run migrations
echo [INFO] Checking database...
cd server

REM Check if .env exists
if not exist ".env" (
    echo [WARNING] server/.env not found!
    echo [INFO] Creating from .env.example...
    if exist ".env.example" (
        copy .env.example .env >nul
        echo [OK] .env created from .env.example
        echo.
        echo [WARNING] Please edit server/.env with your database credentials
        echo.
    ) else (
        echo [ERROR] .env.example not found!
        cd ..
        pause
        exit /b 1
    )
)

REM Run migrations
echo [INFO] Running database migrations...
call npm run migrate
if %errorlevel% neq 0 (
    echo [ERROR] Database migration failed!
    echo [INFO] Please ensure PostgreSQL is running and credentials are correct
    cd ..
    pause
    exit /b 1
)

call npm run migrate:setup
call npm run migrate:password

REM Seed database
echo [INFO] Seeding database...
call npm run seed
if %errorlevel% neq 0 (
    echo [ERROR] Database seed failed!
    cd ..
    pause
    exit /b 1
)

cd ..

echo.
echo ================================================
echo   Starting Backend Server...
echo ================================================
echo.

REM Start Backend in new window
start "SteelMetrics-Backend" cmd /k "cd server && npm run dev"

REM Wait for backend to start
echo [INFO] Waiting for Backend to start...
timeout /t 5 /nobreak >nul

echo.
echo ================================================
echo   Starting Frontend Server...
echo ================================================
echo.

REM Start Frontend in new window
start "SteelMetrics-Frontend" cmd /k "npm run dev"

REM Wait for frontend to start
echo [INFO] Waiting for Frontend to start...
timeout /t 3 /nobreak >nul

echo.
echo ================================================
echo   Opening Browser...
echo ================================================
echo.

REM Open browser
start http://localhost:3001

echo.
echo ================================================
echo   STEELMETRICS is Running!
echo ================================================
echo.
echo Backend:  http://localhost:5000
echo Frontend: http://localhost:3001
echo.
echo Login Credentials:
echo   Username: admin
echo   Password: 123456
echo.
echo   [!] Password change required on first login
echo.
echo To stop all services, run: Stop-SteelMetrics.bat
echo.
echo Press any key to close this window...
pause >nul
