# Hinge Mobile App (React Native / Expo)

A beautiful, fully-featured mobile dating app built with React Native and Expo, inspired by Hinge.

## 🎯 Features

### Complete Dating Experience
- ✅ **Authentication**: Secure login/register with JWT tokens
- ✅ **Profile Setup**: Multi-step wizard with photo upload and prompt selection
- ✅ **Discovery**: Swipe-style profile browsing with photo carousels
- ✅ **Engagement**: Like profiles, photos, or specific prompts with comments
- ✅ **Matching**: Mutual likes create instant matches
- ✅ **Real-time Chat**: Socket.io powered messaging
- ✅ **Profile Management**: Edit profile, photos, and preferences
- ✅ **Likes Feed**: View sent and received likes

## 📱 Tech Stack

- **Framework**: React Native (Expo SDK 50)
- **Language**: TypeScript
- **Navigation**: React Navigation v6
- **State Management**: React Context API
- **API Client**: Axios
- **Real-time**: Socket.io-client
- **Image Picker**: Expo Image Picker
- **Secure Storage**: Expo Secure Store
- **Gestures**: React Native Gesture Handler

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- iOS Simulator (Mac) or Android Emulator
- Expo Go app (for physical device testing)
- Backend API running (see backend folder)

### Installation

```bash
# Navigate to mobile directory
cd mobile

# Install dependencies
npm install

# Start Expo development server
npm start
```

### Running on Device/Simulator

After starting the dev server:

- **iOS**: Press `i` to open in iOS Simulator
- **Android**: Press `a` to open in Android Emulator
- **Physical Device**: Scan QR code with Expo Go app

### Configure API URL

Update the API URL in `src/config/api.ts`:

```typescript
// For iOS Simulator
export const API_URL = 'http://localhost:3001';

// For Android Emulator
export const API_URL = 'http://10.0.2.2:3001';

// For Physical Device (use your computer's local IP)
export const API_URL = 'http://192.168.1.XXX:3001';
```

## 📂 Project Structure

```
mobile/
├── src/
│   ├── config/
│   │   └── api.ts              # API configuration
│   ├── contexts/
│   │   └── AuthContext.tsx     # Authentication context
│   ├── navigation/
│   │   └── AppNavigator.tsx    # App navigation setup
│   ├── screens/
│   │   ├── auth/               # Login, Register, ProfileSetup
│   │   └── main/               # Discover, Likes, Matches, Chat, Profile
│   ├── services/
│   │   ├── api.ts              # API service functions
│   │   └── socket.ts           # Socket.io setup
│   └── types/
│       └── index.ts            # TypeScript types
├── App.tsx                     # App entry point
├── app.json                    # Expo configuration
├── package.json
└── tsconfig.json
```

## 🎨 Screens

### Auth Flow
1. **Login**: Email/password authentication
2. **Register**: Account creation with preferences
3. **Profile Setup**: 3-step wizard (photos → prompts → details)

### Main App
1. **Discover**: Browse profiles with photo carousel
2. **Likes**: View sent/received likes with like-back option
3. **Matches**: Grid of all matches with last message
4. **Chat**: Real-time messaging with matches
5. **Profile**: View/edit your profile, photos, and settings

## 🔧 Configuration

### API Configuration

Edit `src/config/api.ts`:

```typescript
export const API_URL = 'YOUR_API_URL';
export const API_BASE_URL = `${API_URL}/api`;
export const SOCKET_URL = API_URL;
```

### App Configuration

Edit `app.json`:

```json
{
  "expo": {
    "name": "Your App Name",
    "slug": "your-app-slug",
    "icon": "./assets/icon.png",
    "splash": {
      "image": "./assets/splash.png",
      "backgroundColor": "#FF6B6B"
    }
  }
}
```

## 📦 Building for Production

### iOS

```bash
# Login to Expo
expo login

# Build iOS app
eas build --platform ios

# Or for local build
expo build:ios
```

### Android

```bash
# Build Android app
eas build --platform android

# Or for local build
expo build:android
```

## 🔐 Permissions

The app requires the following permissions:

- **Camera Roll**: To upload profile photos
- **Internet**: To communicate with backend API

Permissions are requested at runtime when needed.

## 🎯 Key Features Explained

