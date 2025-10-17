import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server } from 'socket.io';
import path from 'path';

import authRoutes from './routes/authRoutes';
import profileRoutes from './routes/profileRoutes';
import discoveryRoutes from './routes/discoveryRoutes';
import promptRoutes from './routes/promptRoutes';
import likeRoutes from './routes/likeRoutes';
import matchRoutes from './routes/matchRoutes';
import messageRoutes from './routes/messageRoutes';
import { errorHandler } from './middleware/errorHandler';
import { verifyToken } from './utils/auth';
import * as messageService from './services/messageService';

dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    methods: ['GET', 'POST'],
  },
});

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/discover', discoveryRoutes);
app.use('/api/prompts', promptRoutes);
app.use('/api/likes', likeRoutes);
app.use('/api/matches', matchRoutes);
app.use('/api/messages', messageRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Error handler
app.use(errorHandler);

// Socket.IO for real-time messaging
io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  if (!token) {
    return next(new Error('Authentication error'));
  }

  try {
    const payload = verifyToken(token);
    socket.data.userId = payload.userId;
    next();
  } catch (error) {
    next(new Error('Authentication error'));
  }
});

io.on('connection', (socket) => {
  console.log('User connected:', socket.data.userId);

  // Join room for user's matches
  socket.join(`user:${socket.data.userId}`);

  // Send message
  socket.on('sendMessage', async (data) => {
    try {
      const message = await messageService.sendMessage(socket.data.userId, {
        matchId: data.matchId,
        content: data.content,
      });

      // Emit to both users in the match
      io.to(`match:${data.matchId}`).emit('newMessage', message);
    } catch (error) {
      socket.emit('error', { message: 'Failed to send message' });
    }
  });

  // Join match room
  socket.on('joinMatch', (matchId: string) => {
    socket.join(`match:${matchId}`);
  });

  // Leave match room
  socket.on('leaveMatch', (matchId: string) => {
    socket.leave(`match:${matchId}`);
  });

  // Typing indicator
  socket.on('typing', (data) => {
    socket.to(`match:${data.matchId}`).emit('userTyping', {
      userId: socket.data.userId,
      matchId: data.matchId,
    });
  });

  socket.on('stopTyping', (data) => {
    socket.to(`match:${data.matchId}`).emit('userStoppedTyping', {
      userId: socket.data.userId,
      matchId: data.matchId,
    });
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.data.userId);
  });
});

const PORT = process.env.PORT || 3001;

httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export { io };

