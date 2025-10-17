// Mobile App Configuration Constants

export const LIMITS = {
  MAX_PHOTOS: 6,
  MAX_PROMPTS: 3,
  MIN_PHOTOS: 2,
  PASSWORD_MIN_LENGTH: 6,
} as const;

export const IMAGE = {
  ASPECT_RATIO: [3, 4] as [number, number],
  QUALITY: 0.8,
  MAX_SIZE_MB: 5,
} as const;

export const PREFERENCES = {
  MIN_AGE: 18,
  MAX_AGE: 100,
  DEFAULT_MIN_AGE: 18,
  DEFAULT_MAX_AGE: 99,
  DEFAULT_MAX_DISTANCE: 50,
} as const;

export const GENDER_OPTIONS = ['male', 'female', 'non-binary', 'other'] as const;

export const INTERESTED_IN_OPTIONS = ['male', 'female', 'non-binary'] as const;

export const COLORS = {
  primary: '#FF6B6B',
  secondary: '#4ECDC4',
  accent: '#FFE66D',
  white: '#FFFFFF',
  gray: '#666666',
  lightGray: '#F5F5F5',
  border: '#E0E0E0',
} as const;

