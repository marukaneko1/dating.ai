# Quick Start Guide

Get up and running with Hinge MVP in 5 minutes!

## Prerequisites

- Node.js 18+
- PostgreSQL 14+

## Installation

```bash
# 1. Install all dependencies
npm run install:all

# 2. Create PostgreSQL database
createdb hinge_mvp

# 3. Set up environment variables
cd backend
cp .env.example .env
# Edit .env with your database credentials

cd ../frontend
cp .env.example .env
# Default settings should work

# 4. Run database migrations
cd ../backend
npm run prisma:generate
npm run prisma:migrate
npm run seed

# 5. Start the servers
cd ..
npm run dev
```

## Access

- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:3001

## First Steps

1. Register a new account
2. Complete profile setup (photos + prompts)
3. Start discovering profiles!

## Key Commands

```bash
# Start both servers
npm run dev

# Backend only
cd backend && npm run dev

# Frontend only
cd frontend && npm run dev

# Database GUI
cd backend && npm run prisma:studio

# Reset database
cd backend && npx prisma migrate reset
```

## Troubleshooting

**Port in use**: Change `PORT` in `backend/.env` or `frontend/vite.config.ts`

**Database error**: Check PostgreSQL is running and credentials are correct

**Module error**: Run `npm install` in root, backend, and frontend folders

## Documentation

- **Complete Setup**: See [SETUP.md](SETUP.md)
- **API Reference**: See [API.md](API.md)
- **Architecture**: See [ARCHITECTURE.md](ARCHITECTURE.md)

## Features

✅ User authentication  
✅ Profile with photos and prompts  
✅ Discovery feed  
✅ Like profiles, photos, or prompts  
✅ Matching system  
✅ Real-time chat  
✅ Preferences (age, distance)  

## Need Help?

Check the detailed [SETUP.md](SETUP.md) guide or review [API.md](API.md) for endpoint documentation.

Happy dating! 💕

