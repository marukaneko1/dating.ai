import { PrismaClient } from '@prisma/client';
import { CreateLikeDto } from '../types';

const prisma = new PrismaClient();

export const createLike = async (userId: string, data: CreateLikeDto) => {
  const { toUserId, type, photoId, promptAnswerId, comment } = data;

  // Validate like type matches content
  if (type === 'PHOTO' && !photoId) {
    throw new Error('Photo ID required for photo like');
  }
  if (type === 'PROMPT' && !promptAnswerId) {
    throw new Error('Prompt answer ID required for prompt like');
  }

  // Check if already liked
  const existingLike = await prisma.like.findUnique({
    where: {
      fromUserId_toUserId_type_photoId_promptAnswerId: {
        fromUserId: userId,
        toUserId,
        type,
        photoId: photoId !== undefined ? photoId : null,
        promptAnswerId: promptAnswerId !== undefined ? promptAnswerId : null,
      },
    },
  });

  if (existingLike) {
    throw new Error('Already liked');
  }

  // Create like
  const like = await prisma.like.create({
    data: {
      fromUserId: userId,
      toUserId,
      type,
      photoId,
      promptAnswerId,
      comment,
    },
    include: {
      photo: true,
      promptAnswer: {
        include: {
          prompt: true,
        },
      },
    },
  });

  // Check for match (mutual like)
  const reciprocalLike = await prisma.like.findFirst({
    where: {
      fromUserId: toUserId,
      toUserId: userId,
    },
  });

  let match = null;
  if (reciprocalLike) {
    // Create match (ensure user1Id < user2Id for uniqueness)
    const [user1Id, user2Id] =
      userId < toUserId ? [userId, toUserId] : [toUserId, userId];

    // Check if match already exists
    const existingMatch = await prisma.match.findUnique({
      where: {
        user1Id_user2Id: {
          user1Id,
          user2Id,
        },
      },
    });

    if (!existingMatch) {
      match = await prisma.match.create({
        data: {
          user1Id,
          user2Id,
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
        },
      });
    }
  }

  return { like, match };
};

export const deleteLike = async (userId: string, likeId: string) => {
  const like = await prisma.like.findFirst({
    where: {
      id: likeId,
      fromUserId: userId,
    },
  });

  if (!like) {
    throw new Error('Like not found');
  }

  return prisma.like.delete({
    where: { id: likeId },
  });
};

export const getSentLikes = async (userId: string) => {
  return prisma.like.findMany({
    where: { fromUserId: userId },
    include: {
      toUser: {
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
      photo: true,
      promptAnswer: {
        include: {
          prompt: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });
};

export const getReceivedLikes = async (userId: string) => {
  return prisma.like.findMany({
    where: { toUserId: userId },
    include: {
      fromUser: {
        include: {
          profile: {
            include: {
              photos: {
                orderBy: { order: 'asc' },
                take: 1,
              },
              promptAnswers: {
                include: {
                  prompt: true,
                },
                orderBy: { order: 'asc' },
              },
            },
          },
        },
      },
      photo: true,
      promptAnswer: {
        include: {
          prompt: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });
};

