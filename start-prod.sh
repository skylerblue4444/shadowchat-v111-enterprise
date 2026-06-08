#!/bin/bash

# ShadowChat v111 — One-Click Production Starter
# Usage: ./start-prod.sh

set -e

echo "🚀 ShadowChat v111 — HOPE AI × SKYCOIN4444 (PRODUCTION)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
  echo "📦 Installing dependencies..."
  pnpm install
  echo "✅ Dependencies installed"
  echo ""
fi

# Check for .env file
if [ ! -f ".env" ]; then
  echo "⚠️  .env file not found. Creating from .env.example..."
  cp .env.example .env
  echo "✅ Created .env file (update with your credentials)"
  echo ""
fi

echo "🔨 Building for production..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
pnpm build

if [ $? -ne 0 ]; then
  echo "❌ Build failed. Check errors above."
  exit 1
fi

echo ""
echo "✅ Build completed successfully"
echo ""
echo "🚀 Starting production server..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📍 Production Server: http://localhost:3000"
echo "🌐 Network Access: http://$(hostname -I | awk '{print $1}'):3000"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

# Start the production server
NODE_ENV=production pnpm start
