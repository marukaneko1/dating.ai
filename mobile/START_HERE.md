# 🚀 Quick Start for Expo Go

## Method 1: Tunnel Mode (Most Reliable - Try This First!)

**Best for**: Any network situation, always works

```bash
./start-expo.sh
```

OR manually:

```bash
npx expo start --tunnel --clear
```

**How to scan:**
- **iPhone**: Open Camera app, point at QR code
- **Android**: Open Expo Go app, tap "Scan QR code"

---

## Method 2: LAN Mode (Fast, but requires same WiFi)

**Best for**: When phone and computer are on same WiFi

```bash
npx expo start --clear
```

---

## Method 3: Manual Connection (If QR doesn't work)

1. Start Expo: `npx expo start --tunnel`
2. Look for the URL in terminal (like: `exp://xxx.xxx.xxx`)
3. Open Expo Go app
4. Tap "Enter URL manually"
5. Type the URL from terminal

---

## 🔧 If Nothing Works, Try This:

```bash
# 1. Clear everything
rm -rf .expo
rm -rf node_modules/.cache
rm -rf node_modules
npm cache clean --force

# 2. Reinstall
npm install

# 3. Start fresh
npx expo start --tunnel --clear
```

---

## ✅ What to Expect

After scanning:
1. "Opening on [your device]..." message
2. "Downloading JavaScript bundle" (takes 30-60 seconds first time)
3. App loads and shows login screen

---

## 🆘 Still Having Issues?

### Error: "No usable data found"
- **Fix**: Use tunnel mode (`--tunnel` flag)
- Your QR code might be corrupted, tunnel mode generates a fresh one

### Error: "Unable to resolve module"
- **Fix**: `rm -rf node_modules && npm install`

### Error: "Network request failed"  
- **Fix**: Make sure backend is running on port 3001
- **Check**: `cd ../backend && npm run dev` in another terminal

### QR code scanner doesn't open
- **iPhone**: Make sure you're using the Camera app, not Expo Go
- **Android**: Make sure Expo Go app is updated to latest version

---

## 📱 Requirements Checklist

Before starting:
- [ ] Expo Go app installed on phone
- [ ] Backend running (`cd ../backend && npm run dev`)
- [ ] You're in the `mobile` directory
- [ ] Dependencies installed (`npm install`)

---

## 🎯 Quick Commands

```bash
# Option A: Tunnel (always works)
npx expo start --tunnel --clear

# Option B: Quick script
./start-expo.sh

# Option C: Clear cache first
rm -rf .expo && npx expo start --tunnel
```

Choose tunnel mode first - it's the most reliable!


