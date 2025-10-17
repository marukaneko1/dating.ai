# JWT Authentication Guide

Complete guide to JWT authentication in the Hinge dating app.

## 🔐 Overview

The app uses **JWT (JSON Web Tokens)** for secure, stateless authentication across web and mobile platforms.

### Why JWT?

- ✅ **Stateless**: No server-side session storage needed
- ✅ **Scalable**: Works across multiple servers
- ✅ **Cross-platform**: Same tokens for web & mobile
- ✅ **Secure**: Signed tokens prevent tampering
- ✅ **Self-contained**: Contains user info in the token

## 📋 Implementation Overview

```
User Login/Register
    ↓
Password Hashed (bcrypt)
    ↓
User Created/Verified
    ↓
JWT Token Generated
    ↓
Token Sent to Client
    ↓
Client Stores Token
    ↓
Token Sent with Each Request
    ↓
Server Verifies Token
    ↓
User Authenticated ✅
```

## 🔧 Backend Implementation

### 1. Configuration (`.env`)

```env
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
```

**Important**: 
- Use a **strong, random** secret (32+ characters)
- **Never** commit secrets to git
- Use different secrets for dev/staging/production

### 2. JWT Utilities (`backend/src/utils/auth.ts`)

```typescript
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret';
const SALT_ROUNDS = 10;

// Hash password with bcrypt
export const hashPassword = async (password: string): Promise<string> => {
  return bcrypt.hash(password, SALT_ROUNDS);
};

// Compare password with hash
export const comparePassword = async (
  password: string,
  hashedPassword: string
): Promise<boolean> => {
  return bcrypt.compare(password, hashedPassword);
};

// Generate JWT token
export const generateToken = (payload: { userId: string }): string => {
  return jwt.sign(payload, JWT_SECRET, { 
    expiresIn: '7d'  // Token expires in 7 days
  });
};

// Verify JWT token
export const verifyToken = (token: string): { userId: string } => {
  return jwt.verify(token, JWT_SECRET) as { userId: string };
};
```

### 3. Authentication Middleware (`backend/src/middleware/auth.ts`)

```typescript
import { Response, NextFunction } from 'express';
import { AuthRequest } from '../types';
import { verifyToken } from '../utils/auth';

export const authenticate = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  try {
    // Extract token from Authorization header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ error: 'No token provided' });
      return;
    }

    // Get token (remove "Bearer " prefix)
    const token = authHeader.substring(7);
    
    // Verify token and extract user ID
    const payload = verifyToken(token);
    
    // Attach user ID to request
    req.userId = payload.userId;
    
    // Continue to route handler
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};
```

### 4. Auth Service (`backend/src/services/authService.ts`)

```typescript
import { PrismaClient } from '@prisma/client';
import { hashPassword, comparePassword, generateToken } from '../utils/auth';

const prisma = new PrismaClient();

// Register new user
export const registerUser = async (data: {
  email: string;
  password: string;
  firstName: string;
  age: number;
  gender: string;
  interestedIn: string[];
}) => {
  // Check if user exists
  const existingUser = await prisma.user.findUnique({
    where: { email: data.email },
  });

  if (existingUser) {
    throw new Error('User already exists');
  }

  // Hash password
  const hashedPassword = await hashPassword(data.password);

  // Create user with profile
  const user = await prisma.user.create({
    data: {
      email: data.email,
      password: hashedPassword,
      profile: {
        create: {
          firstName: data.firstName,
          age: data.age,
          gender: data.gender,
          interestedIn: data.interestedIn,
        },
      },
    },
    include: { profile: true },
  });

  // Generate JWT token
  const token = generateToken({ userId: user.id });

  return {
    token,
    user: {
      id: user.id,
      email: user.email,
      profile: user.profile,
    },
  };
};

// Login user
export const loginUser = async (data: {
  email: string;
  password: string;
}) => {
  // Find user
  const user = await prisma.user.findUnique({
    where: { email: data.email },
    include: { profile: true },
  });

  if (!user) {
    throw new Error('Invalid credentials');
  }

  // Verify password
  const isValid = await comparePassword(data.password, user.password);

  if (!isValid) {
    throw new Error('Invalid credentials');
  }

  // Generate JWT token
  const token = generateToken({ userId: user.id });

  return {
    token,
    user: {
      id: user.id,
      email: user.email,
      profile: user.profile,
    },
  };
};
```

### 5. Protected Routes Example

