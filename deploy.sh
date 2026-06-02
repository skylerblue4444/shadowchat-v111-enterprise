#!/bin/bash
set -e
echo "🚀 ShadowChat v111 Production Deployment"
echo "=========================================="
echo "📦 Installing dependencies..."
pnpm install
echo "🗄️  Setting up database..."
pnpm db:push
pnpm seed
echo "🔨 Building application..."
pnpm build
echo "✅ Starting production server..."
pnpm start
echo "🎉 Deployment complete!"
