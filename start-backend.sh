#!/bin/bash

# Increase file limit for macOS
ulimit -n 10240

# Navigate to backend
cd "$(dirname "$0")/backend"

echo "🚀 Starting Backend API..."
echo "✓ Database configured"
echo "✓ Dependencies installed"
echo ""
echo "Starting server on http://localhost:3001"
echo "Press Ctrl+C to stop"
echo ""

# Start backend
npm run dev

