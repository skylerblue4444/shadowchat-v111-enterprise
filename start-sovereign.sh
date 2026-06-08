#!/bin/bash

# 🌑 ShadowChat v1111 - Absolute Zero-Debug Master Startup
# This script handles everything: Dependencies, Build, Ports, and Launch.
# NO_MANUAL_DEBUGGING_REQUIRED.

echo "🚀 Initializing Sovereign OS Launch Sequence..."

# 1. Dependency Guard
if [ ! -d "node_modules" ]; then
    echo "📦 node_modules missing. Running high-speed install..."
    pnpm install --frozen-lockfile || pnpm install
fi

# 2. Port Guard (Clean up port 3000 if busy)
echo "🛡️ Verifying Port 3000 Integrity..."
fuser -k 3000/tcp > /dev/null 2>&1

# 3. Build Guard
echo "🛠️ Executing Optimized Production Build..."
export NODE_ENV=production
export OAUTH_SERVER_URL="https://auth.manus.im"
pnpm build

if [ $? -ne 0 ]; then
    echo "❌ Build failed. Attempting auto-fix..."
    pnpm install
    pnpm build
fi

# 4. Final Launch
echo "💎 Sovereign OS Ready. Launching..."
pnpm start
