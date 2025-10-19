#!/bin/bash

# Install Dependencies for Testing
# Run this script to install all new testing dependencies

echo "🚀 Installing dependencies for Hinge MVP..."
echo ""

# Backend dependencies
echo "📦 Installing backend dependencies..."
cd backend
npm install

echo "✅ Backend dependencies installed!"
echo ""

# Frontend dependencies
echo "📦 Installing frontend dependencies..."
cd ../frontend
npm install

echo "✅ Frontend dependencies installed!"
echo ""

# Mobile dependencies (optional)
echo "📦 Installing mobile dependencies..."
cd ../mobile
npm install

echo "✅ Mobile dependencies installed!"
echo ""

echo "🎉 All dependencies installed successfully!"
echo ""
echo "Next steps:"
echo "1. Set up test database: createdb hinge_mvp_test"
echo "2. Run backend tests: cd backend && npm test"
echo "3. Run frontend tests: cd frontend && npm test"
echo "4. Start mobile app: cd mobile && npm start"
echo ""
echo "📖 See TESTING.md for detailed testing guide"
echo "📱 See EXPO_GO_GUIDE.md for mobile quick start"


