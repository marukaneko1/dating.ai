#!/bin/bash

echo "🚀 Starting Expo with Tunnel Mode (Most Reliable)"
echo "This will work even if your phone and computer are on different networks!"
echo ""

# Clear watchman cache
echo "🧹 Clearing watchman cache..."
watchman watch-del-all 2>/dev/null || true

# Start Expo with tunnel mode
echo "✨ Starting Expo..."
npx expo start --tunnel --clear


