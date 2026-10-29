@echo off
REM ============================================
REM STEELMETRICS - Publish to GitHub
REM ============================================

cd /d "%~dp0"

echo.
echo ================================================
echo   STEELMETRICS - Publish to GitHub
echo ================================================
echo.

REM Check Git
where git >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Git is not installed!
    echo.
    echo Please install Git from: https://git-scm.com/download/win
    echo.
    pause
    exit /b 1
)

echo [OK] Git found
git --version
echo.

REM Check if already initialized
if exist ".git" (
    echo [INFO] Git already initialized
    echo.
) else (
    echo [INFO] Initializing Git...
    git init
    if %errorlevel% neq 0 (
        echo [ERROR] Git init failed!
        pause
        exit /b 1
    )
    echo [OK] Git initialized
    echo.
)

REM Add all files
echo [INFO] Adding files...
git add .
echo [OK] Files added
echo.

REM Commit
echo [INFO] Creating commit...
git commit -m "STEELMETRICS v1.0 - Steel Production Management System"
if %errorlevel% neq 0 (
    echo [WARNING] Commit failed or nothing to commit
    echo.
) else (
    echo [OK] Commit created
    echo.
)

REM Ask for GitHub URL
echo ================================================
echo   GitHub Repository Setup
echo ================================================
echo.
echo Please enter your GitHub repository URL:
echo Example: https://github.com/username/steelmetrics.git
echo.
set /p GITHUB_URL="GitHub URL: "

if "%GITHUB_URL%"=="" (
    echo [ERROR] No URL provided!
    pause
    exit /b 1
)

REM Add remote
echo.
echo [INFO] Adding remote...
git remote remove origin 2>nul
git remote add origin %GITHUB_URL%
echo [OK] Remote added
echo.

REM Change branch to main
echo [INFO] Setting branch to main...
git branch -M main
echo [OK] Branch set
echo.

REM Push to GitHub
echo ================================================
echo   Pushing to GitHub...
echo ================================================
echo.
echo NOTE: You will be asked for GitHub credentials
echo.
echo If you don't have a Personal Access Token:
echo 1. Go to: https://github.com/settings/tokens
echo 2. Generate new token (classic)
echo 3. Select 'repo' scope
echo 4. Copy the token
echo 5. Use it as password when prompted
echo.
echo ================================================
echo.

git push -u origin main

if %errorlevel% neq 0 (
    echo.
    echo [ERROR] Push failed!
    echo.
    echo Common solutions:
    echo 1. Check your GitHub credentials
    echo 2. Use Personal Access Token instead of password
    echo 3. Make sure the repository exists on GitHub
    echo 4. Check your internet connection
    echo.
    pause
    exit /b 1
)

echo.
echo ================================================
echo   [OK] Successfully published to GitHub!
echo ================================================
echo.
echo Your repository is now available at:
echo %GITHUB_URL%
echo.
echo ================================================
echo.

pause
