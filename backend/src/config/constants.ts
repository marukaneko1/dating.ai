// Application Configuration Constants

export const LIMITS = {
  MAX_PHOTOS: 6,
  MAX_PROMPTS: 3,
  MAX_PHOTO_SIZE_MB: 5,
  MAX_PHOTO_SIZE_BYTES: 5 * 1024 * 1024,
} as const;

export const AUTH = {
  TOKEN_EXPIRATION: '7d',
  BCRYPT_ROUNDS: 10,
  PASSWORD_MIN_LENGTH: 6,
} as const;

export const DISCOVERY = {
  BATCH_SIZE: 50, // Number of profiles to fetch for filtering
  RANDOMIZE_TOP: 10, // Randomize from top N results
} as const;

export const PREFERENCES = {
  DEFAULT_MIN_AGE: 18,
  DEFAULT_MAX_AGE: 99,
  DEFAULT_MAX_DISTANCE: 50, // miles
  MIN_AGE: 18,
  MAX_AGE: 100,
} as const;

export const PAGINATION = {
  MESSAGES_PER_PAGE: 50,
  MATCHES_PER_PAGE: 20,
  LIKES_PER_PAGE: 50,
} as const;

export const FILE_TYPES = {
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'] as string[],
  ALLOWED_EXTENSIONS: ['.jpg', '.jpeg', '.png', '.webp'] as string[],
};

