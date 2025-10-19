# 🚀 Start Mobile App - Quick Reference

## ⚠️ IMPORTANT: Always Run from Mobile Directory!

```bash
cd mobile    # ← Make sure you're in the mobile directory first!
```

---

## 🎯 Quick Start (Copy & Paste)

### Method 1: Tunnel Mode (Most Reliable)

```bash
cd mobile
npx expo start --tunnel --clear
```

**Use this if**: QR code doesn't work with regular mode

### Method 2: Regular Mode (Faster)

```bash
cd mobile
npx expo start --clear
```

**Use this if**: Phone and computer on same WiFi

---

## 📱 After Starting

1. **Wait** for QR code to appear (30-60 seconds)
2. **Scan** with your phone:
   - **iPhone**: Use Camera app
   - **Android**: Use Expo Go app
3. **Wait** for "Downloading bundle..." (~30 seconds)
4. **App loads!** Login screen appears

---

## 🔧 If QR Code Doesn't Scan

### Option A: Type URL Manually
1. Look in terminal for URL like: `exp://xxx.tunnelmole.net:80`
2. Open Expo Go → "Enter URL manually"
3. Type the URL

### Option B: Complete Reset
```bash
cd mobile
rm -rf .expo node_modules/.cache
npx expo start --tunnel --clear
```

---

## ✅ Checklist Before Starting

- [ ] You're in `mobile` directory (not root)
- [ ] Backend is running: `cd backend && npm run dev`
- [ ] Expo Go app installed on phone
- [ ] Phone has internet connection

---

## 🆘 Common Mistakes

### ❌ Wrong: Running from root directory
```bash
dating-ai % npx expo start    # ← WRONG!
```

### ✅ Right: Running from mobile directory
```bash
dating-ai % cd mobile         # ← Go to mobile first
mobile % npx expo start       # ← NOW run expo
```

---

## 🎮 Expo Commands (While Running)

Press these keys in terminal:
- `r` - Reload app
- `m` - Toggle menu
- `c` - Clear cache
- `?` - Show help

---

## 📝 Two Terminal Setup

### Terminal 1: Backend
```bash
cd backend
npm run dev
```

### Terminal 2: Mobile  
```bash
cd mobile
npx expo start --tunnel --clear
```

Keep both running!


