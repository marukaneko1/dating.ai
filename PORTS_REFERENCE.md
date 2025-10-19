# 📡 Ports Reference Guide

## Port Configuration

| Service | Port | URL |
|---------|------|-----|
| **Backend API** | 3001 | http://localhost:3001 |
| **Frontend Web** | 5173 | http://localhost:5173 |
| **Metro Bundler (Expo)** | 8081 | http://localhost:8081 |
| **Expo Tunnel** | Dynamic | exp://xxx.tunnelmole.net:80 |

---

## ✅ Correct Setup (3 Services)

### Terminal 1: Backend (Port 3001)
```bash
cd backend
npm run dev
```
Expected output: `Server running on port 3001`

### Terminal 2: Mobile (Port 8081)
```bash
cd mobile
npx expo start --tunnel --clear
```
Expected output: `Waiting on http://localhost:8081`

### Terminal 3: Frontend (Optional - Port 5173)
```bash
cd frontend
npm run dev
```
Expected output: `Local: http://localhost:5173`

---

## 🔧 Port Conflicts

### If Port 3001 is Taken (Backend)
```bash
# Find what's using port 3001
lsof -i :3001

# Kill the process (replace PID with actual process ID)
kill -9 <PID>
```

### If Port 8081 is Taken (Expo Metro)
Expo will automatically use the next available port (8082, 8083, etc.)

---

## 🔍 Quick Check - What's Running?

```bash
# Check all ports
lsof -i :3001  # Backend
lsof -i :8081  # Metro
lsof -i :5173  # Frontend
```

---

## 📱 Mobile App Configuration

The mobile app automatically connects to backend at:
- **iOS Simulator**: `http://localhost:3001`
- **Android Emulator**: `http://10.0.2.2:3001`
- **Physical Device**: Auto-detected or manual override

To manually set (if needed), edit `mobile/src/config/api.ts`:
```typescript
export const API_URL = 'http://YOUR_LOCAL_IP:3001';
```

---

## ✅ Verify Everything is Running

```bash
# Check backend
curl http://localhost:3001/api/health

# Should return: {"status":"ok"}
```

---

## 🆘 Common Issues

### "Port 3001 already in use"
Someone is using the backend port. Kill it:
```bash
lsof -i :3001
kill -9 <PID>
```

### "Unable to connect to Metro"
Clear cache and restart:
```bash
cd mobile
rm -rf .expo node_modules/.cache
npx expo start --clear
```

### Mobile app can't reach backend
1. Ensure backend is running on port 3001
2. Check `mobile/src/config/api.ts` has correct URL
3. Ensure phone and computer on same WiFi


