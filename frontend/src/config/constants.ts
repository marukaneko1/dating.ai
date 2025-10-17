// Frontend Configuration Constants

export const LIMITS = {
  MAX_PHOTOS: 6,
  MAX_PROMPTS: 3,
  MIN_PHOTOS: 2,
  PASSWORD_MIN_LENGTH: 6,
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

