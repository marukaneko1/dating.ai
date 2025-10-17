# API Documentation

Complete API reference for the Hinge MVP backend.

**Base URL**: `http://localhost:3001/api`

## Authentication

All protected endpoints require a JWT token in the Authorization header:

```
Authorization: Bearer <token>
```

---

## Auth Endpoints

### Register User

Create a new user account.

**POST** `/auth/register`

**Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "firstName": "John",
  "age": 25,
  "gender": "male",
  "interestedIn": ["female", "non-binary"]
}
```

**Response:** `201 Created`
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "profile": {
      "id": "uuid",
      "firstName": "John",
      "age": 25,
      "gender": "male",
      "interestedIn": ["female", "non-binary"],
      "minAge": 18,
      "maxAge": 99,
      "maxDistance": 50
    }
  }
}
```

---

### Login

Authenticate a user.

**POST** `/auth/login`

**Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:** `200 OK`
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "profile": { ... }
  }
}
```

---

### Get Current User

Get authenticated user's data.

**GET** `/auth/me` 🔒

**Response:** `200 OK`
```json
{
  "id": "uuid",
  "email": "user@example.com",
  "profile": {
    "id": "uuid",
    "firstName": "John",
    "age": 25,
    "bio": "Adventure seeker",
    "location": "New York, NY",
    "gender": "male",
    "interestedIn": ["female"],
    "minAge": 22,
    "maxAge": 32,
    "maxDistance": 25,
    "photos": [...],
    "promptAnswers": [...]
  }
}
```

---

## Profile Endpoints

### Get Profile

Get current user's profile.

**GET** `/profile` 🔒

**Response:** `200 OK`
```json
{
  "id": "uuid",
  "userId": "uuid",
  "firstName": "John",
  "age": 25,
  "bio": "Adventure seeker",
  "location": "New York, NY",
  "gender": "male",
  "interestedIn": ["female"],
  "minAge": 22,
  "maxAge": 32,
  "maxDistance": 25,
  "photos": [
    {
      "id": "uuid",
      "url": "/uploads/photo.jpg",
      "order": 0,
      "createdAt": "2024-01-01T00:00:00Z"
    }
  ],
  "promptAnswers": [
    {
      "id": "uuid",
      "answer": "Traveling to new places",
      "order": 0,
      "prompt": {
        "id": "uuid",
        "text": "I'm overly competitive about...",
        "category": "fun"
      }
    }
  ]
}
```

---

### Update Profile

Update profile information.

**PUT** `/profile` 🔒

**Body:**
```json
{
  "firstName": "John",
  "age": 26,
  "bio": "Updated bio",
  "location": "Brooklyn, NY",
  "minAge": 23,
  "maxAge": 33,
  "maxDistance": 30
}
```

**Response:** `200 OK` (returns updated profile)

---

### Upload Photo

Upload a profile photo.

**POST** `/profile/photos` 🔒

**Content-Type:** `multipart/form-data`

**Body:**
- `photo`: File (JPEG, PNG, WebP, max 5MB)
- `order`: Number (0-5)

**Response:** `201 Created`
```json
{
  "id": "uuid",
  "profileId": "uuid",
  "url": "/uploads/1234567890-photo.jpg",
  "order": 0,
  "createdAt": "2024-01-01T00:00:00Z"
}
```

---

### Delete Photo

Delete a profile photo.

**DELETE** `/profile/photos/:id` 🔒

**Response:** `200 OK`
```json
{
  "message": "Photo deleted"
}
```

---

### Add Prompt Answer

Answer a prompt question.

**POST** `/profile/prompts` 🔒

**Body:**
```json
{
  "promptId": "uuid",
  "answer": "My answer here",
  "order": 0
}
```

**Response:** `201 Created`
```json
{
  "id": "uuid",
  "profileId": "uuid",
  "promptId": "uuid",
  "answer": "My answer here",
  "order": 0,
  "prompt": {
    "id": "uuid",
    "text": "I'm weirdly attracted to...",
    "category": "fun"
  }
}
```

---

### Update Prompt Answer

Update an existing prompt answer.

**PUT** `/profile/prompts/:id` 🔒

**Body:**
```json
{
  "answer": "Updated answer"
}
```

**Response:** `200 OK` (returns updated prompt answer)

---

### Delete Prompt Answer

Delete a prompt answer.

**DELETE** `/profile/prompts/:id` 🔒

**Response:** `200 OK`
```json
{
  "message": "Prompt answer deleted"
}
```

---

## Discovery Endpoints

### Get Next Profile

Get the next profile to review.

**GET** `/discover` 🔒

**Response:** `200 OK`
```json
{
  "id": "uuid",
  "userId": "uuid",
  "firstName": "Jane",
  "age": 24,
  "bio": "Love hiking",
  "location": "Manhattan, NY",
  "gender": "female",
  "photos": [...],
  "promptAnswers": [...],
  "user": {
    "id": "uuid",
    "email": "jane@example.com"
  }
}
```

**Response when no more profiles:** `200 OK`
```json
{
  "message": "No more profiles available"
}
```

---

### Get Available Prompts

Get all available prompt questions.

**GET** `/prompts` 🔒

**Response:** `200 OK`
```json
[
  {
    "id": "uuid",
    "text": "I'm weirdly attracted to...",
    "category": "fun",
    "active": true
  },
  ...
]
```

---

## Like Endpoints

### Create Like

Like a profile, photo, or prompt.

**POST** `/likes` 🔒

**Body for profile like:**
```json
{
  "toUserId": "uuid",
  "type": "PROFILE"
}
```

**Body for photo like:**
```json
{
  "toUserId": "uuid",
  "type": "PHOTO",
  "photoId": "uuid",
  "comment": "Great photo!"
}
```

**Body for prompt like:**
```json
{
  "toUserId": "uuid",
  "type": "PROMPT",
  "promptAnswerId": "uuid",
  "comment": "Love this answer!"
}
```

**Response:** `201 Created`
```json
{
  "like": {
    "id": "uuid",
    "fromUserId": "uuid",
    "toUserId": "uuid",
    "type": "PROFILE",
    "comment": null,
    "createdAt": "2024-01-01T00:00:00Z"
  },
  "match": null
}
```

**Response when match created:**
```json
{
  "like": { ... },
  "match": {
    "id": "uuid",
    "user1Id": "uuid",
    "user2Id": "uuid",
    "createdAt": "2024-01-01T00:00:00Z",
    "user1": { ... },
    "user2": { ... }
  }
}
```

---

### Delete Like

Remove a like.

**DELETE** `/likes/:id` 🔒

**Response:** `200 OK`
```json
{
  "message": "Like removed"
}
```

---

### Get Sent Likes

Get likes you've sent.

**GET** `/likes/sent` 🔒

**Response:** `200 OK`
```json
[
  {
    "id": "uuid",
    "fromUserId": "uuid",
    "toUserId": "uuid",
    "type": "PROFILE",
    "comment": "Love your profile!",
    "createdAt": "2024-01-01T00:00:00Z",
    "toUser": {
      "id": "uuid",
      "profile": { ... }
    }
  },
  ...
]
```

---

### Get Received Likes

Get likes you've received.

**GET** `/likes/received` 🔒

**Response:** `200 OK`
```json
[
  {
    "id": "uuid",
    "fromUserId": "uuid",
    "toUserId": "uuid",
    "type": "PROMPT",
    "comment": "Great answer!",
    "promptAnswerId": "uuid",
    "createdAt": "2024-01-01T00:00:00Z",
    "fromUser": {
      "id": "uuid",
      "profile": { ... }
    },
    "promptAnswer": {
      "id": "uuid",
      "answer": "...",
      "prompt": { ... }
    }
  },
  ...
]
```

---

## Match Endpoints

### Get Matches

Get all your matches.

**GET** `/matches` 🔒

**Response:** `200 OK`
```json
[
  {
    "id": "uuid",
    "user": {
      "id": "uuid",
      "email": "match@example.com",
      "profile": {
        "firstName": "Jane",
        "age": 24,
        "photos": [...]
      }
    },
    "createdAt": "2024-01-01T00:00:00Z",
    "lastMessage": {
      "id": "uuid",
      "content": "Hey!",
      "createdAt": "2024-01-01T00:05:00Z"
    }
  },
  ...
]
```

---

### Delete Match

Unmatch with a user.

**DELETE** `/matches/:id` 🔒

**Response:** `200 OK`
```json
{
  "message": "Match deleted"
}
```

---

## Message Endpoints

### Get Messages

Get all messages in a conversation.

**GET** `/messages/:matchId` 🔒

**Response:** `200 OK`
```json
[
  {
    "id": "uuid",
    "matchId": "uuid",
    "senderId": "uuid",
    "content": "Hey, how are you?",
    "read": true,
    "createdAt": "2024-01-01T00:00:00Z",
    "sender": {
      "id": "uuid",
      "profile": {
        "firstName": "John",
        "photos": [...]
      }
    }
  },
  ...
]
```

---

### Send Message

Send a message to a match.

**POST** `/messages` 🔒

**Body:**
```json
{
  "matchId": "uuid",
  "content": "Hello!"
}
```

**Response:** `201 Created`
```json
{
  "id": "uuid",
  "matchId": "uuid",
  "senderId": "uuid",
  "content": "Hello!",
  "read": false,
  "createdAt": "2024-01-01T00:00:00Z",
  "sender": {
    "id": "uuid",
    "profile": { ... }
  }
}
```

---

### Mark Messages as Read

Mark all messages in a conversation as read.

**PUT** `/messages/:matchId/read` 🔒

**Response:** `200 OK`
```json
{
  "message": "Messages marked as read"
}
```

---

## WebSocket Events

Connect to Socket.io for real-time messaging:

```javascript
const socket = io('http://localhost:3001', {
  auth: { token: 'your-jwt-token' }
});
```

### Client → Server Events

**`joinMatch`**
```javascript
socket.emit('joinMatch', matchId);
```

**`leaveMatch`**
```javascript
socket.emit('leaveMatch', matchId);
```

**`sendMessage`**
```javascript
socket.emit('sendMessage', {
  matchId: 'uuid',
  content: 'Hello!'
});
```

**`typing`**
```javascript
socket.emit('typing', { matchId: 'uuid' });
```

**`stopTyping`**
```javascript
socket.emit('stopTyping', { matchId: 'uuid' });
```

### Server → Client Events

**`newMessage`**
```javascript
socket.on('newMessage', (message) => {
  console.log(message);
});
```

**`userTyping`**
```javascript
socket.on('userTyping', (data) => {
  console.log(`User ${data.userId} is typing in ${data.matchId}`);
});
```

**`userStoppedTyping`**
```javascript
socket.on('userStoppedTyping', (data) => {
  console.log(`User ${data.userId} stopped typing`);
});
```

---

## Error Responses

All errors follow this format:

```json
{
  "error": "Error message here"
}
```

### Common Error Codes

- `400` Bad Request - Invalid input
- `401` Unauthorized - Missing or invalid token
- `404` Not Found - Resource doesn't exist
- `500` Internal Server Error - Server error

---

## Rate Limiting

Currently not implemented. For production, implement rate limiting:
- Authentication: 5 requests per minute
- API calls: 100 requests per minute
- File uploads: 10 per hour

---

## Testing with cURL

**Register:**
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

**Get Profile:**
```bash
curl http://localhost:3001/api/profile \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Upload Photo:**
```bash
curl -X POST http://localhost:3001/api/profile/photos \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "photo=@/path/to/photo.jpg" \
  -F "order=0"
```

---

🔒 = Requires authentication

