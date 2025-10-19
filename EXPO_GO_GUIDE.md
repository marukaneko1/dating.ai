# Expo Go Quick Start Guide

Complete guide to running the Hinge mobile app with Expo Go on your phone or simulator.

## 📱 What is Expo Go?

Expo Go is a free app that lets you run your React Native app instantly on your phone without building native code. Perfect for development and testing!

---

## 🚀 Quick Start (3 Steps)

### 1. Install Expo Go on Your Phone

Download from your app store:
- **iOS**: [App Store - Expo Go](https://apps.apple.com/app/expo-go/id982107779)
- **Android**: [Play Store - Expo Go](https://play.google.com/store/apps/details?id=host.exp.exponent)

### 2. Start the Backend

```bash
cd backend
npm run dev
```

Backend will run on `http://localhost:3001`

### 3. Start the Mobile App

```bash
cd mobile
npm install
npm start
```

You'll see a QR code in the terminal. Scan it with:
- **iOS**: Camera app
- **Android**: Expo Go app

---

## 📋 Prerequisites

- Node.js 18+
- Backend API running (see step 2 above)
- Expo Go app installed on phone
- Phone and computer on **same WiFi network**

---

## 🔧 Setup Options

### Option A: Physical Device (Recommended)

**Best for**: Testing on real device, most realistic experience

**Steps:**

1. Ensure phone and computer are on the same WiFi
2. Start backend: `cd backend && npm run dev`
3. Start mobile: `cd mobile && npm start`
4. Scan QR code with Expo Go

**Troubleshooting:**

If app can't connect to API:
1. Find your computer's local IP:
   ```bash
   # macOS/Linux
   ifconfig | grep "inet "
   
   # Windows
   ipconfig
   ```

2. Edit `mobile/src/config/api.ts`:
   ```typescript
   // Uncomment and update this line
   export const API_URL = 'http://YOUR_LOCAL_IP:3001';
   // Example: 'http://192.168.1.100:3001'
   ```

3. Restart Expo: Press `r` in terminal

---

### Option B: iOS Simulator (macOS only)

**Best for**: Fast iteration, debugging

**Steps:**

1. Install Xcode from Mac App Store (if not installed)
2. Install iOS Simulator:
   ```bash
   xcode-select --install
   ```

3. Start backend: `cd backend && npm run dev`
4. Start mobile: `cd mobile && npm start`
5. Press `i` in terminal to open iOS Simulator

**API Configuration**: Already auto-configured for iOS Simulator! ✅

---

### Option C: Android Emulator

**Best for**: Testing Android-specific features

**Steps:**

1. Install [Android Studio](https://developer.android.com/studio)
2. Open Android Studio → AVD Manager → Create Virtual Device
3. Start backend: `cd backend && npm run dev`
4. Start mobile: `cd mobile && npm start`
5. Press `a` in terminal to open Android Emulator

**API Configuration**: Already auto-configured for Android Emulator! ✅

---

## 🎯 Features Available in Expo Go

✅ **Fully Working:**
- User authentication
- Profile creation & editing
- Photo uploads (camera & library)
- Discovery feed
- Likes & comments
- Matching
- Real-time messaging (via Socket.io)
- All UI components
- Image picker & camera

⚠️ **Push Notifications Note:**
- Basic push notifications work in Expo Go for testing
- Production push notifications require custom build
- **Good news**: This app uses Socket.io for real-time messaging, which works perfectly in Expo Go!

❌ **Not Available (requires custom build):**
- Background location tracking
- Custom native modules not included in Expo Go
- Advanced notification features (custom sounds, critical alerts)

**Bottom line**: All core dating app features work perfectly in Expo Go! 🎉

---

## 🛠️ Development Commands

Once Expo is running, you can use these shortcuts in the terminal:

- `r` - Reload app
- `m` - Toggle menu
- `j` - Open React DevTools
- `i` - Open iOS Simulator
- `a` - Open Android Emulator
- `w` - Open in web browser
- `c` - Clear cache and restart
- `Ctrl+C` - Stop Expo

---

## 🔍 Debugging

### View Logs

Logs appear in two places:
1. **Terminal**: Where you ran `npm start`
2. **Expo DevTools**: Shake device → "Debug Remote JS"

### React DevTools

```bash
npm install -g react-devtools
react-devtools
```

Then shake device → "Show Element Inspector"

### Network Requests

Install Flipper for advanced debugging:
```bash
brew install flipper
```

---

## 🚨 Common Issues & Fixes

### Issue: "No usable data found" when scanning QR code

**Cause**: Missing dependencies or cache issues

**Fix (Best Solution):**
```bash
cd mobile
npm install
rm -rf .expo
rm -rf node_modules/.cache
npx expo start --clear
```

Or use the quick script:
```bash
./START_MOBILE_EXPO_GO.sh
```

---

### Issue: "Unable to connect to server"

**Cause**: App can't reach backend API

**Fix:**
1. Ensure backend is running (`cd backend && npm run dev`)
2. Check phone and computer are on same WiFi
3. Update API URL in `mobile/src/config/api.ts` with your local IP
4. Disable firewall/VPN temporarily

---

### Issue: QR code won't scan

**Fix:**
1. Make sure Expo Go app is installed and updated
2. Try typing the URL manually in Expo Go
3. Use tunnel mode: `npx expo start --tunnel`
4. On iPhone: Use Camera app (not Expo Go) to scan
5. On Android: Use Expo Go's built-in scanner

---

### Issue: "Error loading images"

**Cause**: Image picker permissions not granted

**Fix:**
1. Go to Phone Settings → Expo Go → Permissions
2. Enable Camera & Photos
3. Restart Expo Go

---

### Issue: "Metro Bundler error"

**Fix:**
```bash
cd mobile
rm -rf node_modules
rm -rf .expo
npm install
npm start --clear
```

---

### Issue: Slow loading/performance

**Fix:**
1. Enable Performance Monitor: Shake device → "Show Performance Monitor"
2. Use production mode: `npm start --no-dev --minify`
3. Clear cache: Press `c` in Expo terminal

---

## 📱 Testing Workflow

### Recommended Flow:

1. **Start Session**: `npm start` in mobile directory
2. **Make Changes**: Edit files in `mobile/src/`
3. **Auto-Reload**: Changes appear automatically (Fast Refresh)
4. **Test Feature**: Use app on device
5. **Check Logs**: View terminal for errors
6. **Iterate**: Repeat 2-5

### Testing Multiple Scenarios:

**Test different users:**
- Register multiple accounts
- Test matching between users
- Test messaging flow

**Test edge cases:**
- Poor network (enable airplane mode briefly)
- Background/foreground transitions
- Different screen sizes (use simulator)

---

## 🎨 Hot Reloading

Expo has amazing Fast Refresh:
- **JS changes**: Instant reload
- **Component changes**: State preserved
- **Style changes**: Instant update
- **Asset changes**: Auto-reload

To force full reload: Shake device → "Reload"

---

## 📊 Performance Tips

1. **Enable production mode** for testing performance:
   ```bash
   npm start -- --no-dev --minify
   ```

2. **Profile renders**:
   - Shake device → "Show Performance Monitor"
   - Use React DevTools Profiler

3. **Optimize images**:
   - Use compressed images
   - Images are optimized during upload

---

## 🔐 Security Notes

**Development Mode:**
- Debug tools exposed
- Source maps available
- Slower performance

**Never use in production!** Expo Go is for development only.

For production, create a standalone build:
```bash
eas build --platform ios
eas build --platform android
```

---

## 🆙 Advanced: Custom Dev Build

For features not in Expo Go (push notifications, custom native modules):

```bash
# Install EAS CLI
npm install -g eas-cli

# Login to Expo
eas login

# Configure project
eas build:configure

# Create development build
eas build --profile development --platform ios
eas build --profile development --platform android
```

Then install the build on your device and use it instead of Expo Go.

---

## 📚 Additional Resources

- [Expo Documentation](https://docs.expo.dev/)
- [Expo Go Features](https://docs.expo.dev/get-started/expo-go/)
- [React Native Debugging](https://reactnative.dev/docs/debugging)
- [Expo Troubleshooting](https://docs.expo.dev/troubleshooting/overview/)

---

## 💡 Pro Tips

1. **Use Tunnel Mode** if on different networks:
   ```bash
   npm start -- --tunnel
   ```

2. **Quick Restart**:
   - Shake device → "Reload" (or press `r` in terminal)

3. **Test on Multiple Devices**:
   - Same QR code works on multiple devices
   - Great for testing real-time features

4. **Development Menu**:
   - iOS: Cmd+D in Simulator, Shake device
   - Android: Cmd+M in Emulator, Shake device

5. **Clear Everything**:
   ```bash
   cd mobile
   npm start -- --clear
   ```

---

## ✅ Quick Checklist

Before reporting issues, check:

- [ ] Backend is running on port 3001
- [ ] Phone and computer on same WiFi
- [ ] Expo Go app is up to date
- [ ] Node modules are installed (`npm install`)
- [ ] Tried clearing cache (`npm start --clear`)
- [ ] API URL is correct in `mobile/src/config/api.ts`
- [ ] Firewall/VPN is not blocking connection

---

## 🎉 You're Ready!

Your app should now be running on your device. Try:

1. Register a new account
2. Upload profile photos
3. Answer prompts
4. Browse discovery feed
5. Like profiles
6. Test real-time messaging

Happy dating app development! 💕


