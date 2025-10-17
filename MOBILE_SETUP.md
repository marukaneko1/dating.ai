# Mobile App Setup Guide

Complete guide to setting up and running the Hinge mobile app.

## Prerequisites

Before you begin, ensure you have:

1. **Node.js 18+** - [Download](https://nodejs.org/)
2. **Backend API running** - See main README for backend setup
3. **Development environment**:
   - **iOS**: Mac with Xcode installed
   - **Android**: Android Studio with emulator
   - **Both**: Expo Go app on physical device

## Quick Start (5 minutes)

```bash
# 1. Navigate to mobile directory
cd mobile

# 2. Install dependencies
npm install

# 3. Update API URL
# Edit src/config/api.ts with your backend URL

# 4. Start Expo
npm start

# 5. Run on device
# Press 'i' for iOS Simulator
# Press 'a' for Android Emulator
# Scan QR code with Expo Go for physical device
```

## Detailed Setup

### Step 1: Install Expo CLI (Optional)

While not required, the Expo CLI can be helpful:

```bash
npm install -g expo-cli
```

### Step 2: Install Dependencies

```bash
cd mobile
npm install
```

This installs:
- React Native
- Expo SDK
- React Navigation
- Axios
- Socket.io client
- And more...

### Step 3: Configure API URL

The mobile app needs to connect to your backend API. The URL varies based on where you're running:

#### For iOS Simulator

Edit `mobile/src/config/api.ts`:

```typescript
export const API_URL = 'http://localhost:3001';
```

#### For Android Emulator

```typescript
export const API_URL = 'http://10.0.2.2:3001';
```

`10.0.2.2` is the special IP that Android emulator uses to reach the host machine's `localhost`.

#### For Physical Device

First, find your computer's local IP:

**Mac/Linux**:
```bash
ifconfig | grep "inet " | grep -v 127.0.0.1
```

**Windows**:
```bash
ipconfig
```

Then use that IP:

```typescript
export const API_URL = 'http://192.168.1.XXX:3001';
```

**Important**: Your phone and computer must be on the same WiFi network!

### Step 4: Ensure Backend is Running

Before starting the mobile app, make sure your backend is running:

```bash
# In a separate terminal
cd backend
npm run dev
```

Verify backend is accessible:
- Visit `http://localhost:3001/api/health` in your browser
- Should return `{"status":"ok"}`

### Step 5: Start Expo Development Server

```bash
cd mobile
npm start
```

This will:
- Start Metro bundler
- Show QR code in terminal
- Open Expo DevTools in browser

### Step 6: Run on Device/Simulator

#### Option A: iOS Simulator (Mac only)

1. Install Xcode from App Store
2. Install Xcode Command Line Tools:
   ```bash
   xcode-select --install
   ```
3. In Expo terminal, press `i`
4. Simulator will open and load app

#### Option B: Android Emulator

1. Install [Android Studio](https://developer.android.com/studio)
2. Open Android Studio > Tools > AVD Manager
3. Create a virtual device (recommended: Pixel 5, API 30+)
4. Start the emulator
5. In Expo terminal, press `a`

#### Option C: Physical Device (Easiest!)

1. Install **Expo Go** app:
   - [iOS App Store](https://apps.apple.com/app/expo-go/id982107779)
   - [Google Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent)

2. Connect to same WiFi as your computer

3. Scan QR code:
   - **iOS**: Use Camera app
   - **Android**: Use Expo Go app scanner

4. App will build and open in Expo Go

## Testing the App

### Create Your First Account

1. Tap "Sign up"
2. Fill in registration form:
   - First name
   - Email
   - Password (min 6 characters)
   - Age (18+)
   - Gender
   - Interested in (check at least one)
3. Tap "Sign up"

### Complete Profile Setup

After registration, you'll go through 3 steps:

**Step 1: Add Photos** (2-6 photos)
- Tap "+" to add photo
- Select from camera roll
- Add at least 2 photos
- Tap "Continue"

**Step 2: Answer Prompts** (3 prompts)
- Tap a prompt to select it
- Type your answer
- Add 3 total prompts
- Tap "Continue"

**Step 3: Add Details**
- Enter bio (optional)
- Enter location (optional)
- Tap "Complete"

### Navigate the App

You'll land on the **Discover** screen where you can:
- Browse profiles
- Swipe through photos (left/right arrows)
- Like photos or prompts (with comment)
- Like entire profile (heart button)
- Pass (X button)

Other screens:
- **Likes**: See who liked you, like them back
- **Matches**: View all matches
- **Profile**: Edit your info

### Test Matching

To test the full flow, you need 2 accounts:

1. **Device 1**: Create Account A, complete profile
2. **Device 2** (or different simulator): Create Account B, complete profile
3. **Device 1**: Like Account B's profile
4. **Device 2**: Like Account A's profile
5. **Both**: See "It's a match!" notification
6. **Both**: Go to Matches, tap on match
7. **Test**: Send messages back and forth

## Troubleshooting

### "Cannot connect to server"

**Cause**: App can't reach backend API

**Fix**:
1. Check backend is running: `curl http://localhost:3001/api/health`
2. Verify API_URL in `src/config/api.ts`
3. For physical device: Use local IP, not localhost
4. Check firewall isn't blocking port 3001
5. Ensure device and computer on same WiFi

### "Failed to load profile"

**Cause**: Authentication issue

**Fix**:
1. Logout and login again
2. Clear app data (shake device → "Clear cache")
3. Restart app
4. Check JWT_SECRET matches between app and backend

### Photos not displaying

**Cause**: Image URLs incorrect

**Fix**:
1. Check backend `uploads/` folder has photos
2. Verify API_URL includes protocol (http://)
3. Try uploading new photo

### "Expo Go not loading"

**Cause**: Network or connection issue

**Fix**:
1. Ensure same WiFi network
2. Restart Expo server (`npm start`)
3. Clear cache: `expo start -c`
4. Update Expo Go app
5. Try LAN connection type in Expo DevTools

### App crashes on startup

**Cause**: Missing dependencies or cache issue

**Fix**:
```bash
# Clear everything and reinstall
rm -rf node_modules
npm install

# Clear Metro cache
expo start -c

# Reset Expo cache
expo start --reset-cache
```

### Android build errors

**Cause**: Gradle or dependency issues

**Fix**:
1. Update Expo SDK: `expo upgrade`
2. Check `app.json` config
3. Clear gradle cache:
   ```bash
   cd android
   ./gradlew clean
   cd ..
   ```

### iOS simulator not opening

**Cause**: Xcode issues

**Fix**:
1. Open Xcode at least once
2. Accept license: `sudo xcodebuild -license accept`
3. Install simulators in Xcode
4. Restart computer

## Development Tips

### Fast Refresh

Code changes automatically reload:
- Saved file → App reloads
- Shake device → Developer menu
- Press `r` in terminal → Reload

### Debug Menu

**iOS**: Press `Cmd+D`
**Android**: Press `Cmd+M` (Mac) or `Ctrl+M` (Windows)
**Physical Device**: Shake device

Options:
- Reload
- Debug Remote JS
- Toggle Element Inspector
- Show Performance Monitor

### Console Logs

View console.log() output:
- In terminal where `npm start` is running
- In Expo DevTools (browser)
- In React Native Debugger (if installed)

### Network Inspection

To debug API calls:
1. Install [React Native Debugger](https://github.com/jhen0409/react-native-debugger)
2. Enable Remote JS Debugging
3. View network tab

## Next Steps

### Customize the App

1. **Change Colors**: Edit color values in screen components
2. **Add Features**: Follow existing patterns in screens
3. **Modify Layout**: Update styles in each screen

### Prepare for Production

1. **Update app.json**:
   ```json
   {
     "name": "Your App Name",
     "slug": "your-unique-slug",
     "icon": "./assets/icon.png",
     "splash": {
       "image": "./assets/splash.png"
     }
   }
   ```

2. **Create App Icons**:
   - Icon: 1024x1024 PNG
   - Splash: 2048x2048 PNG

3. **Configure Bundle IDs**:
   - iOS: `ios.bundleIdentifier`
   - Android: `android.package`

### Build for Stores

See [Expo EAS Build](https://docs.expo.dev/build/introduction/) documentation.

## Common Commands

```bash
# Start development server
npm start

# Start with cache cleared
npm start -- --clear

# Run on iOS simulator
npm run ios

# Run on Android emulator
npm run android

# Update Expo SDK
expo upgrade

# Check for issues
expo doctor
```

## Getting Help

- **Expo Forums**: https://forums.expo.dev/
- **React Native Docs**: https://reactnative.dev/
- **Backend Issues**: See main README.md

## Quick Reference

| Action | iOS Simulator | Android Emulator | Physical Device |
|--------|--------------|------------------|-----------------|
| Open | Press `i` | Press `a` | Scan QR code |
| Reload | Cmd+R | Cmd+M → Reload | Shake → Reload |
| Debug Menu | Cmd+D | Cmd+M | Shake |
| API URL | localhost:3001 | 10.0.2.2:3001 | 192.168.x.x:3001 |

Happy coding! 🎉

