@echo off
REM ShadowChat v111 — One-Click Production Starter (Windows)
REM Usage: start-prod.bat

setlocal enabledelayedexpansion

echo.
echo 🚀 ShadowChat v111 — HOPE AI × SKYCOIN4444 (PRODUCTION^)
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo.

REM Check if node_modules exists
if not exist "node_modules" (
  echo 📦 Installing dependencies...
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

echo 🔨 Building for production...
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
call pnpm build

if !errorlevel! neq 0 (
  echo ❌ Build failed. Check errors above.
  pause
  exit /b 1
)

echo.
echo ✅ Build completed successfully
echo.
echo 🚀 Starting production server...
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo.
echo 📍 Production Server: http://localhost:3000
echo.
echo Press Ctrl+C to stop the server
echo.

REM Start the production server
set NODE_ENV=production
call pnpm start

pause
