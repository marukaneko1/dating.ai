# Hinge-Style Dating App MVP

A modern dating application inspired by Hinge, featuring profile prompts, photo likes, intelligent matching, and real-time messaging.

## 🎯 Core Features

### User Experience
- **Authentication**: Secure signup/login with JWT tokens
- **Profile Creation**: 
  - Multiple photo uploads (up to 6 photos)
  - Answer 3 creative prompts from a curated list
  - Basic info (name, age, location, bio, gender, preferences)
- **Discovery Feed**: Browse through potential matches one at a time
- **Engagement System**: 
  - Like entire profiles or specific prompts/photos
  - Add comments when liking prompts or photos
- **Matching**: Mutual likes create matches
- **Messaging**: Real-time chat with matches
- **Preferences**: Set age range, distance, and gender preferences

## 🏗️ Tech Stack

### Backend
- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: JWT with bcrypt
- **File Upload**: Multer
- **Real-time**: Socket.io

### Frontend (Web)
- **Framework**: React 18 with TypeScript
- **Routing**: React Router v6
- **State Management**: React Context + Hooks
- **Styling**: Tailwind CSS
- **HTTP Client**: Axios
- **Real-time**: Socket.io-client

### Mobile (NEW! 📱)
- **Framework**: React Native with Expo SDK 50
- **Navigation**: React Navigation v6 (Stack + Tabs)
- **State Management**: React Context + Hooks
- **Native Features**: Image Picker, Secure Store
- **HTTP Client**: Axios
- **Real-time**: Socket.io-client
- **Platform**: iOS & Android from single codebase

## 📁 Project Structure

```
dating-ai/
├── backend/
│   ├── src/
│   │   ├── controllers/     # Route handlers
│   │   ├── middleware/      # Auth, validation, error handling
│   │   ├── routes/          # API routes
│   │   ├── services/        # Business logic
│   │   ├── types/           # TypeScript types
│   │   ├── utils/           # Helper functions
│   │   └── index.ts         # Entry point
│   ├── prisma/
│   │   └── schema.prisma    # Database schema
│   └── uploads/             # User uploaded photos
├── frontend/
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── contexts/        # React contexts
│   │   ├── pages/           # Page components
│   │   ├── services/        # API services
│   │   ├── types/           # TypeScript types
│   │   └── App.tsx          # Root component
│   └── public/
├── mobile/                  # React Native mobile app (NEW! 📱)
│   ├── src/
│   │   ├── config/          # API configuration
│   │   ├── contexts/        # React contexts
│   │   ├── navigation/      # Navigation setup
│   │   ├── screens/         # Screen components
│   │   ├── services/        # API & socket services
│   │   └── types/           # TypeScript types
│   ├── App.tsx              # Mobile entry point
│   └── app.json             # Expo configuration
├── README.md
├── SETUP.md                 # Web app setup guide
├── MOBILE_SETUP.md          # Mobile app setup guide (NEW!)
├── QUICKSTART.md
├── ARCHITECTURE.md
└── API.md

```

## 🚀 Getting Started

Choose your platform:

### Web Application

**Prerequisites:**
- Node.js 18+ 
- PostgreSQL 14+
- npm or yarn

**Installation:**

1. **Clone and install dependencies**
```bash
npm run install:all
```

2. **Set up PostgreSQL database**
```bash
createdb hinge_mvp
```

3. **Configure environment variables**

Backend (`.env` in `/backend`):
```env
DATABASE_URL="postgresql://username:password@localhost:5432/hinge_mvp"
JWT_SECRET="your-super-secret-jwt-key-change-this"
PORT=3001
NODE_ENV=development
```

Frontend (`.env` in `/frontend`):
```env
VITE_API_URL=http://localhost:3001
```

4. **Run database migrations**
```bash
cd backend
npx prisma migrate dev
npx prisma generate
```

5. **Start the development servers**
```bash
# From root directory
npm run dev
```

The web app will be available at:
- Frontend: http://localhost:5173
- Backend API: http://localhost:3001

### Mobile Application (NEW! 📱)

**Prerequisites:**
- Node.js 18+
- Backend API running (see above)
- iOS Simulator (Mac) or Android Emulator or Physical Device with Expo Go

**Installation:**

