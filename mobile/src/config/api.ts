// API Configuration
// Update this based on your environment

// For development:
// - iOS Simulator: use localhost or 127.0.0.1
// - Android Emulator: use 10.0.2.2
// - Physical Device: use your computer's local IP (e.g., 192.168.1.x)

export const API_URL = __DEV__ 
  ? 'http://localhost:3001'  // Change to your backend URL
  : 'https://your-production-api.com';

export const API_BASE_URL = `${API_URL}/api`;
export const SOCKET_URL = API_URL;

