// API Configuration for Expo Go
// Update this based on your environment

import Constants from 'expo-constants';
import { Platform } from 'react-native';

// Automatically detect the correct API URL based on environment
const getApiUrl = (): string => {
  if (!__DEV__) {
    // Production URL
    return 'https://your-production-api.com';
  }

  // Development - Auto-detect based on platform
  const localhost = Constants.expoConfig?.hostUri?.split(':')[0] || 'localhost';

  if (Platform.OS === 'android') {
    // Android Emulator uses special IP
    return 'http://10.0.2.2:3001';
  }

  if (Platform.OS === 'ios') {
    // iOS Simulator and physical iOS devices can use localhost or local IP
    return `http://${localhost}:3001`;
  }

  // Web fallback
  return 'http://localhost:3001';
};

export const API_URL = getApiUrl();
export const API_BASE_URL = `${API_URL}/api`;
export const SOCKET_URL = API_URL;

// Manual override for physical devices (uncomment and set your IP if needed)
export const API_URL = 'http://192.168.68.80:3001';  // Your local IP

