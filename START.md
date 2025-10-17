# 🚀 Quick Start Guide

Follow these steps in **3 separate terminal windows**:

## Terminal 1: Backend

```bash
# Navigate to backend
cd /Users/marukaneko/dating-ai/backend

# Increase file limit (for macOS)
ulimit -n 10240

# Start backend
npm run dev
```

You should see: `Server running on port 3001`

## Terminal 2: Mobile App

```bash
# Navigate to mobile
cd /Users/marukaneko/dating-ai/mobile

# Increase file limit (for macOS - fixes EMFILE error)
ulimit -n 10240

# Start Expo
npm start
```

You should see a QR code appear!

## Terminal 3: Web App (Optional)

```bash
# Navigate to frontend
cd /Users/marukaneko/dating-ai/frontend

# Start web app
npm run dev
```

## 📱 Run Mobile App

After Terminal 2 shows the QR code:

### Option A: Physical Device (Easiest!)
1. Install **Expo Go** app on your phone
2. Scan the QR code
3. App will load!

### Option B: Simulator
- **iOS**: Press `i` in Terminal 2
- **Android**: Press `a` in Terminal 2

## ⚙️ Configure Mobile API

Before running mobile, edit this file:
`/Users/marukaneko/dating-ai/mobile/src/config/api.ts`

Change the API_URL based on how you're testing:

```typescript
// For iOS Simulator (Mac)
export const API_URL = 'http://localhost:3001';

// For Android Emulator  
export const API_URL = 'http://10.0.2.2:3001';

// For Physical Device (find your IP first)
export const API_URL = 'http://192.168.1.XXX:3001';
```

### Find Your Local IP (for physical device):
```bash
ifconfig | grep "inet " | grep -v 127.0.0.1
# Use the IP shown (e.g., 192.168.1.100)
```

## ✅ Verify Backend is Running

In a new terminal:
```bash
curl http://localhost:3001/api/health
# Should return: {"status":"ok"}
```

## 🐛 Troubleshooting

### Backend won't start
```bash
cd backend
# Kill any existing process
lsof -ti:3001 | xargs kill -9
# Try again
npm run dev
```

### Mobile EMFILE error
```bash
# Run this before npm start
ulimit -n 10240
```

### Can't connect to backend from phone
1. Make sure phone and computer on same WiFi
2. Use your computer's local IP (not localhost)
3. Check firewall isn't blocking port 3001

## 🎉 You're Ready!

Once all three terminals are running:
1. Register a new account
2. Complete your profile
3. Start swiping!

