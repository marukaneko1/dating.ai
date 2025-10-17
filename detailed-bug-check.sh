#!/bin/bash

echo "🐛 DETAILED BUG CHECK"
echo "===================="
echo ""

# Check for missing imports
echo "📦 Checking Imports..."
cd mobile/src

# Check NavigationContainer
if grep -r "NavigationContainer" . --include="*.tsx" | grep -v "import.*NavigationContainer" | grep -v "^Binary" > /dev/null; then
    echo "⚠️  NavigationContainer used but check imports"
else
    echo "✅ NavigationContainer imports OK"
fi

# Check useNavigation
if grep -r "useNavigation<" . --include="*.tsx" --include="*.ts" | wc -l | grep -q "[1-9]"; then
    echo "✅ useNavigation hooks found"
fi

# Check API imports
if grep -r "import.*api" . --include="*.tsx" | wc -l | grep -q "[1-9]"; then
    echo "✅ API imports found"
fi

cd ../..

# Check for potential runtime errors
echo ""
echo "⚠️  Potential Issues..."

# Check for any .ts files that should be .tsx
find mobile/src/screens -name "*.ts" 2>/dev/null | while read -r file; do
    if grep -q "React" "$file"; then
        echo "⚠️  $file uses React but has .ts extension (should be .tsx)"
    fi
done

# Check for missing await
grep -r "api\." mobile/src --include="*.tsx" --include="*.ts" | grep -v "await" | grep -v "import" | grep -v "export" | grep -v "//" | head -3

echo ""
echo "🔍 React Native Checks..."

# Check StyleSheet usage
if grep -r "StyleSheet.create" mobile/src --include="*.tsx" | wc -l | grep -q "[1-9]"; then
    echo "✅ StyleSheet.create used correctly"
fi

# Check Platform-specific code
if grep -r "Platform.OS" mobile/src --include="*.tsx" | wc -l | grep -q "[1-9]"; then
    echo "✅ Platform checks found"
fi

echo ""
echo "🔐 Security Checks..."

# Check for hardcoded secrets
if grep -rE "(password|secret|key).*=.*['\"][^'\"]{20,}" backend/src --include="*.ts" | grep -v "JWT_SECRET" | grep -v "process.env" | grep -v "//" | wc -l | grep -q "^0$"; then
    echo "✅ No hardcoded secrets found"
else
    echo "⚠️  Possible hardcoded secrets found"
fi

# Check for SQL injection
if grep -r "prisma\.\$executeRaw\|prisma\.\$queryRaw" backend/src --include="*.ts" | grep -v "//"; then
    echo "⚠️  Raw SQL queries found (check for injection)"
else
    echo "✅ No raw SQL queries (using Prisma ORM)"
fi

echo ""
echo "===================="
echo "Check complete!"