### Image Upload
- Uses Expo Image Picker for native photo selection
- Supports image editing/cropping
- Uploads via multipart/form-data
- Max 6 photos per profile

### Real-time Messaging
- Socket.io connection with JWT authentication
- Automatic reconnection on network changes
- Read receipts
- Typing indicators (server ready)

### Secure Storage
- JWT tokens stored in Expo Secure Store
- Platform-native secure storage (Keychain/Keystore)
- Auto-logout on token expiration

### Navigation
- Stack navigation for auth and modals
- Bottom tabs for main app
- Type-safe navigation params
- Deep linking support (ready)

## 🐛 Troubleshooting

### Cannot Connect to API

**Problem**: App can't reach backend API

**Solutions**:
1. Check API URL in `src/config/api.ts`
2. For iOS Simulator: use `localhost` or `127.0.0.1`
3. For Android Emulator: use `10.0.2.2`
4. For Physical Device: use your computer's local IP
5. Ensure backend is running and accessible

### Images Not Loading

**Problem**: Profile photos don't display

**Solutions**:
1. Check backend uploads folder exists
2. Verify API_URL is correct
3. Check image paths in database
4. Try different image format

### Socket Connection Failed

**Problem**: Real-time chat not working

**Solutions**:
1. Verify backend Socket.io is running
2. Check SOCKET_URL in config
3. Ensure JWT token is valid
4. Check network connectivity

### Module Not Found

**Problem**: Import errors or module not found

**Solutions**:
```bash
# Clear cache and reinstall
rm -rf node_modules
npm install

# Clear Metro bundler cache
expo start -c
```

### Android Build Issues

**Problem**: Build fails on Android

**Solutions**:
1. Update Expo SDK: `expo upgrade`
2. Clear gradle cache
3. Check `app.json` configuration
4. Ensure all permissions are declared

## 🔄 API Integration

The app connects to the backend REST API:

```typescript
// Login
const { token, user } = await api.login({ email, password });

// Get next profile
const profile = await api.getNextProfile();

// Send like
const { like, match } = await api.createLike({
  toUserId: 'user-id',
  type: 'PROFILE',
  comment: 'Optional comment'
});

// Send message
const message = await api.sendMessage(matchId, content);
```

See `src/services/api.ts` for all available API functions.

## 🎨 Customization

### Colors

Update colors in screens or create a theme file:

```typescript
const COLORS = {
  primary: '#FF6B6B',
  secondary: '#4ECDC4',
  accent: '#FFE66D',
  background: '#FFFFFF',
  text: '#333333',
};
```

### Fonts

To use custom fonts:

```bash
expo install expo-font
```

Then load fonts in `App.tsx` before rendering.

## 📱 Testing

### Manual Testing

1. Register a new account
2. Complete profile setup
3. Browse discover feed
4. Like profiles/photos/prompts
5. Test matching (need 2 accounts)
6. Test real-time chat
7. Update profile
8. Test logout/login

### Test on Multiple Devices

1. Use Expo Go on physical device
2. Test on both iOS and Android
3. Test different screen sizes
4. Test network conditions

## 🚀 Deployment

### Expo Application Services (EAS)

1. Install EAS CLI:
```bash
npm install -g eas-cli
```

2. Configure EAS:
```bash
eas build:configure
```

3. Build:
```bash
eas build --platform all
```

4. Submit to stores:
```bash
eas submit --platform ios
eas submit --platform android
```

### Standalone App

For standalone apps without Expo:
1. Eject from Expo (not recommended for beginners)
2. Use React Native CLI

## 📝 Environment Variables

While Expo doesn't support `.env` files directly, you can:

1. Use `app.config.js` instead of `app.json`
2. Import environment-specific configs
3. Use EAS Secrets for production

## 🔗 Resources

- [Expo Documentation](https://docs.expo.dev)
- [React Navigation](https://reactnavigation.org)
- [React Native](https://reactnative.dev)
- [Socket.io Client](https://socket.io/docs/v4/client-api/)

## 🤝 Contributing

When adding features:
1. Follow existing code structure
2. Add TypeScript types
3. Test on both iOS and Android
4. Update this README

## 📄 License

MIT

---

Built with ❤️ using React Native and Expo

