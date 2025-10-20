import { PrismaClient } from '@prisma/client';
import { UpdateProfileDto, CreatePromptAnswerDto } from '../types';
import { LIMITS } from '../config/constants';
import { generateProfileInsight } from './openaiService';
import { exportUserToCSV } from './csvExportService';

const prisma = new PrismaClient();

export const getProfile = async (userId: string) => {
  const profile = await prisma.profile.findUnique({
    where: { userId },
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
  });

  if (!profile) {
    throw new Error('Profile not found');
  }

  return profile;
};

export const updateProfile = async (userId: string, data: UpdateProfileDto) => {
  const profile = await prisma.profile.findUnique({
    where: { userId },
  });

  // If profile doesn't exist, create it
  if (!profile) {
    // Get user info for default values
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { profile: true },
    });

    if (!user) {
      throw new Error('User not found');
    }

    // Create profile with provided data and defaults
    return prisma.profile.create({
      data: {
        userId,
        firstName: data.firstName || 'User',
        age: data.age || 25,
        gender: data.gender || 'other',
        interestedIn: data.interestedIn || ['male', 'female', 'non-binary'],
        bio: data.bio,
        location: data.location,
        minAge: data.minAge || 18,
        maxAge: data.maxAge || 50,
        maxDistance: data.maxDistance || 50,
        latitude: data.latitude,
        longitude: data.longitude,
      },
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
    });
  }

  // Update existing profile
  return prisma.profile.update({
    where: { userId },
    data,
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
  });
};

export const addPhoto = async (
  userId: string,
  filename: string,
  order: number
) => {
  const profile = await prisma.profile.findUnique({
    where: { userId },
  });

  if (!profile) {
    throw new Error('Profile not found');
  }

  // Check photo limit
  const photoCount = await prisma.photo.count({
    where: { profileId: profile.id },
  });

  if (photoCount >= LIMITS.MAX_PHOTOS) {
    throw new Error(`Maximum ${LIMITS.MAX_PHOTOS} photos allowed`);
  }

  return prisma.photo.create({
    data: {
      profileId: profile.id,
      url: `/uploads/${filename}`,
      order,
    },
  });
};

export const deletePhoto = async (userId: string, photoId: string) => {
  const profile = await prisma.profile.findUnique({
    where: { userId },
  });

  if (!profile) {
    throw new Error('Profile not found');
  }

  const photo = await prisma.photo.findFirst({
    where: {
      id: photoId,
      profileId: profile.id,
    },
  });

  if (!photo) {
    throw new Error('Photo not found');
  }

  return prisma.photo.delete({
    where: { id: photoId },
  });
};

export const addPromptAnswer = async (
  userId: string,
  data: CreatePromptAnswerDto
) => {
  const profile = await prisma.profile.findUnique({
    where: { userId },
  });

  if (!profile) {
    throw new Error('Profile not found');
  }

  // Check prompt answer limit
  const answerCount = await prisma.promptAnswer.count({
    where: { profileId: profile.id },
  });

  if (answerCount >= LIMITS.MAX_PROMPTS) {
    throw new Error(`Maximum ${LIMITS.MAX_PROMPTS} prompt answers allowed`);
  }

  return prisma.promptAnswer.create({
    data: {
      profileId: profile.id,
      promptId: data.promptId,
      answer: data.answer,
      order: data.order,
    },
    include: {
      prompt: true,
    },
  });
};

export const updatePromptAnswer = async (
  userId: string,
  answerId: string,
  answer: string
) => {
  const profile = await prisma.profile.findUnique({
    where: { userId },
  });

  if (!profile) {
    throw new Error('Profile not found');
  }

  const promptAnswer = await prisma.promptAnswer.findFirst({
    where: {
      id: answerId,
      profileId: profile.id,
    },
  });

  if (!promptAnswer) {
    throw new Error('Prompt answer not found');
  }

  return prisma.promptAnswer.update({
    where: { id: answerId },
    data: { answer },
    include: {
      prompt: true,
    },
  });
};

export const deletePromptAnswer = async (userId: string, answerId: string) => {
  const profile = await prisma.profile.findUnique({
    where: { userId },
  });

  if (!profile) {
    throw new Error('Profile not found');
  }

  const promptAnswer = await prisma.promptAnswer.findFirst({
    where: {
      id: answerId,
      profileId: profile.id,
    },
  });

  if (!promptAnswer) {
    throw new Error('Prompt answer not found');
  }

  return prisma.promptAnswer.delete({
    where: { id: answerId },
  });
};

// Generate AI insight for a profile
export const generateAIInsight = async (userId: string) => {
  const profile = await prisma.profile.findUnique({
    where: { userId },
    include: {
      promptAnswers: {
        include: {
          prompt: true,
        },
        orderBy: { order: 'asc' },
      },
    },
  });

  if (!profile) {
    throw new Error('Profile not found');
  }

  // Generate AI insight using OpenAI
  const aiInsight = await generateProfileInsight({
    firstName: profile.firstName,
    age: profile.age,
    gender: profile.gender,
    bio: profile.bio || undefined,
    location: profile.location || undefined,
    interestedIn: profile.interestedIn,
    promptAnswers: profile.promptAnswers.map(pa => ({
      prompt: {
        text: pa.prompt.text,
        category: pa.prompt.category || 'other',
      },
      answer: pa.answer,
    })),
  });

  // Update profile with AI insight
  return prisma.profile.update({
    where: { userId },
    data: { aiInsight },
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
  });
};


// Reset user profile (delete profile so they start fresh)
export const resetUserProfile = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { profile: true },
  });

  if (!user) {
    throw new Error('User not found');
  }

  // Only reset non-admin users
  if (user.isAdmin) {
    throw new Error('Cannot reset admin profile this way');
  }

  if (user.profile) {
    // Delete profile (cascade will delete photos and prompt answers)
    await prisma.profile.delete({
      where: { userId },
    });
  }

  return { message: 'User profile reset successfully' };
};

// Export profile to CSV after onboarding completion
export const exportProfileAfterOnboarding = async (userId: string) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { profile: true },
    });

    // Only export for non-admin users (real users)
    if (!user || user.isAdmin) {
      console.log('Skipping CSV export for admin user');
      return null;
    }

    // Check if profile has at least some prompt answers
    const profile = await prisma.profile.findUnique({
      where: { userId },
      include: {
        promptAnswers: true,
      },
    });

    if (!profile || profile.promptAnswers.length === 0) {
      console.log('No prompt answers yet, skipping CSV export');
      return null;
    }

    // Export to CSV
    const result = await exportUserToCSV(userId);
    console.log(`✅ User data exported to CSV: ${result.filename}`);
    return result;
  } catch (error) {
    console.error('Failed to export user to CSV:', error);
    // Don't throw - this is a non-critical feature
    return null;
  }
};
