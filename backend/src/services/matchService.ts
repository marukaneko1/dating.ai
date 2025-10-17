import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getMatches = async (userId: string) => {
  const matches = await prisma.match.findMany({
    where: {
      OR: [{ user1Id: userId }, { user2Id: userId }],
    },
    include: {
      user1: {
        include: {
          profile: {
            include: {
              photos: {
                orderBy: { order: 'asc' },
                take: 1,
              },
            },
          },
        },
      },
      user2: {
        include: {
          profile: {
            include: {
              photos: {
                orderBy: { order: 'asc' },
                take: 1,
              },
            },
          },
        },
      },
      messages: {
        orderBy: { createdAt: 'desc' },
        take: 1,
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  // Format matches to always return the "other" user
  return matches.map((match) => {
    const otherUser = match.user1Id === userId ? match.user2 : match.user1;
    return {
      id: match.id,
      user: otherUser,
      createdAt: match.createdAt,
      lastMessage: match.messages[0] || null,
    };
  });
};

export const deleteMatch = async (userId: string, matchId: string) => {
  const match = await prisma.match.findFirst({
    where: {
      id: matchId,
      OR: [{ user1Id: userId }, { user2Id: userId }],
    },
  });

  if (!match) {
    throw new Error('Match not found');
  }

  return prisma.match.delete({
    where: { id: matchId },
  });
};

