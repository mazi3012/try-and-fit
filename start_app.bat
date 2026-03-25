@echo off
title Try-and-Fit - Local Dev Server
color 0B

echo.
echo  =====================================================
echo       TRY-AND-FIT - LOCAL DEVELOPMENT SERVER
echo  =====================================================
echo.

:: Check Node.js is available
where node >nul 2>&1
if %errorlevel% neq 0 (
    echo  [ERROR] Node.js is not found in PATH. Please install Node.js 18+.
    pause
    exit /b 1
)

:: Navigate to frontend directory
cd /d "%~dp0frontend"

:: Check if frontend node_modules exist
if not exist "node_modules" (
    echo  [INFO] node_modules not found. Running npm install...
    call npm install
)

echo Starting Frontend (Next.js) ...
echo URL: http://localhost:3000
echo.

:: Run npm run dev and keep the window open on crash
call npm run dev

echo.
echo  =====================================================
echo   Frontend stopped. Press any key to exit.
echo  =====================================================
pause
