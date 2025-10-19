#!/bin/bash

# Quick start script for Expo Go
# This will clear cache and start fresh

echo "🚀 Starting Hinge Mobile App for Expo Go..."
echo ""

cd mobile

echo "🧹 Clearing Expo cache..."
rm -rf .expo
rm -rf node_modules/.cache

echo "✨ Starting Expo with clear cache..."
npx expo start --clear


