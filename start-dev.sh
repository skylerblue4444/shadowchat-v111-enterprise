#!/bin/bash

# ShadowChat v111 — One-Click Dev Server Starter
# Usage: ./start-dev.sh

set -e

echo "🚀 ShadowChat v111 — HOPE AI × SKYCOIN4444"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
  echo "📦 Installing dependencies (first run)..."
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

echo "🔥 Starting development server..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📍 Local:   http://localhost:3000"
echo "🌐 Network: http://$(hostname -I | awk '{print $1}'):3000"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

# Start the dev server
pnpm dev
