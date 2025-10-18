#!/bin/bash

echo "🔬 DEEP CODE SCAN"
echo "================="
echo ""

# Find useEffect without cleanup
echo "📌 useEffect Cleanup Analysis..."
cd mobile/src/screens
for file in $(find . -name "*.tsx"); do
    if grep -q "useEffect" "$file"; then
        if ! grep -A 20 "useEffect" "$file" | grep -q "return () =>"; then
            echo "⚠️  Missing cleanup: $file"
        fi
    fi
done

echo ""
echo "📌 Potential Issues..."

# Check for setState after unmount
cd ../../..
if grep -r "setLoading\|setData\|setState" mobile/src/screens --include="*.tsx" | wc -l | grep -q "[1-9]"; then
    echo "ℹ️  State updates found - check for unmounted component updates"
fi

# Check for inline functions in JSX
INLINE_FUNCTIONS=$(grep -r "onClick={() =>\|onPress={() =>" mobile/src/screens --include="*.tsx" | wc -l | tr -d ' ')
if [ "$INLINE_FUNCTIONS" -gt "10" ]; then
    echo "ℹ️  $INLINE_FUNCTIONS inline functions (could use useCallback)"
fi

# Check error handling
echo ""
echo "📌 Error Handling..."
ERROR_HANDLERS=$(grep -r "catch.*error" backend/src --include="*.ts" | wc -l | tr -d ' ')
TRY_BLOCKS=$(grep -r "try {" backend/src --include="*.ts" | wc -l | tr -d ' ')
echo "✅ Try blocks: $TRY_BLOCKS | Catch handlers: $ERROR_HANDLERS"

# Check for console.logs in production code
echo ""
echo "📌 Debug Statements..."
CONSOLE_LOGS=$(grep -r "console.log\|console.error" backend/src mobile/src --include="*.ts" --include="*.tsx" | grep -v "//" | wc -l | tr -d ' ')
echo "ℹ️  Console statements: $CONSOLE_LOGS (remove for production)"

echo ""
echo "================="
echo "Deep scan complete!"
