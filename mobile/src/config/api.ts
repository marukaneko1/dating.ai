// API Configuration
// Update this based on your environment

// For development:
// - iOS Simulator: use localhost or 127.0.0.1
// - Android Emulator: use 10.0.2.2
// - Physical Device: use your computer's local IP (e.g., 192.168.1.x)

// Current setup for Physical Device
export const API_URL = __DEV__ 
  ? 'http://192.168.1.139:3002'  // Your local IP + new port
  : 'https://your-production-api.com';

// For iOS Simulator, change to: 'http://localhost:3002'
// For Android Emulator, change to: 'http://10.0.2.2:3002'

export const API_BASE_URL = `${API_URL}/api`;
export const SOCKET_URL = API_URL;

