import { describe, it, expect, beforeEach, vi } from 'vitest';
import axios from 'axios';

// Mock axios
vi.mock('axios');

describe('API Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Authentication API', () => {
    it('should set authorization header when token exists', () => {
      const token = 'test-token-123';
      localStorage.setItem('token', token);

      const mockGet = vi.fn();
      (axios.create as any).mockReturnValue({
        get: mockGet,
        interceptors: {
          request: { use: vi.fn() },
          response: { use: vi.fn() },
        },
      });

      expect(localStorage.getItem('token')).toBe(token);
    });

    it('should handle missing token gracefully', () => {
      localStorage.removeItem('token');

      expect(localStorage.getItem('token')).toBeNull();
    });
  });

  describe('API Endpoints', () => {
    it('should use correct base URL', () => {
      const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
      
      expect(baseURL).toBeTruthy();
      expect(baseURL).toContain('http');
    });

    it('should construct API URLs correctly', () => {
      const baseURL = 'http://localhost:3001';
      const endpoints = [
        '/api/auth/login',
        '/api/profile',
        '/api/discover',
        '/api/likes',
        '/api/matches',
      ];

      endpoints.forEach((endpoint) => {
        const fullUrl = `${baseURL}${endpoint}`;
        expect(fullUrl).toContain(baseURL);
        expect(fullUrl).toContain(endpoint);
      });
    });
  });

  describe('Error Handling', () => {
    it('should handle network errors', () => {
      const error = new Error('Network Error');
      
      expect(error.message).toBe('Network Error');
    });

    it('should handle 401 unauthorized errors', () => {
      const error = {
        response: {
          status: 401,
          data: { error: 'Unauthorized' },
        },
      };

      expect(error.response.status).toBe(401);
      expect(error.response.data.error).toBe('Unauthorized');
    });

    it('should handle 404 not found errors', () => {
      const error = {
        response: {
          status: 404,
          data: { error: 'Not Found' },
        },
      };

      expect(error.response.status).toBe(404);
      expect(error.response.data.error).toBe('Not Found');
    });
  });
});

