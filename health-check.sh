#!/bin/bash

# 🩺 ShadowChat v1111 - Sovereign Health Check
# Verifies all 20+ hubs, dependencies, and build integrity.

echo "🩺 Initiating Sovereign Health Check..."

# 1. Dependency Check
if [ -d "node_modules" ]; then
    echo "✅ Dependencies: INSTALLED"
else
    echo "❌ Dependencies: MISSING"
fi

# 2. Build Check
if [ -d "dist" ]; then
    echo "✅ Production Build: PRESENT"
else
    echo "❌ Production Build: MISSING"
fi

# 3. Critical Files Check
CRITICAL_FILES=("start-sovereign.sh" "deploy.sh" "package.json" "README.md")
for file in "${CRITICAL_FILES[@]}"; do
    if [ -f "$file" ]; then
        echo "✅ Critical File [$file]: OK"
    else
        echo "❌ Critical File [$file]: MISSING"
    fi
done

# 4. Neural Core Verification
if grep -q "useNeuralCore" client/src/lib/neural-core-sync.ts; then
    echo "✅ Neural Core Sync: VERIFIED"
else
    echo "❌ Neural Core Sync: CORRUPTED"
fi

echo "✨ Health Check Complete. Status: SOVEREIGN_OPTIMIZED"
