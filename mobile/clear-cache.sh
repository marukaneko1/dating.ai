#!/bin/bash

echo "🧹 Clearing all caches for mobile app..."
echo ""

# Clear Watchman
echo "Clearing Watchman cache..."
watchman shutdown-server
watchman watch-del-all 2>/dev/null || true

# Clear Expo cache
echo "Clearing Expo cache..."
rm -rf .expo

# Clear Metro bundler cache
echo "Clearing Metro cache..."
rm -rf node_modules/.cache

# Clear npm cache
echo "Clearing npm cache..."
npm cache clean --force 2>/dev/null || true

# Clear temp files
echo "Clearing temp files..."
rm -rf /tmp/metro-* /tmp/haste-* 2>/dev/null || true

echo ""
echo "✅ All caches cleared!"
echo ""
echo "Now run: npm start -- --clear"

