export interface User {
  id: string;
  email: string;
  profile: Profile;
}

export interface Profile {
  id: string;
  userId: string;
  firstName: string;
  age: number;
  bio?: string;
  location?: string;
  gender: string;
  interestedIn: string[];
  minAge: number;
  maxAge: number;
  maxDistance: number;
  latitude?: number;
  longitude?: number;
  photos: Photo[];
  promptAnswers: PromptAnswer[];
}

export interface Photo {
  id: string;
  profileId: string;
  url: string;
  order: number;
  createdAt: string;
}

export interface Prompt {
  id: string;
  text: string;
  category?: string;
  active: boolean;
}

export interface PromptAnswer {
  id: string;
  profileId: string;
  promptId: string;
  prompt: Prompt;
  answer: string;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface Like {
  id: string;
  fromUserId: string;
  toUserId: string;
  type: 'PROFILE' | 'PHOTO' | 'PROMPT';
  comment?: string;
  photoId?: string;
  promptAnswerId?: string;
  createdAt: string;
  fromUser?: User;
  toUser?: User;
  photo?: Photo;
  promptAnswer?: PromptAnswer;
}

export interface Match {
  id: string;
  user: User;
  createdAt: string;
  lastMessage?: Message;
}

export interface Message {
  id: string;
  matchId: string;
  senderId: string;
  content: string;
  read: boolean;
  createdAt: string;
  sender?: User;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  age: number;
  gender: string;
  interestedIn: string[];
}

export interface UpdateProfileData {
  firstName?: string;
  age?: number;
  bio?: string;
  location?: string;
  gender?: string;
  interestedIn?: string[];
  minAge?: number;
  maxAge?: number;
  maxDistance?: number;
}

export interface CreateLikeData {
  toUserId: string;
  type: 'PROFILE' | 'PHOTO' | 'PROMPT';
  photoId?: string;
  promptAnswerId?: string;
  comment?: string;
}

