# 🔧 Fix "Unable to Resolve Module" Error

This guide will fix the module resolution error you're seeing.

## 🚀 Quick Fix (Run These Commands)

In **Terminal 2** where mobile app is running:

### Step 1: Stop Current Process
```bash
# Press Ctrl+C
```

### Step 2: Clear All Caches
```bash
cd /Users/marukaneko/dating-ai/mobile
./clear-cache.sh
```

### Step 3: Start with Clean Cache
```bash
npm start -- --clear
```

Wait for QR code to appear (30-60 seconds).

## 🎯 Alternative: Complete Reset

If the above doesn't work, try this complete reset:

```bash
cd /Users/marukaneko/dating-ai/mobile

# 1. Stop any running processes
# Press Ctrl+C if running

# 2. Clean everything
rm -rf node_modules
rm -rf .expo
rm -rf package-lock.json
watchman shutdown-server

# 3. Reinstall
npm install --legacy-peer-deps

# 4. Start fresh
npm start -- --clear
```

## 📱 Common Module Errors & Fixes

### Error: "Unable to resolve module @react-navigation/..."

**Fix:**
```bash
npm install @react-navigation/native @react-navigation/native-stack @react-navigation/bottom-tabs --legacy-peer-deps
```

### Error: "Unable to resolve module react-native..."

**Fix:**
```bash
npm start -- --clear
# Metro cache issue - clearing fixes it
```

### Error: "Unable to resolve module ./src/..."

**Fix:**
```bash
# Check file exists
ls -la src/screens/auth/
ls -la src/screens/main/

# Restart with cache clear
npm start -- --clear
```

## ✅ Verification Steps

After starting, check:

1. ✅ No red errors in terminal
2. ✅ QR code appears
3. ✅ "Metro waiting on..." message
4. ✅ No "unable to resolve" errors

## 🔍 What Module is Failing?

If you see the error again, look for the specific module name:

```
Unable to resolve module XXXXX from YYYYY
```

Common ones:
- **@react-navigation/stack** → Fixed (we use native-stack now)
- **react-native-screens** → Should be 4.4.0
- **Socket.io-client** → Should be 4.8.1

## 🎯 Complete Clean Start

If nothing else works:

```bash
cd /Users/marukaneko/dating-ai/mobile

# Nuclear option - complete clean
rm -rf node_modules package-lock.json .expo
watchman shutdown-server
npm cache clean --force

# Reinstall everything
npm install --legacy-peer-deps

# Start with clean cache
npm start -- --clear
```

## 📊 After Fixing

You should see:
```
✅ Starting Metro Bundler
✅ No SDK version warnings
✅ No module resolution errors
✅ QR code appears
✅ "Metro waiting on exp://192.168.1.139:8081"
```

## 🔧 If Specific Error Persists

Tell me the **exact error message** you see, including:
1. Module name that can't be resolved
2. File path it's looking for
3. Any suggestions Metro gives

For example:
```
Unable to resolve module @react-navigation/stack from src/navigation/AppNavigator.tsx
None of these files exist:
  * node_modules/@react-navigation/stack(.native|.ios.tsx|.native.tsx|...)
```

## 🎉 Quick Command Reference

```bash
# Stop app
Ctrl+C

# Clear cache
cd /Users/marukaneko/dating-ai/mobile
./clear-cache.sh

# Start clean
npm start -- --clear

# Complete reset
rm -rf node_modules .expo package-lock.json
npm install --legacy-peer-deps
npm start -- --clear
```

## 💡 Pro Tip

For future cache issues, always run:
```bash
npm start -- --clear
```

The `--clear` flag clears Metro bundler cache on startup!

