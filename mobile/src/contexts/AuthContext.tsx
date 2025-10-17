import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import * as SecureStore from 'expo-secure-store';
import { User, LoginCredentials, RegisterData } from '../types';
import * as api from '../services/api';
import { initializeSocket, disconnectSocket } from '../services/socket';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const token = await SecureStore.getItemAsync('token');
      if (token) {
        const userData = await api.getCurrentUser();
        setUser(userData);
        initializeSocket(token);
      }
    } catch (error) {
      console.error('Failed to load user:', error);
      await SecureStore.deleteItemAsync('token');
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials: LoginCredentials) => {
    const { token, user: userData } = await api.login(credentials);
    await SecureStore.setItemAsync('token', token);
    setUser(userData);
    initializeSocket(token);
  };

  const register = async (data: RegisterData) => {
    const { token, user: userData } = await api.register(data);
    await SecureStore.setItemAsync('token', token);
    setUser(userData);
    initializeSocket(token);
  };

  const logout = async () => {
    await SecureStore.deleteItemAsync('token');
    setUser(null);
    disconnectSocket();
  };

  const refreshUser = async () => {
    const userData = await api.getCurrentUser();
    setUser(userData);
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, login, register, logout, refreshUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

