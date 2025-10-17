import { PrismaClient } from '@prisma/client';
import { UpdateProfileDto, CreatePromptAnswerDto } from '../types';
import { LIMITS } from '../config/constants';

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

  if (!profile) {
    throw new Error('Profile not found');
  }

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

