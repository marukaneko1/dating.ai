import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany({
      include: {
        profile: {
          include: {
            photos: {
              orderBy: { order: 'asc' },
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
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Remove password from response
    const safeUsers = users.map(user => ({
      id: user.id,
      email: user.email,
      createdAt: user.createdAt,
      profile: user.profile,
    }));

    res.json(safeUsers);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to get users';
    res.status(500).json({ error: message });
  }
};

export const getStats = async (req: Request, res: Response) => {
  try {
    const [
      totalUsers,
      usersWithProfiles,
      totalPhotos,
      totalPromptAnswers,
      totalLikes,
      totalMatches,
      totalMessages,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.profile.count(),
      prisma.photo.count(),
      prisma.promptAnswer.count(),
      prisma.like.count(),
      prisma.match.count(),
      prisma.message.count(),
    ]);

    res.json({
      totalUsers,
      usersWithProfiles,
      totalPhotos,
      totalPromptAnswers,
      totalLikes,
      totalMatches,
      totalMessages,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to get stats';
    res.status(500).json({ error: message });
  }
};

export const getAllLikes = async (req: Request, res: Response) => {
  try {
    const likes = await prisma.like.findMany({
      include: {
        fromUser: {
          include: {
            profile: true,
          },
        },
        toUser: {
          include: {
            profile: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    res.json(likes);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to get likes';
    res.status(500).json({ error: message });
  }
};

export const getAllMatches = async (req: Request, res: Response) => {
  try {
    const matches = await prisma.match.findMany({
      include: {
        user1: {
          include: {
            profile: true,
          },
        },
        user2: {
          include: {
            profile: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    res.json(matches);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to get matches';
    res.status(500).json({ error: message });
  }
};

export const getAllMessages = async (req: Request, res: Response) => {
  try {
    const messages = await prisma.message.findMany({
      include: {
        sender: {
          include: {
            profile: true,
          },
        },
        match: {
          include: {
            user1: {
              include: {
                profile: true,
              },
            },
            user2: {
              include: {
                profile: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 100, // Limit to last 100 messages
    });

    res.json(messages);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to get messages';
    res.status(500).json({ error: message });
  }
};

