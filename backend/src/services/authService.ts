import { PrismaClient } from '@prisma/client';
import { hashPassword, comparePassword, generateToken } from '../utils/auth';
import { CreateUserDto, LoginDto } from '../types';

const prisma = new PrismaClient();

export const registerUser = async (data: CreateUserDto) => {
  const { email, password, firstName, age, gender, interestedIn } = data;

  // Check if user already exists
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    throw new Error('User already exists');
  }

  // Hash password
  const hashedPassword = await hashPassword(password);

  // Create user with profile
  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      profile: {
        create: {
          firstName,
          age,
          gender,
          interestedIn,
        },
      },
    },
    include: {
      profile: true,
    },
  });

  // Generate token
  const token = generateToken({ userId: user.id });

  return {
    token,
    user: {
      id: user.id,
      email: user.email,
      profile: user.profile,
    },
  };
};

export const loginUser = async (data: LoginDto) => {
  const { email, password } = data;

  // Find user
  const user = await prisma.user.findUnique({
    where: { email },
    include: {
      profile: true,
    },
  });

  if (!user) {
    throw new Error('Invalid credentials');
  }

  // Verify password
  const isValid = await comparePassword(password, user.password);

  if (!isValid) {
    throw new Error('Invalid credentials');
  }

  // Generate token
  const token = generateToken({ userId: user.id });

  return {
    token,
    user: {
      id: user.id,
      email: user.email,
      profile: user.profile,
    },
  };
};

export const getCurrentUser = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
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
  });

  if (!user) {
    throw new Error('User not found');
  }

  return {
    id: user.id,
    email: user.email,
    profile: user.profile,
  };
};

