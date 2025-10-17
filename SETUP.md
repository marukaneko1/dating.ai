# Hinge MVP - Complete Setup Guide

This guide will walk you through setting up the complete Hinge-style dating app from scratch.

## Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **PostgreSQL** (v14 or higher) - [Download](https://www.postgresql.org/download/)
- **npm** or **yarn**

## Step-by-Step Setup

### 1. Install Dependencies

From the root directory, run:

```bash
npm run install:all
```

This will install dependencies for both frontend and backend.

### 2. Database Setup

#### Create Database

Using PostgreSQL command line or GUI tool:

```bash
# Using psql
createdb hinge_mvp

# Or using PostgreSQL GUI (pgAdmin, Postico, etc.)
# Create a new database named "hinge_mvp"
```

### 3. Environment Configuration

#### Backend Environment

Create `/backend/.env`:

```bash
cd backend
cp .env.example .env
```

Edit `/backend/.env` with your settings:

```env
DATABASE_URL="postgresql://USERNAME:PASSWORD@localhost:5432/hinge_mvp"
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
PORT=3001
NODE_ENV=development
```

**Replace:**
- `USERNAME` with your PostgreSQL username (often `postgres`)
- `PASSWORD` with your PostgreSQL password

#### Frontend Environment

Create `/frontend/.env`:

```bash
cd ../frontend
cp .env.example .env
```

The default should work:

```env
VITE_API_URL=http://localhost:3001
```

### 4. Database Migrations & Seeding

From the `/backend` directory:

```bash
cd backend

# Generate Prisma Client
npm run prisma:generate

# Run migrations to create tables
npm run prisma:migrate

# When prompted for migration name, enter: "init"

# Seed the database with initial prompts
npm run seed
```

You should see: "Created 30 prompts"

### 5. Start Development Servers

You can start both servers from the root directory:

```bash
# From root directory
npm run dev
```

Or start them separately:

```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

### 6. Access the Application

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3001
- **API Health Check**: http://localhost:3001/api/health

## Initial Usage

### Create Your First Account

1. Go to http://localhost:5173
2. Click "Sign up"
3. Fill in the registration form:
   - Email
   - Password (minimum 6 characters)
   - First name
   - Age (18+)
   - Gender
   - Gender preferences
4. Click "Sign up"

### Complete Your Profile

After registration, you'll be taken through a 3-step profile setup:

1. **Add Photos**: Upload 2-6 photos
2. **Answer Prompts**: Select and answer 3 prompts
3. **Add Details**: Add bio and location

### Explore the App

- **Discover**: Browse and like other profiles
- **Likes**: See who liked you and who you liked
- **Matches**: View all your matches
- **Chat**: Message your matches
- **Profile**: Edit your profile and preferences

## Testing with Multiple Users

To test the matching and messaging features:

1. Register a second user in an incognito/private browser window
2. Complete their profile
3. Have each user like the other
4. When both users like each other, they'll match!
5. Start chatting in the Matches section

## Useful Development Commands

### Backend

```bash
cd backend

# Start development server with auto-reload
npm run dev

# View/edit database with Prisma Studio GUI
npm run prisma:studio

# Create a new migration after schema changes
npm run prisma:migrate

# Regenerate Prisma Client after schema changes
npm run prisma:generate

# Re-seed the database
npm run seed
```

### Frontend

```bash
cd frontend

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Database Management

### View Data with Prisma Studio

```bash
cd backend
npm run prisma:studio
```

This opens a GUI at http://localhost:5555 where you can:
- View all tables and data
- Add/edit/delete records
- Test queries

### Reset Database

If you need to start fresh:

```bash
cd backend

# Drop all tables and re-run migrations
npx prisma migrate reset

# Re-seed prompts
npm run seed
```

**Warning**: This deletes ALL data!

## Troubleshooting

### Port Already in Use

If port 3001 or 5173 is already in use:

**Backend**: Change `PORT` in `/backend/.env`
**Frontend**: Change port in `/frontend/vite.config.ts`

### Database Connection Errors

Check:
1. PostgreSQL is running
2. Database exists (`hinge_mvp`)
3. Credentials in `DATABASE_URL` are correct
4. Database server is accessible

Test connection:
```bash
psql -U USERNAME -d hinge_mvp
```

### Module Not Found Errors

Reinstall dependencies:

```bash
# Root
npm install

# Backend
cd backend && npm install

# Frontend
cd frontend && npm install
```

### Prisma Client Errors

Regenerate Prisma Client:

```bash
cd backend
npm run prisma:generate
```

### Photo Upload Issues

Ensure `/backend/uploads/` directory exists and is writable.

### Socket Connection Issues

1. Check backend is running
2. Verify `VITE_API_URL` in frontend `.env`
3. Check browser console for WebSocket errors

## Project Structure

```
dating-ai/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma      # Database schema
│   │   └── seed.ts            # Seed data
│   ├── src/
│   │   ├── controllers/       # Request handlers
│   │   ├── middleware/        # Express middleware
│   │   ├── routes/            # API routes
│   │   ├── services/          # Business logic
│   │   ├── types/             # TypeScript types
│   │   ├── utils/             # Helper functions
│   │   └── index.ts           # Server entry point
│   └── uploads/               # User photos
├── frontend/
│   └── src/
│       ├── components/        # React components
│       ├── contexts/          # React contexts
│       ├── pages/             # Page components
│       ├── services/          # API & socket services
│       ├── types/             # TypeScript types
│       ├── App.tsx            # Root component
│       └── main.tsx           # Entry point
└── README.md
```

## Production Deployment

Before deploying to production:

1. **Environment Variables**:
   - Set strong `JWT_SECRET`
   - Use production database URL
   - Set `NODE_ENV=production`

2. **Database**:
   - Use managed PostgreSQL (AWS RDS, Heroku Postgres, etc.)
   - Run migrations: `npx prisma migrate deploy`

3. **Backend**:
   - Build: `npm run build`
   - Start: `npm start`
   - Use process manager (PM2, systemd)

4. **Frontend**:
   - Build: `npm run build`
   - Serve `dist/` folder with nginx or CDN
   - Update `VITE_API_URL` to production API URL

5. **File Storage**:
   - Use S3 or similar for photo uploads (not local filesystem)

6. **Security**:
   - Enable HTTPS
   - Set up CORS properly
   - Add rate limiting
   - Implement file upload validation

## Need Help?

Common issues and solutions:

1. **"Cannot connect to database"**: Check PostgreSQL is running and credentials are correct
2. **"Port already in use"**: Change port in env files or kill existing process
3. **"Token expired"**: Login again to get new token
4. **Photos not loading**: Check `VITE_API_URL` and backend uploads directory

## Next Steps

After basic setup:

1. Add more prompts via Prisma Studio or seed script
2. Test all features with multiple accounts
3. Customize styling in Tailwind config
4. Add profile verification features
5. Implement advanced filters
6. Add email notifications
7. Deploy to production!

Enjoy building with Hinge MVP! 🎉

