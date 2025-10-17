# 📱 Restart Mobile App (EMFILE Fixed!)

Watchman is now installed! This permanently fixes the EMFILE error.

## 🔄 Restart Mobile App

In your **Terminal 2** where mobile is running:

1. **Press `Ctrl+C`** to stop the current process

2. **Restart Expo:**
```bash
cd /Users/marukaneko/dating-ai/mobile
npm start
```

3. **Wait for QR code** (~20 seconds)

4. **Scan with Expo Go** app on your phone

## ✅ What Should Happen

You should see:
```
✓ No EMFILE errors
✓ QR code appears
✓ Metro bundler running smoothly
✓ "Logs for your project will appear below"
```

## 📱 Then on Your Phone

1. **Open Expo Go** app
2. **Scan the QR code**
3. **Wait** for build (30-60 seconds first time)
4. **Login screen appears!** 🎉

## 🔧 If Still Shows EMFILE

Run this command ONCE in Terminal 2:
```bash
watchman shutdown-server
```

Then restart mobile app.

## ✅ Verify Everything is Ready

**Backend** (Terminal 1):
```bash
curl http://localhost:3002/api/health
# Should return: {"status":"ok"}
```

**From Phone Browser:**
```
http://192.168.1.139:3002/api/health
# Should return: {"status":"ok"}
```

## 🎯 Current Configuration

- **Backend**: `http://192.168.1.139:3002` ✅
- **Mobile API**: `http://192.168.1.139:3002` ✅
- **Your Local IP**: `192.168.1.139` ✅
- **Watchman**: Installed ✅
- **File limit**: Fixed ✅

## 🎉 You're All Set!

Just restart the mobile app and scan the QR code!

Happy dating! 💕

