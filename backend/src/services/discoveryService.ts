import { PrismaClient } from '@prisma/client';
import { calculateDistance } from '../utils/distance';

const prisma = new PrismaClient();

export const getNextProfile = async (userId: string) => {
  const userProfile = await prisma.profile.findUnique({
    where: { userId },
  });

  if (!userProfile) {
    throw new Error('Profile not found');
  }

  // Get IDs of users already liked or matched
  const likedUserIds = await prisma.like.findMany({
    where: { fromUserId: userId },
    select: { toUserId: true },
  });

  const likedIds = likedUserIds.map((like) => like.toUserId);

  // Build filter criteria
  const whereClause: any = {
    userId: {
      not: userId,
      notIn: likedIds,
    },
    age: {
      gte: userProfile.minAge,
      lte: userProfile.maxAge,
    },
  };

  // Filter by gender preference
  if (userProfile.interestedIn.length > 0) {
    whereClause.gender = {
      in: userProfile.interestedIn,
    };
  }

  // Get candidate profiles
  let candidates = await prisma.profile.findMany({
    where: whereClause,
    include: {
      user: {
        select: {
          id: true,
          email: true,
        },
      },
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
    take: 50, // Get a batch to filter by distance
  });

  // Filter by distance if coordinates are available
  if (userProfile.latitude && userProfile.longitude) {
    candidates = candidates.filter((candidate) => {
      if (!candidate.latitude || !candidate.longitude) {
        return true; // Include profiles without location
      }

      const distance = calculateDistance(
        userProfile.latitude!,
        userProfile.longitude!,
        candidate.latitude,
        candidate.longitude
      );

      return distance <= userProfile.maxDistance;
    });
  }

  // Return first candidate
  if (candidates.length === 0) {
    return null;
  }

  // Randomize to avoid always showing the same profiles first
  const randomIndex = Math.floor(Math.random() * Math.min(candidates.length, 10));
  return candidates[randomIndex];
};

export const getAllPrompts = async () => {
  return prisma.prompt.findMany({
    where: { active: true },
    orderBy: { text: 'asc' },
  });
};

