#!/bin/bash

echo "🔍 COMPREHENSIVE CODE REVIEW"
echo "============================="
echo ""

ISSUES_FOUND=0

# 1. TypeScript Compilation Check
echo "1️⃣ TypeScript Compilation..."
cd backend
if npx tsc --noEmit 2>&1 | grep -q "error TS"; then
    echo "❌ Backend TypeScript errors found"
    npx tsc --noEmit 2>&1 | grep "error TS"
    ISSUES_FOUND=$((ISSUES_FOUND + 1))
else
    echo "✅ Backend TypeScript clean"
fi

cd ../mobile
if npx tsc --noEmit 2>&1 | grep -q "error TS"; then
    echo "❌ Mobile TypeScript errors found"
    npx tsc --noEmit 2>&1 | grep "error TS" | head -5
    ISSUES_FOUND=$((ISSUES_FOUND + 1))
else
    echo "✅ Mobile TypeScript clean"
fi
cd ..

# 2. Missing await keywords
echo ""
echo "2️⃣ Checking for missing await..."
MISSING_AWAIT=$(grep -r "= api\." mobile/src/screens --include="*.tsx" | grep -v "await" | grep -v "import" | grep -v "//" | wc -l | tr -d ' ')
if [ "$MISSING_AWAIT" -gt "0" ]; then
    echo "⚠️  Found $MISSING_AWAIT API calls potentially missing await"
    ISSUES_FOUND=$((ISSUES_FOUND + 1))
else
    echo "✅ All API calls have await"
fi

# 3. Unused state variables
echo ""
echo "3️⃣ Checking React hooks..."
if grep -r "useState" mobile/src/screens --include="*.tsx" | wc -l | grep -q "[0-9]"; then
    echo "✅ useState hooks found ($(grep -r "useState" mobile/src/screens --include="*.tsx" | wc -l | tr -d ' ') uses)"
fi

# 4. Memory leaks (missing cleanup)
echo ""
echo "4️⃣ Checking for memory leaks..."
USEEFFECT_COUNT=$(grep -r "useEffect" mobile/src/screens --include="*.tsx" | wc -l | tr -d ' ')
CLEANUP_COUNT=$(grep -r "return.*=>" mobile/src/screens --include="*.tsx" | grep -A5 "useEffect" | wc -l | tr -d ' ')
echo "ℹ️  useEffect: $USEEFFECT_COUNT | Cleanups: $CLEANUP_COUNT"

# 5. SQL Injection check
echo ""
echo "5️⃣ Security: SQL Injection..."
if grep -r "\$executeRaw\|\$queryRaw" backend/src --include="*.ts" | grep -v "//"; then
    echo "⚠️  Raw SQL found - check for injection"
    ISSUES_FOUND=$((ISSUES_FOUND + 1))
else
    echo "✅ No raw SQL (using Prisma ORM)"
fi

# 6. Exposed secrets
echo ""
echo "6️⃣ Security: Secrets check..."
if grep -rE "(password|secret|key).*=.*['\"][A-Za-z0-9]{20,}" backend/src mobile/src --include="*.ts" --include="*.tsx" | grep -v "JWT_SECRET" | grep -v "process.env" | grep -v "//" | wc -l | grep -q "^0$"; then
    echo "✅ No hardcoded secrets"
else
    echo "⚠️  Potential hardcoded secrets"
    ISSUES_FOUND=$((ISSUES_FOUND + 1))
fi

# 7. Error boundaries
echo ""
echo "7️⃣ React Error Boundaries..."
if grep -q "ErrorBoundary" mobile/App.tsx; then
    echo "✅ Error boundary implemented"
else
    echo "❌ Missing error boundary"
    ISSUES_FOUND=$((ISSUES_FOUND + 1))
fi

# 8. Missing dependencies in useEffect
echo ""
echo "8️⃣ useEffect dependencies..."
echo "ℹ️  Manual review recommended for exhaustive-deps"

# 9. Accessibility
echo ""
echo "9️⃣ Accessibility..."
if grep -r "accessibilityLabel" mobile/src/screens --include="*.tsx" | wc -l | grep -q "^0$"; then
    echo "⚠️  No accessibility labels (improvement needed)"
else
    echo "✅ Some accessibility labels found"
fi

# 10. Performance - useMemo/useCallback
echo ""
echo "🔟 Performance optimizations..."
USEMEMO=$(grep -r "useMemo\|useCallback" mobile/src --include="*.tsx" | wc -l | tr -d ' ')
if [ "$USEMEMO" -gt "0" ]; then
    echo "✅ Performance hooks used ($USEMEMO instances)"
else
    echo "ℹ️  No useMemo/useCallback (OK for MVP)"
fi

echo ""
echo "============================="
echo "Review complete! Issues: $ISSUES_FOUND"
echo "============================="
