@echo off
title Franky Fashion - Dev Server
color 0A

echo.
echo  ============================================================
echo    FRANKY FASHION  ^|  TRYANDFIT  ^|  DEV SERVER
echo  ============================================================
echo.

:: ── Check Node.js ─────────────────────────────────────────────
where node >nul 2>&1
if %errorlevel% neq 0 (
    echo  [ERROR] Node.js not found. Install Node.js 18+ from nodejs.org
    pause
    exit /b 1
)

for /f "tokens=*" %%v in ('node -v') do set NODE_VER=%%v
echo  Node.js : %NODE_VER%

:: ── Navigate to project root (same folder as this bat file) ───
cd /d "%~dp0"

:: ── Check .env.local ──────────────────────────────────────────
if not exist ".env.local" (
    echo.
    echo  [WARNING] .env.local not found!
    echo  Create .env.local with:
    echo    NEXT_PUBLIC_SUPABASE_URL=...
    echo    NEXT_PUBLIC_SUPABASE_ANON_KEY=...
    echo    VERTEX_AI_PROJECT_ID=...
    echo    VERTEX_AI_LOCATION=...
    echo.
    echo  Press any key to start anyway ^(app may have limited functionality^)
    pause >nul
)

:: ── Install dependencies if needed ────────────────────────────
if not exist "node_modules" (
    echo.
    echo  [INFO] node_modules not found. Installing dependencies...
    echo  This may take a few minutes on first run.
    echo.
    call npm install
    if %errorlevel% neq 0 (
        echo  [ERROR] npm install failed. Check your internet connection.
        pause
        exit /b 1
    )
)

:: ── Check if port 3000 is already in use ──────────────────────
netstat -ano | findstr ":3000" >nul 2>&1
if %errorlevel% equ 0 (
    echo.
    echo  [WARNING] Port 3000 is already in use.
    echo  The server will try the next available port.
    echo.
)

echo.
echo  ============================================================
echo   Starting Franky Fashion...
echo   App URL  : http://localhost:3000
echo   Admin    : http://localhost:3000/admin/dashboard
echo   Seller   : http://localhost:3000/seller/dashboard
echo  ============================================================
echo.
echo  Press Ctrl+C to stop the server.
echo.

:: ── Start Next.js dev server ──────────────────────────────────
call npm run dev

echo.
echo  ============================================================
echo   Server stopped. Press any key to exit.
echo  ============================================================
pause
