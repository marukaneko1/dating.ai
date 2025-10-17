import { PrismaClient } from '@prisma/client';
import { SendMessageDto } from '../types';

const prisma = new PrismaClient();

export const getMessages = async (userId: string, matchId: string) => {
  // Verify user is part of the match
  const match = await prisma.match.findFirst({
    where: {
      id: matchId,
      OR: [{ user1Id: userId }, { user2Id: userId }],
    },
  });

  if (!match) {
    throw new Error('Match not found or unauthorized');
  }

  return prisma.message.findMany({
    where: { matchId },
    include: {
      sender: {
        include: {
          profile: {
            select: {
              firstName: true,
              photos: {
                orderBy: { order: 'asc' },
                take: 1,
              },
            },
          },
        },
      },
    },
    orderBy: { createdAt: 'asc' },
  });
};

export const sendMessage = async (userId: string, data: SendMessageDto) => {
  const { matchId, content } = data;

  // Verify user is part of the match
  const match = await prisma.match.findFirst({
    where: {
      id: matchId,
      OR: [{ user1Id: userId }, { user2Id: userId }],
    },
  });

  if (!match) {
    throw new Error('Match not found or unauthorized');
  }

  return prisma.message.create({
    data: {
      matchId,
      senderId: userId,
      content,
    },
    include: {
      sender: {
        include: {
          profile: {
            select: {
              firstName: true,
              photos: {
                orderBy: { order: 'asc' },
                take: 1,
              },
            },
          },
        },
      },
    },
  });
};

export const markMessagesAsRead = async (userId: string, matchId: string) => {
  // Verify user is part of the match
  const match = await prisma.match.findFirst({
    where: {
      id: matchId,
      OR: [{ user1Id: userId }, { user2Id: userId }],
    },
  });

  if (!match) {
    throw new Error('Match not found or unauthorized');
  }

  // Mark all messages in this match that were sent to this user as read
  return prisma.message.updateMany({
    where: {
      matchId,
      senderId: { not: userId },
      read: false,
    },
    data: {
      read: true,
    },
  });
};

