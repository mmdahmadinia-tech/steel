@echo off
REM ============================================
REM STEELMETRICS - Test Database Connection
REM ============================================

cd /d "%~dp0"

echo.
echo ================================================
echo   STEELMETRICS - Database Connection Test
echo ================================================
echo.

REM Check if server/.env exists
if not exist "server\.env" (
    echo [ERROR] server/.env not found!
    echo.
    echo Please create server/.env from server/.env.example
    echo.
    pause
    exit /b 1
)

echo [INFO] Testing database connection...
echo.

cd server

REM Run test connection script
call npm run test-db 2>nul

if %errorlevel% neq 0 (
    echo.
    echo [ERROR] Database connection failed!
    echo.
    echo Possible causes:
    echo 1. PostgreSQL is not running
    echo 2. Database 'steelmetrics' does not exist
    echo 3. Credentials in server/.env are incorrect
    echo.
    echo Solutions:
    echo 1. Start PostgreSQL service
    echo 2. Create database: psql -U postgres -c "CREATE DATABASE steelmetrics;"
    echo 3. Check server/.env credentials
    echo.
    echo See POSTGRESQL_SETUP_GUIDE.md for detailed instructions
    echo.
    cd ..
    pause
    exit /b 1
)

cd ..

echo.
echo ================================================
echo   [OK] Database connection successful!
echo ================================================
echo.
pause