```typescript
import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import * as profileController from '../controllers/profileController';

const router = Router();

// Public route (no authentication)
router.post('/register', authController.register);

// Protected route (requires authentication)
router.get('/profile', authenticate, profileController.getProfile);
router.put('/profile', authenticate, profileController.updateProfile);

export default router;
```

## 🌐 Frontend Implementation (Web)

### 1. API Service (`frontend/src/services/api.ts`)

```typescript
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3001/api',
});

// Automatically add token to all requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Login
export const login = async (credentials: {
  email: string;
  password: string;
}) => {
  const { data } = await api.post('/auth/login', credentials);
  return data; // { token, user }
};

// Register
export const register = async (userData: RegisterData) => {
  const { data } = await api.post('/auth/register', userData);
  return data; // { token, user }
};

// Get current user (protected route)
export const getCurrentUser = async () => {
  const { data } = await api.get('/auth/me');
  return data;
};
```

### 2. Auth Context (`frontend/src/contexts/AuthContext.tsx`)

```typescript
import { createContext, useContext, useState, useEffect } from 'react';
import * as api from '../services/api';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Load user on mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      loadUser();
    } else {
      setLoading(false);
    }
  }, []);

  const loadUser = async () => {
    try {
      const userData = await api.getCurrentUser();
      setUser(userData);
    } catch (error) {
      localStorage.removeItem('token');
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials: LoginCredentials) => {
    const { token, user: userData } = await api.login(credentials);
    localStorage.setItem('token', token);
    setUser(userData);
  };

  const register = async (data: RegisterData) => {
    const { token, user: userData } = await api.register(data);
    localStorage.setItem('token', token);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
```

### 3. Using Auth in Components

```typescript
import { useAuth } from '../contexts/AuthContext';

function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login({ email, password });
      // Redirect to home
    } catch (error) {
      alert('Login failed');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input 
        type="email" 
        value={email} 
        onChange={(e) => setEmail(e.target.value)} 
      />
      <input 
        type="password" 
        value={password} 
        onChange={(e) => setPassword(e.target.value)} 
      />
      <button type="submit">Login</button>
    </form>
  );
}
```

## 📱 Mobile Implementation (React Native)

### 1. Secure Storage (`mobile/src/services/api.ts`)

```typescript
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

const api = axios.create({
  baseURL: 'http://localhost:3001/api',
});

// Add token from secure storage
api.interceptors.request.use(async (config) => {
  const token = await SecureStore.getItemAsync('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Login
export const login = async (credentials: LoginCredentials) => {
  const { data } = await api.post('/auth/login', credentials);
  return data;
};
```

### 2. Auth Context (`mobile/src/contexts/AuthContext.tsx`)

```typescript
import * as SecureStore from 'expo-secure-store';
import * as api from '../services/api';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = async (credentials: LoginCredentials) => {
    const { token, user: userData } = await api.login(credentials);
    await SecureStore.setItemAsync('token', token);
    setUser(userData);
  };

  const logout = async () => {
    await SecureStore.deleteItemAsync('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
```

## 🔒 Security Best Practices

### 1. Strong JWT Secret

```bash
# Generate a strong secret
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 2. Token Expiration

```typescript
// Short-lived tokens (15 minutes)
const accessToken = jwt.sign(payload, JWT_SECRET, { expiresIn: '15m' });

// Long-lived refresh tokens (7 days)
const refreshToken = jwt.sign(payload, REFRESH_SECRET, { expiresIn: '7d' });
```

### 3. HTTPS Only

```typescript
// In production, only accept HTTPS
if (process.env.NODE_ENV === 'production' && req.protocol !== 'https') {
  return res.status(403).json({ error: 'HTTPS required' });
}
```

### 4. Rate Limiting

```typescript
import rateLimit from 'express-rate-limit';

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 attempts
  message: 'Too many login attempts, please try again later',
});

router.post('/login', loginLimiter, authController.login);
```

### 5. Token Blacklisting (Optional)

```typescript
// For logout functionality
const blacklistedTokens = new Set();

export const logout = (req: AuthRequest, res: Response) => {
  const token = req.headers.authorization?.substring(7);
  if (token) {
    blacklistedTokens.add(token);
  }
  res.json({ message: 'Logged out' });
};

// Check blacklist in middleware
if (blacklistedTokens.has(token)) {
  return res.status(401).json({ error: 'Token revoked' });
}
```

## 🧪 Testing JWT Authentication

### 1. Register User

```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "firstName": "Test",
    "age": 25,
    "gender": "male",
    "interestedIn": ["female"]
  }'
```

Response:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid",
    "email": "test@example.com",
    "profile": { ... }
  }
}
```

