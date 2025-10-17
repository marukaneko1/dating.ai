#!/bin/bash

echo "🔍 COMPREHENSIVE CODE CHECK"
echo "=========================="
echo ""

# Backend Check
echo "1️⃣ BACKEND CHECK"
echo "----------------"
cd backend
if npx tsc --noEmit 2>&1 | grep -q "error TS"; then
    echo "❌ Backend has TypeScript errors:"
    npx tsc --noEmit 2>&1 | grep "error TS" | head -10
else
    echo "✅ Backend TypeScript: No errors"
fi

# Check backend dependencies
if [ ! -d "node_modules" ]; then
    echo "❌ Backend node_modules missing"
else
    echo "✅ Backend dependencies installed"
fi

# Check .env
if [ ! -f ".env" ]; then
    echo "❌ Backend .env missing"
else
    echo "✅ Backend .env exists"
fi

echo ""

# Frontend Check
echo "2️⃣ FRONTEND CHECK"
echo "----------------"
cd ../frontend
if [ ! -d "node_modules" ]; then
    echo "⚠️  Frontend dependencies not installed"
else
    echo "✅ Frontend dependencies installed"
fi
echo ""

# Mobile Check
echo "3️⃣ MOBILE CHECK"
echo "----------------"
cd ../mobile

if npx tsc --noEmit 2>&1 | grep -q "error TS"; then
    echo "❌ Mobile has TypeScript errors:"
    npx tsc --noEmit 2>&1 | grep "error TS" | head -10
else
    echo "✅ Mobile TypeScript: No errors"
fi

# Check SDK version
SDK_VERSION=$(grep '"expo":' package.json | grep -o '~[0-9.]*' | tr -d '~')
echo "✅ Expo SDK version: $SDK_VERSION"

# Check React Navigation
if grep -q '@react-navigation/native-stack' package.json; then
    echo "✅ Using Native Stack (correct for SDK 54)"
else
    echo "❌ Not using Native Stack"
fi

echo ""

# Database Check
echo "4️⃣ DATABASE CHECK"
echo "----------------"
cd ../backend
if psql -U marukaneko -d hinge_mvp -c "SELECT COUNT(*) FROM \"Prompt\";" 2>/dev/null | grep -q "[0-9]"; then
    PROMPT_COUNT=$(psql -U marukaneko -d hinge_mvp -c "SELECT COUNT(*) FROM \"Prompt\";" -t 2>/dev/null | tr -d ' ')
    echo "✅ Database connected - $PROMPT_COUNT prompts"
else
    echo "⚠️  Database check failed (may need to start PostgreSQL)"
fi

echo ""
echo "=========================="
echo "Check complete!"