1. **Navigate to mobile directory**
```bash
cd mobile
npm install
```

2. **Configure API URL**

Edit `mobile/src/config/api.ts`:
- iOS Simulator: `http://localhost:3001`
- Android Emulator: `http://10.0.2.2:3001`
- Physical Device: `http://YOUR_LOCAL_IP:3001`

3. **Start Expo development server**
```bash
npm start
```

4. **Run on device:**
- iOS: Press `i` for iOS Simulator
- Android: Press `a` for Android Emulator
- Physical: Scan QR code with Expo Go app

📱 **See [MOBILE_SETUP.md](MOBILE_SETUP.md) for detailed mobile setup instructions.**

## 📊 Database Schema

### Core Tables
- **Users**: Authentication and basic user data
- **Profiles**: Extended profile information
- **Photos**: User profile photos
- **Prompts**: Available prompt questions
- **PromptAnswers**: User answers to prompts
- **Likes**: Likes on profiles, photos, or prompts with optional comments
- **Matches**: Mutual likes between users
- **Messages**: Chat messages between matched users

## 🔐 API Endpoints

### Authentication
- `POST /api/auth/register` - Create new account
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get current user

### Profile Management
- `GET /api/profile` - Get current user's profile
- `PUT /api/profile` - Update profile
- `POST /api/profile/photos` - Upload photos
- `DELETE /api/profile/photos/:id` - Delete photo
- `POST /api/profile/prompts` - Add prompt answer
- `PUT /api/profile/prompts/:id` - Update prompt answer
- `DELETE /api/profile/prompts/:id` - Delete prompt answer

### Discovery
- `GET /api/discover` - Get next profile to review
- `GET /api/prompts` - Get available prompts

### Engagement
- `POST /api/likes` - Like a profile/photo/prompt
- `DELETE /api/likes/:id` - Remove like
- `GET /api/likes/sent` - Get likes you've sent
- `GET /api/likes/received` - Get likes you've received

### Matches
- `GET /api/matches` - Get all matches
- `DELETE /api/matches/:id` - Unmatch

### Messages
- `GET /api/messages/:matchId` - Get conversation
- `POST /api/messages` - Send message
- WebSocket: Real-time message delivery

## 🎨 Key UI Components

1. **Auth Flow**: Clean signup/login forms
2. **Profile Builder**: Step-by-step profile creation
3. **Discovery Card**: Swipeable profile cards with photo carousel
4. **Like Modal**: Comment interface when liking specific content
5. **Matches Grid**: Visual grid of all matches
6. **Chat Interface**: Real-time messaging with match
7. **Profile Editor**: Manage photos, prompts, and preferences

## 🔄 User Flow

1. **Onboarding**
   - Sign up with email/password
   - Create profile (photos + prompts + basic info)
   - Set preferences

2. **Discovery**
   - View one profile at a time
   - Scroll through photos and prompt answers
   - Like/comment on specific photos or prompts
   - Or like the entire profile

3. **Matching**
   - When mutual like occurs, match is created
   - Notification of new match
   - Can start messaging immediately

4. **Messaging**
   - Real-time chat with matches
   - View match's profile anytime

## 🔒 Security Features

- Password hashing with bcrypt (10 rounds)
- JWT token-based authentication
- Protected API routes with middleware
- Input validation and sanitization
- File upload restrictions (size, type)
- SQL injection prevention via Prisma

## 🚀 Future Enhancements

- Video prompts
- Voice messages
- Advanced filters (education, height, etc.)
- Icebreaker questions
- Profile verification
- Report/block users
- Dating intentions tags
- Location-based matching with geolocation
- Push notifications
- Email notifications
- Photo moderation/AI safety
- Analytics dashboard

## 📝 MVP Scope

### ✅ What's Included

**Web App:**
- Full-featured responsive web application
- All core Hinge features
- Real-time messaging
- Photo uploads
- Profile management

**Mobile App (NEW!):**
- Native iOS & Android apps via Expo
- Complete feature parity with web
- Native image picker
- Optimized mobile UX
- Push notification ready

### 🔜 Not Yet Included

- Email verification
- Password reset
- Push notifications
- Advanced search/filters
- Video chat
- Photo moderation
- Payment/premium features

## 🧪 Testing

```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test
```

## 📄 License

MIT