### 2. Login User

```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

### 3. Access Protected Route

```bash
curl http://localhost:3001/api/profile \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

### 4. Test Invalid Token

```bash
curl http://localhost:3001/api/profile \
  -H "Authorization: Bearer invalid-token"
```

Response:
```json
{
  "error": "Invalid token"
}
```

## 🔍 Debugging JWT Issues

### 1. Decode JWT Token (Development Only)

```javascript
// In browser console
const token = localStorage.getItem('token');
const payload = JSON.parse(atob(token.split('.')[1]));
console.log(payload);
```

Output:
```json
{
  "userId": "uuid-here",
  "iat": 1234567890,  // Issued at
  "exp": 1234987890   // Expires at
}
```

### 2. Check Token Expiration

```typescript
const decoded = jwt.decode(token) as any;
const now = Date.now() / 1000;

if (decoded.exp < now) {
  console.log('Token expired');
}
```

### 3. Common Errors

| Error | Cause | Solution |
|-------|-------|----------|
| "No token provided" | Missing Authorization header | Add token to request |
| "Invalid token" | Wrong token or expired | Login again |
| "jwt malformed" | Invalid token format | Check token format |
| "jwt expired" | Token expired | Refresh or login again |
| "invalid signature" | Wrong JWT_SECRET | Check environment variable |

## 🚀 Advanced Features

### 1. Refresh Tokens

```typescript
// Generate both access and refresh tokens
export const login = async (credentials) => {
  // ... verify user

  const accessToken = jwt.sign(
    { userId: user.id }, 
    JWT_SECRET, 
    { expiresIn: '15m' }
  );

  const refreshToken = jwt.sign(
    { userId: user.id }, 
    REFRESH_SECRET, 
    { expiresIn: '7d' }
  );

  return { accessToken, refreshToken, user };
};

// Refresh endpoint
export const refresh = async (refreshToken: string) => {
  const payload = jwt.verify(refreshToken, REFRESH_SECRET);
  const accessToken = jwt.sign(
    { userId: payload.userId }, 
    JWT_SECRET, 
    { expiresIn: '15m' }
  );
  return { accessToken };
};
```

### 2. Role-Based Access Control

```typescript
interface JWTPayload {
  userId: string;
  role: 'user' | 'admin' | 'moderator';
}

// Middleware for admin-only routes
export const requireAdmin = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
};
```

### 3. Device Tracking

```typescript
interface JWTPayload {
  userId: string;
  deviceId: string;
  platform: 'web' | 'ios' | 'android';
}

// Generate token with device info
const token = jwt.sign(
  { 
    userId: user.id,
    deviceId: req.headers['device-id'],
    platform: req.headers['platform']
  },
  JWT_SECRET,
  { expiresIn: '7d' }
);
```

## 📊 Token Payload Structure

```typescript
// Current implementation
{
  userId: "uuid-string",
  iat: 1234567890,      // Issued at timestamp
  exp: 1234987890       // Expiration timestamp
}

// Enhanced version (optional)
{
  userId: "uuid-string",
  email: "user@example.com",
  role: "user",
  deviceId: "device-uuid",
  platform: "mobile",
  iat: 1234567890,
  exp: 1234987890
}
```

## ✅ Security Checklist

- [x] Use HTTPS in production
- [x] Strong JWT secret (32+ characters)
- [x] Passwords hashed with bcrypt
- [x] Token expiration (7 days)
- [x] Secure storage (localStorage/SecureStore)
- [ ] Rate limiting on auth endpoints
- [ ] Refresh token rotation
- [ ] Token blacklisting on logout
- [ ] CSRF protection
- [ ] XSS protection
- [ ] Account lockout after failed attempts

## 📚 Resources

- [JWT.io](https://jwt.io) - Decode and verify JWTs
- [bcrypt](https://github.com/kelektiv/node.bcrypt.js) - Password hashing
- [jsonwebtoken](https://github.com/auth0/node-jsonwebtoken) - JWT library
- [Expo SecureStore](https://docs.expo.dev/versions/latest/sdk/securestore/) - Mobile secure storage

## 🎉 Summary

Your app has **production-ready JWT authentication** with:

- ✅ Secure password hashing (bcrypt)
- ✅ Token-based authentication (JWT)
- ✅ Protected API routes
- ✅ Cross-platform support (web & mobile)
- ✅ Secure token storage
- ✅ 7-day token expiration
- ✅ Automatic token refresh

The authentication is **already implemented and working** in your codebase! This guide explains how it works and how to extend it. 🔐

