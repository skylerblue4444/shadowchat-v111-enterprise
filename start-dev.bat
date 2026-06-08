@echo off
REM ShadowChat v111 — One-Click Dev Server Starter (Windows)
REM Usage: start-dev.bat

setlocal enabledelayedexpansion

echo.
echo 🚀 ShadowChat v111 — HOPE AI × SKYCOIN4444
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo.

REM Check if node_modules exists
if not exist "node_modules" (
  echo 📦 Installing dependencies (first run^)...
  call pnpm install
  echo ✅ Dependencies installed
  echo.
)

REM Check for .env file
if not exist ".env" (
  echo ⚠️  .env file not found. Creating from .env.example...
  copy .env.example .env
  echo ✅ Created .env file (update with your credentials^)
  echo.
)

echo 🔥 Starting development server...
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo.
echo 📍 Local:   http://localhost:3000
echo.
echo Press Ctrl+C to stop the server
echo.

REM Start the dev server
call pnpm dev

pause
