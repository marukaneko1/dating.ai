import axios from 'axios';
import type {
  User,
  LoginCredentials,
  RegisterData,
  Profile,
  UpdateProfileData,
  Prompt,
  Like,
  CreateLikeData,
  Match,
  Message,
} from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

const api = axios.create({
  baseURL: `${API_URL}/api`,
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth endpoints
export const login = async (credentials: LoginCredentials) => {
  const { data } = await api.post('/auth/login', credentials);
  return data;
};

export const register = async (userData: RegisterData) => {
  const { data } = await api.post('/auth/register', userData);
  return data;
};

export const getCurrentUser = async (): Promise<User> => {
  const { data } = await api.get('/auth/me');
  return data;
};

// Profile endpoints
export const getProfile = async (): Promise<Profile> => {
  const { data } = await api.get('/profile');
  return data;
};

export const updateProfile = async (
  profileData: UpdateProfileData
): Promise<Profile> => {
  const { data } = await api.put('/profile', profileData);
  return data;
};

export const uploadPhoto = async (file: File, order: number) => {
  const formData = new FormData();
  formData.append('photo', file);
  formData.append('order', order.toString());
  const { data } = await api.post('/profile/photos', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
};

export const deletePhoto = async (photoId: string) => {
  await api.delete(`/profile/photos/${photoId}`);
};

export const addPromptAnswer = async (
  promptId: string,
  answer: string,
  order: number
) => {
  const { data } = await api.post('/profile/prompts', {
    promptId,
    answer,
    order,
  });
  return data;
};

export const updatePromptAnswer = async (answerId: string, answer: string) => {
  const { data } = await api.put(`/profile/prompts/${answerId}`, { answer });
  return data;
};

export const deletePromptAnswer = async (answerId: string) => {
  await api.delete(`/profile/prompts/${answerId}`);
};

// Discovery endpoints
export const getNextProfile = async (): Promise<Profile | null> => {
  const { data } = await api.get('/discover');
  return data.message ? null : data;
};

export const getPrompts = async (): Promise<Prompt[]> => {
  const { data } = await api.get('/prompts');
  return data;
};

// Like endpoints
export const createLike = async (likeData: CreateLikeData) => {
  const { data } = await api.post('/likes', likeData);
  return data;
};

export const deleteLike = async (likeId: string) => {
  await api.delete(`/likes/${likeId}`);
};

export const getSentLikes = async (): Promise<Like[]> => {
  const { data } = await api.get('/likes/sent');
  return data;
};

export const getReceivedLikes = async (): Promise<Like[]> => {
  const { data } = await api.get('/likes/received');
  return data;
};

// Match endpoints
export const getMatches = async (): Promise<Match[]> => {
  const { data } = await api.get('/matches');
  return data;
};

export const deleteMatch = async (matchId: string) => {
  await api.delete(`/matches/${matchId}`);
};

// Message endpoints
export const getMessages = async (matchId: string): Promise<Message[]> => {
  const { data } = await api.get(`/messages/${matchId}`);
  return data;
};

export const sendMessage = async (matchId: string, content: string) => {
  const { data } = await api.post('/messages', { matchId, content });
  return data;
};

export const markMessagesAsRead = async (matchId: string) => {
  await api.put(`/messages/${matchId}/read`);
};

export default api;

