#!/bin/bash

# Increase file limit for macOS
ulimit -n 10240

# Navigate to mobile
cd "$(dirname "$0")/mobile"

echo "📱 Starting Mobile App (Expo)..."
echo ""
echo "IMPORTANT: Configure API URL first!"
echo "Edit: mobile/src/config/api.ts"
echo ""
echo "Choose based on how you'll test:"
echo "  - iOS Simulator: http://localhost:3001"
echo "  - Android Emulator: http://10.0.2.2:3001"
echo "  - Physical Device: http://YOUR_LOCAL_IP:3001"
echo ""
echo "Find your local IP: ifconfig | grep 'inet ' | grep -v 127.0.0.1"
echo ""
echo "Starting Expo..."
echo "Press Ctrl+C to stop"
echo ""

# Start Expo
npm start

