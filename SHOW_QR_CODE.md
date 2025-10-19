# 🔍 How to Show QR Code in Expo

## Quick Fix - Press Keys to Show QR

In the terminal where Expo is running, try pressing:

### Option 1: Show QR Code
```
Press: shift + ?
```
This shows the help menu with available commands.

### Option 2: Shift QR Code Display
Look for the QR code - it might have scrolled up! Scroll up in your terminal.

---

## Alternative: Connect Without QR Code

### Method 1: Get the URL Manually

1. In your Expo terminal, look for a line like:
   ```
   exp://xxx.tunnelmole.net:80
   ```
   or
   ```
   Metro waiting on exp://192.168.x.x:8081
   ```

2. Open **Expo Go** app on your phone

3. Tap **"Enter URL manually"**

4. Type the URL you found

---

## Method 2: Use LAN Mode (Shows QR Better)

Stop the current Expo (Ctrl+C) and restart without tunnel:

```bash
cd mobile
npx expo start --clear
```

LAN mode usually displays QR code more reliably!

---

## Method 3: Open Expo in Browser

Press `w` in the Expo terminal to open the developer tools in your browser.
The QR code will be displayed there!

---

## Method 4: Restart Expo with QR Display

```bash
cd mobile

# Stop current expo (Ctrl+C in that terminal)

# Start fresh
npx expo start --clear

# The QR should appear after "Metro waiting on..."
```

---

## 🎯 What You Should See

After "Tunnel ready", you should see something like:

```
› Metro waiting on exp://xxx.tunnelmole.net:80
› Scan the QR code above with Expo Go (Android) or the Camera app (iOS)

█████████████████████████████████
█████████████████████████████████
████ ▄▄▄▄▄ █▀█ █▄▄▀▄█ ▄▄▄▄▄ ████
████ █   █ █▀▀▀█ ▀▄██ █   █ ████
[... QR code continues ...]
```

---

## ✅ Immediate Action

Right now, try this:

1. **Press `?`** in your Expo terminal
2. **Look for** available commands
3. **Scroll up** in terminal to find QR code
4. **OR press `w`** to open in browser


