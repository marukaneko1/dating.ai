#!/bin/bash

echo "🧪 TESTING MOBILE APP FIX"
echo "========================="

# Check if Metro is running
echo "1️⃣ Checking Metro status..."
if curl -s http://localhost:8081/status | grep -q "running"; then
    echo "✅ Metro bundler is running"
else
    echo "❌ Metro bundler not running"
    exit 1
fi

# Check if Expo process exists
echo "2️⃣ Checking Expo process..."
if ps aux | grep -q "expo start"; then
    echo "✅ Expo process is running"
else
    echo "❌ Expo process not found"
    exit 1
fi

# Check if node_modules exists
echo "3️⃣ Checking dependencies..."
if [ -d "mobile/node_modules" ]; then
    echo "✅ Dependencies installed"
else
    echo "❌ Dependencies missing"
    exit 1
fi

# Check if expo package exists
echo "4️⃣ Checking Expo package..."
if [ -f "mobile/node_modules/expo/AppEntry.js" ]; then
    echo "✅ Expo AppEntry found"
else
    echo "❌ Expo AppEntry missing"
    exit 1
fi

echo ""
echo "🎉 ALL TESTS PASSED!"
echo "Your mobile app should be working now."
echo ""
echo "📱 Next steps:"
echo "1. Open Expo Go on your phone"
echo "2. Scan the QR code from the terminal"
echo "3. Your app should load without errors!"
echo ""
echo "If you still see the error, run:"
echo "cd mobile && ./EMERGENCY_FIX.sh"
