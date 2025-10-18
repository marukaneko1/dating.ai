#!/bin/bash

echo "🚨 EMERGENCY MODULE RESOLUTION FIX"
echo "=================================="

# 1. Kill all processes
echo "1️⃣ Killing all processes..."
pkill -f "expo\|metro\|node" 2>/dev/null || true
sleep 2

# 2. Clear ALL caches
echo "2️⃣ Clearing all caches..."
rm -rf .expo
rm -rf node_modules/.cache
rm -rf /tmp/metro-*
rm -rf /tmp/haste-*
watchman shutdown-server 2>/dev/null || true
npm cache clean --force

# 3. Remove node_modules and reinstall
echo "3️⃣ Reinstalling dependencies..."
rm -rf node_modules
rm -f package-lock.json
npm install --force

# 4. Clear Metro cache
echo "4️⃣ Clearing Metro cache..."
npx expo install --fix

# 5. Reset ulimit
echo "5️⃣ Setting file limits..."
ulimit -n 65536

echo ""
echo "✅ EMERGENCY FIX COMPLETE!"
echo "Now run: npm start -- --clear"
