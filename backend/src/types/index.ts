import { Request } from 'express';

export interface AuthRequest extends Request {
  userId?: string;
}

export interface UserPayload {
  userId: string;
}

export interface CreateUserDto {
  email: string;
  password: string;
  firstName: string;
  age: number;
  gender: string;
  interestedIn: string[];
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface UpdateProfileDto {
  firstName?: string;
  age?: number;
  bio?: string;
  location?: string;
  gender?: string;
  interestedIn?: string[];
  minAge?: number;
  maxAge?: number;
  maxDistance?: number;
  latitude?: number;
  longitude?: number;
}

export interface CreateLikeDto {
  toUserId: string;
  type: 'PROFILE' | 'PHOTO' | 'PROMPT';
  photoId?: string;
  promptAnswerId?: string;
  comment?: string;
}

export interface CreatePromptAnswerDto {
  promptId: string;
  answer: string;
  order: number;
}

export interface SendMessageDto {
  matchId: string;
  content: string;
}

