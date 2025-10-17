# 🚀 START HERE - Complete Setup & Run Guide

Your Hinge dating app is ready! Follow these simple steps.

## ✅ What's Already Done

- ✅ Backend API created and configured
- ✅ Mobile app (React Native/Expo) created
- ✅ Web app (React/Vite) created
- ✅ Database schema defined
- ✅ Authentication system implemented
- ✅ All dependencies installed
- ✅ Database migrated and seeded
- ✅ **All code pushed to GitHub!**

## 📋 Your Configuration

- **Backend Port**: `3002`
- **Your Local IP**: `192.168.1.139`
- **Mobile API**: `http://192.168.1.139:3002`
- **Database**: `hinge_mvp` on PostgreSQL

## 🏃‍♂️ Quick Start (2 Steps)

### Step 1: Start Backend

In **Terminal 1**, run:
```bash
cd /Users/marukaneko/dating-ai/backend
npm run dev
```

✅ **Wait for**: `Server running on port 3002`

### Step 2: Start Mobile

In **Terminal 2** (new window), run:
```bash
cd /Users/marukaneko/dating-ai
./fix-mobile.sh  # Run ONCE to fix macOS file limit
cd mobile
npm start
```

✅ **Wait for**: QR code to appear

### Step 3: Open on Your Phone

1. **Install Expo Go** app from App Store/Play Store
2. **Scan the QR code** in Terminal 2
3. **Wait** for app to load (first time takes ~30 seconds)
4. **Register** and start swiping! 💕

## 🔧 Troubleshooting

### Backend Shows Error in Terminal 1

**In Terminal 1, type** `rs` and press Enter to restart nodemon.

The file is now fixed, so it should start successfully!

### Mobile Shows EMFILE Error

**Run this ONCE:**
```bash
cd /Users/marukaneko/dating-ai
./fix-mobile.sh
```

Then restart mobile app.

### Can't Connect from Phone

Make sure:
1. ✅ Phone and computer on **same WiFi**
2. ✅ Backend is running (check Terminal 1)
3. ✅ Using correct IP: `192.168.1.139:3002`

Test from phone's browser:
```
http://192.168.1.139:3002/api/health
```

Should show: `{"status":"ok"}`

### Want to Use Simulator Instead?

Edit `/Users/marukaneko/dating-ai/mobile/src/config/api.ts`:

```typescript
// For iOS Simulator:
export const API_URL = 'http://localhost:3002';

// For Android Emulator:
export const API_URL = 'http://10.0.2.2:3002';
```

Then in Terminal 2:
- Press `i` for iOS Simulator
- Press `a` for Android Emulator

## 🌐 Also Start Web App (Optional)

In **Terminal 3**, run:
```bash
cd /Users/marukaneko/dating-ai/frontend
npm install  # First time only
npm run dev
```

Visit: http://localhost:5173

## 📱 What You Have

### Backend (Node.js + Express + PostgreSQL)
- RESTful API on port **3002**
- JWT authentication
- Real-time messaging (Socket.io)
- Photo uploads
- Matching algorithm

### Mobile App (React Native + Expo)
- iOS & Android from single codebase
- Native image picker
- Real-time chat
- Push notification ready
- Configured for: `http://192.168.1.139:3002`

### Web App (React + Vite)
- Responsive design
- Same features as mobile
- Runs on port **5173**

## 🎯 Test the Full Flow

1. **Register** on mobile app
2. **Add photos** (2-6 photos)
3. **Answer prompts** (3 prompts)
4. **Browse profiles** on Discover tab
5. **Like someone** (need 2 accounts to test matching)
6. **Chat** when matched

## 📊 GitHub Repository

All code is pushed to:
**https://github.com/marukaneko1/dating.ai**

Latest commit: `3781127` - Backend fixed and running!

## 🔄 Restart Everything

If you need to restart:

**Stop**: Press `Ctrl+C` in each terminal

**Start**:
```bash
# Terminal 1
cd /Users/marukaneko/dating-ai/backend && npm run dev

# Terminal 2  
cd /Users/marukaneko/dating-ai/mobile && npm start
```

## ✅ Verify Backend

```bash
curl http://localhost:3002/api/health
# Returns: {"status":"ok"}
```

## 🎉 You're All Set!

Your complete dating app is ready:
- ✅ Backend API running
- ✅ Mobile app ready to launch
- ✅ Database configured
- ✅ All on GitHub

Just **start the servers** and **scan the QR code**!

Happy dating! 💕

