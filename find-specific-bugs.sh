#!/bin/bash

echo "🔍 DEEP BUG SCAN"
echo "================"
echo ""

BUGS_FOUND=0

# Check 1: Missing error handling
echo "1. Checking for missing try-catch blocks..."
MISSING_TRY_CATCH=$(grep -r "await.*api\." mobile/src/screens --include="*.tsx" | grep -v "try" | wc -l | tr -d ' ')
if [ "$MISSING_TRY_CATCH" -gt "0" ]; then
    echo "   ⚠️  Found $MISSING_TRY_CATCH instances without try-catch"
    BUGS_FOUND=$((BUGS_FOUND + 1))
else
    echo "   ✅ All API calls have try-catch"
fi

# Check 2: Unused imports
echo "2. Checking for unused imports..."
if grep -r "import.*StackNavigationProp" mobile/src --include="*.tsx" 2>/dev/null | wc -l | grep -q "^0$"; then
    echo "   ✅ No old Stack imports"
else
    echo "   ⚠️  Old Stack imports found (should use NativeStack)"
    BUGS_FOUND=$((BUGS_FOUND + 1))
fi

# Check 3: Missing dependencies in package.json
echo "3. Checking package.json consistency..."
cd mobile
if npm ls @react-navigation/native-stack 2>&1 | grep -q "UNMET"; then
    echo "   ⚠️  Navigation packages not properly installed"
    BUGS_FOUND=$((BUGS_FOUND + 1))
else
    echo "   ✅ All navigation packages installed"
fi
cd ..

# Check 4: Type safety issues
echo "4. Checking for 'any' types..."
ANY_COUNT=$(grep -r ": any" backend/src mobile/src frontend/src --include="*.ts" --include="*.tsx" 2>/dev/null | grep -v "//" | wc -l | tr -d ' ')
echo "   ℹ️  Found $ANY_COUNT uses of 'any' type"

# Check 5: Missing null checks
echo "5. Checking for potential null reference errors..."
if grep -r "user\." mobile/src --include="*.tsx" | grep -v "user\?" | grep -v "if.*user" | grep -v "user &&" | head -1 > /dev/null; then
    echo "   ⚠️  Potential null reference issues found"
    BUGS_FOUND=$((BUGS_FOUND + 1))
else
    echo "   ✅ Null checks present"
fi

# Check 6: Hardcoded values
echo "6. Checking for hardcoded URLs..."
if grep -r "http://localhost" mobile/src --include="*.tsx" 2>/dev/null | grep -v "config" | grep -v "//" | wc -l | grep -q "^0$"; then
    echo "   ✅ No hardcoded localhost URLs in components"
else
    echo "   ⚠️  Hardcoded URLs found (should use config)"
    BUGS_FOUND=$((BUGS_FOUND + 1))
fi

# Check 7: Missing keys in lists
echo "7. Checking for missing keys in .map()..."
if grep -r "\.map((.*) =>" mobile/src/screens --include="*.tsx" | grep -v "key=" | head -1 > /dev/null; then
    echo "   ⚠️  Some .map() calls may be missing keys"
    BUGS_FOUND=$((BUGS_FOUND + 1))
else
    echo "   ✅ All lists have keys"
fi

# Check 8: Async/await issues
echo "8. Checking for unhandled promises..."
if grep -r "\.then(" backend/src mobile/src frontend/src --include="*.ts" --include="*.tsx" 2>/dev/null | grep -v "//" | wc -l | grep -q "^0$"; then
    echo "   ✅ Using async/await (no .then chains)"
else
    echo "   ℹ️  Some .then() calls found (prefer async/await)"
fi

echo ""
echo "================"
if [ "$BUGS_FOUND" -eq "0" ]; then
    echo "✅ NO CRITICAL BUGS FOUND!"
else
    echo "⚠️  Found $BUGS_FOUND potential issues (mostly minor)"
fi
echo "================"
