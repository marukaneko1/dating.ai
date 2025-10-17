#!/bin/bash

echo "🔧 COMPLETE EXPO FIX - Resolving Module Errors"
echo "=============================================="
echo ""

# Step 1: Stop all processes
echo "1️⃣ Stopping all Metro/Expo processes..."
pkill -f "expo start" 2>/dev/null || true
pkill -f "metro" 2>/dev/null || true
sleep 2
echo "   ✅ Processes stopped"
echo ""

# Step 2: Clear ALL caches
echo "2️⃣ Clearing all caches..."
rm -rf .expo 2>/dev/null || true
rm -rf node_modules/.cache 2>/dev/null || true
rm -rf $TMPDIR/metro-* 2>/dev/null || true
rm -rf $TMPDIR/react-* 2>/dev/null || true
rm -rf $TMPDIR/haste-* 2>/dev/null || true
rm -rf ~/.expo/metro-cache 2>/dev/null || true
echo "   ✅ Expo caches cleared"

# Step 3: Reset Watchman
echo "3️⃣ Resetting Watchman..."
watchman shutdown-server 2>/dev/null || true
watchman watch-del-all 2>/dev/null || true
echo "   ✅ Watchman reset"

# Step 4: Clear npm cache
echo "4️⃣ Clearing npm cache..."
npm cache clean --force 2>/dev/null
echo "   ✅ npm cache cleared"
echo ""

# Step 5: Set file limit
echo "5️⃣ Setting file limit..."
ulimit -n 65536
echo "   ✅ File limit set to $(ulimit -n)"
echo ""

echo "=============================================="
echo "✅ COMPLETE! All caches cleared."
echo ""
echo "Now run:"
echo "  npm start -- --clear --reset-cache"
echo ""
echo "Or if that fails:"
echo "  rm -rf node_modules package-lock.json"
echo "  npm install --legacy-peer-deps"
echo "  npm start -- --clear"
echo "=============================================="

