# Architecture Overview

This document provides a comprehensive overview of the Hinge MVP architecture, design decisions, and implementation details.

## System Architecture

### High-Level Architecture

```
┌─────────────┐         ┌─────────────┐         ┌──────────────┐
│   Browser   │ ◄─────► │   Backend   │ ◄─────► │  PostgreSQL  │
│  (React)    │  HTTP   │  (Express)  │   ORM   │   Database   │
└─────────────┘         └─────────────┘         └──────────────┘
       │                       │
       │                       │
       └───────────────────────┘
            WebSocket
          (Socket.io)
```

### Tech Stack Rationale

#### Backend

- **Node.js + TypeScript**: Type safety, excellent async support, large ecosystem
- **Express.js**: Lightweight, flexible, widely adopted
- **Prisma ORM**: Type-safe database queries, excellent migration system
- **PostgreSQL**: ACID compliant, robust, excellent JSON support
- **Socket.io**: Real-time bidirectional communication for messaging
- **JWT**: Stateless authentication, scalable
- **bcrypt**: Industry-standard password hashing

#### Frontend

- **React 18**: Component-based, virtual DOM, huge ecosystem
- **TypeScript**: Type safety prevents bugs, better DX
- **Vite**: Fast dev server, optimized builds
- **React Router v6**: Client-side routing
- **Axios**: Promise-based HTTP client, interceptors
- **Tailwind CSS**: Utility-first, fast development, consistent design
- **Socket.io-client**: Real-time messaging

## Database Schema

### Core Entities

#### Users
- Authentication credentials
- One-to-one with Profile

#### Profiles
- Extended user information
- Demographics and preferences
- One-to-many with Photos and PromptAnswers

#### Photos
- Profile pictures
- Ordered display
- Can be liked individually

#### Prompts
- Predefined questions
- Categorized for variety

#### PromptAnswers
- User responses to prompts
- Can be liked individually
- Limited to 3 per profile

#### Likes
- Polymorphic: can like profile, photo, or prompt
- Optional comment for engagement
- Triggers match on reciprocal like

#### Matches
- Created when mutual likes exist
- Normalized (user1Id < user2Id)
- One-to-many with Messages

#### Messages
- Real-time chat
- Read receipts
- Ordered by timestamp

### Database Design Decisions

1. **Normalized Schema**: Reduces redundancy, maintains data integrity
2. **UUID Primary Keys**: Better for distributed systems, security
3. **Composite Unique Indexes**: Prevent duplicate likes
4. **Cascade Deletes**: Automatic cleanup of related data
5. **Timestamps**: Track creation/updates for all entities
6. **Array Fields**: PostgreSQL arrays for `interestedIn` (efficient, indexed)

## API Design

### RESTful Endpoints

Following REST principles:
- **Resources**: Users, Profiles, Likes, Matches, Messages
- **Methods**: GET (read), POST (create), PUT (update), DELETE (remove)
- **Status Codes**: 200 (OK), 201 (Created), 400 (Bad Request), 401 (Unauthorized), 404 (Not Found)

### Authentication Flow

```
1. User registers → Backend hashes password → Stores in DB
2. Returns JWT token
3. Frontend stores token in localStorage
4. Subsequent requests include token in Authorization header
5. Middleware validates token on protected routes
```

### Error Handling

- Centralized error handler middleware
- Consistent error response format
- Development vs production error messages

## Real-Time Messaging

### Socket.io Implementation

1. **Connection**: Client connects with JWT token
2. **Authentication**: Server validates token in handshake
3. **Rooms**: Each match has a dedicated room
4. **Events**:
   - `sendMessage`: Client sends message
   - `newMessage`: Server broadcasts to room
   - `typing`: Real-time typing indicators
   - `joinMatch`/`leaveMatch`: Room management

### Message Delivery

1. Client sends message via Socket.io
2. Server validates and saves to database
3. Server broadcasts to match room
4. Both clients receive message in real-time
5. Fallback: HTTP polling if WebSocket fails

## Frontend Architecture

### Component Structure

```
App
├── AuthProvider (Context)
├── Router
    ├── Layout (Header + Navigation)
    │   ├── Discover (Main feed)
    │   ├── Likes (Sent/Received)
    │   ├── Matches (Grid view)
    │   ├── Chat (Real-time messaging)
    │   └── Profile (User settings)
    ├── Login
    ├── Register
    └── ProfileSetup (Onboarding)
```

### State Management

- **React Context**: Global auth state
- **Local State**: Component-specific state
- **No Redux**: Unnecessary for MVP scope

### Routing Strategy

- **Protected Routes**: Require authentication
- **Public Routes**: Login, Register
- **Redirect Logic**: Authenticated users redirected away from auth pages

## Security Considerations

### Implemented

1. **Password Hashing**: bcrypt with 10 salt rounds
2. **JWT Authentication**: 7-day expiration
3. **Input Validation**: Express-validator on endpoints
4. **SQL Injection Prevention**: Prisma parameterized queries
5. **File Upload Restrictions**: Type and size limits
6. **CORS Configuration**: Restrict origins
7. **Authorization Checks**: Verify ownership before actions

### Not Implemented (Production TODO)

1. Rate limiting
2. Email verification
3. Password reset flow
4. Account lockout after failed attempts
5. HTTPS enforcement
6. CSP headers
7. XSS protection
8. CSRF tokens
9. Input sanitization
10. File content validation

## Scalability Considerations

### Current Limitations

- **Single Server**: No horizontal scaling
- **Local File Storage**: Photos stored on server
- **In-Memory Sessions**: Socket.io in single process
- **No Caching**: Direct database queries

### Scaling Path

