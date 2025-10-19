import { hashPassword, comparePassword, generateToken, verifyToken } from '../../utils/auth';

describe('Auth Utils', () => {
  describe('hashPassword', () => {
    it('should hash a password', async () => {
      const password = 'testpassword123';
      const hash = await hashPassword(password);

      expect(hash).toBeDefined();
      expect(hash).not.toBe(password);
      expect(hash.length).toBeGreaterThan(0);
    });

    it('should generate different hashes for same password', async () => {
      const password = 'testpassword123';
      const hash1 = await hashPassword(password);
      const hash2 = await hashPassword(password);

      expect(hash1).not.toBe(hash2);
    });
  });

  describe('comparePassword', () => {
    it('should return true for correct password', async () => {
      const password = 'testpassword123';
      const hash = await hashPassword(password);

      const isValid = await comparePassword(password, hash);
      expect(isValid).toBe(true);
    });

    it('should return false for incorrect password', async () => {
      const password = 'testpassword123';
      const hash = await hashPassword(password);

      const isValid = await comparePassword('wrongpassword', hash);
      expect(isValid).toBe(false);
    });
  });

  describe('generateToken and verifyToken', () => {
    it('should generate and verify a valid token', () => {
      const userId = 'test-user-id-123';
      const token = generateToken(userId);

      expect(token).toBeDefined();
      expect(typeof token).toBe('string');

      const payload = verifyToken(token);
      expect(payload.userId).toBe(userId);
    });

    it('should throw error for invalid token', () => {
      const invalidToken = 'invalid.token.here';

      expect(() => {
        verifyToken(invalidToken);
      }).toThrow();
    });

    it('should throw error for expired token', () => {
      // Generate a token that expires in -1 second (already expired)
      const userId = 'test-user-id-123';
      const jwt = require('jsonwebtoken');
      const expiredToken = jwt.sign(
        { userId },
        process.env.JWT_SECRET || 'test-secret',
        { expiresIn: '-1s' }
      );

      expect(() => {
        verifyToken(expiredToken);
      }).toThrow();
    });
  });
});