1. **Load Balancing**: nginx reverse proxy
2. **Database**: Read replicas, connection pooling
3. **File Storage**: S3 or CDN
4. **Caching**: Redis for sessions, frequently accessed data
5. **Message Queue**: RabbitMQ for background jobs
6. **Microservices**: Separate services for messaging, media, etc.

## Discovery Algorithm

### Current Implementation

1. Fetch user preferences (age, gender, distance)
2. Query profiles matching criteria
3. Exclude already liked users
4. Filter by distance if coordinates available
5. Randomize from top 10 results
6. Return one profile at a time

### Future Improvements

- **Machine Learning**: Recommend based on past likes
- **Compatibility Score**: Match based on interests, values
- **Activity Boost**: Show active users first
- **Dealbreakers**: Hard filters (smoking, religion, etc.)
- **Smart Shuffling**: Prevent showing same users repeatedly

## Matching Logic

### Match Creation

```javascript
1. User A likes User B
2. Check if User B has already liked User A
3. If yes:
   a. Create Match (normalize: smaller ID as user1)
   b. Check for existing match (prevent duplicates)
   c. Return match object
   d. Frontend shows "It's a match!" notification
4. If no:
   a. Store like
   b. User B will see like in "Received" tab
   c. Can like back to create match
```

### Match Uniqueness

- Composite unique index on `(user1Id, user2Id)`
- Always store smaller ID first
- Prevents duplicate matches

## Performance Optimizations

### Database

- **Indexes**: On foreign keys, lookup fields
- **Query Optimization**: Include related data in single query
- **Pagination**: Limit results (e.g., 50 profiles for discovery)

### Frontend

- **Code Splitting**: Route-based lazy loading (future)
- **Image Optimization**: Compressed uploads (future)
- **Memoization**: Prevent unnecessary re-renders (future)

### Backend

- **Connection Pooling**: Prisma manages connections
- **Async Operations**: Non-blocking I/O throughout

## Testing Strategy (Future)

### Unit Tests

- Service layer functions
- Utility functions
- Component logic

### Integration Tests

- API endpoints
- Database operations
- Authentication flow

### E2E Tests

- User registration/login
- Profile creation
- Like/match flow
- Messaging

## Deployment Architecture

### Development

- Local PostgreSQL
- Two dev servers (backend + frontend)
- Hot reload for rapid development

### Production

```
┌──────────┐
│   CDN    │ (Frontend static files)
└────┬─────┘
     │
┌────▼──────────────┐
│  Load Balancer    │
└────┬──────────────┘
     │
     ├──► Backend Server 1 ─┐
     ├──► Backend Server 2 ─┼──► PostgreSQL (RDS)
     └──► Backend Server N ─┘      │
                                    ├──► S3 (Photos)
                                    └──► Redis (Cache)
```

## Monitoring & Logging

### Recommended (Not Implemented)

- **Application Monitoring**: New Relic, Datadog
- **Error Tracking**: Sentry
- **Logging**: Winston, Papertrail
- **Analytics**: Mixpanel, Amplitude
- **Uptime Monitoring**: Pingdom, UptimeRobot

## Future Features

### Short Term

1. Email notifications
2. Push notifications
3. Profile verification badges
4. Report/block users
5. Undo last pass
6. Super like feature

### Medium Term

1. Video prompts
2. Voice messages
3. Video calls
4. Advanced filters
5. Dealbreakers
6. Dating intentions tags
7. Profile completion score

### Long Term

1. AI-powered matching
2. Events and group dates
3. Premium features
4. Success stories
5. Dating coach integration
6. Location-based check-ins

## Code Organization

### Backend

- **Controllers**: Handle HTTP requests, minimal logic
- **Services**: Business logic, database operations
- **Middleware**: Cross-cutting concerns (auth, validation, errors)
- **Routes**: Define endpoints
- **Utils**: Helper functions
- **Types**: TypeScript interfaces

### Frontend

- **Pages**: Full-page components
- **Components**: Reusable UI elements
- **Contexts**: Global state
- **Services**: API and socket communication
- **Types**: TypeScript interfaces

## Development Workflow

1. **Schema Changes**: Update `schema.prisma` → migrate → generate client
2. **New Feature**: Backend (service → controller → route) → Frontend (service → page/component)
3. **Testing**: Manual testing in dev, automated tests in future
4. **Deployment**: Build → migrate → deploy

## Key Design Patterns

1. **MVC**: Separation of concerns
2. **Repository Pattern**: Database abstraction via services
3. **Middleware Pattern**: Request/response pipeline
4. **Context Pattern**: React global state
5. **Factory Pattern**: Prisma client instantiation

## Lessons Learned & Best Practices

1. **Type Safety**: TypeScript caught many bugs early
2. **Migrations**: Always test migrations on copy of prod data
3. **Auth**: Separate auth logic early
4. **Real-time**: Socket.io simpler than implementing from scratch
5. **File Uploads**: Consider cloud storage from start
6. **Error Handling**: Consistent error format crucial
7. **Documentation**: Document as you build

## Resources & References

- [Prisma Documentation](https://www.prisma.io/docs)
- [Express.js Guide](https://expressjs.com/en/guide/routing.html)
- [React Documentation](https://react.dev)
- [Socket.io Documentation](https://socket.io/docs/v4/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [JWT Best Practices](https://tools.ietf.org/html/rfc8725)

## Contributing Guidelines

When extending this MVP:

1. Follow existing code structure
2. Add TypeScript types for new features
3. Update Prisma schema for database changes
4. Document API endpoints in README
5. Test with multiple user accounts
6. Consider mobile responsiveness
7. Add error handling
8. Update this architecture doc for major changes

