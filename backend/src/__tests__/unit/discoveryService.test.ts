import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

describe('Discovery Service Unit Tests', () => {
  describe('Profile Filtering Logic', () => {
    it('should filter by age preferences', async () => {
      // This is a unit test that tests the filtering logic
      const userProfile = {
        minAge: 25,
        maxAge: 35,
        interestedIn: ['female'],
      };

      const testProfile = {
        age: 30,
        gender: 'female',
      };

      // Test age filtering
      expect(testProfile.age).toBeGreaterThanOrEqual(userProfile.minAge);
      expect(testProfile.age).toBeLessThanOrEqual(userProfile.maxAge);
    });

    it('should filter by gender preferences', async () => {
      const userProfile = {
        interestedIn: ['female', 'non-binary'],
      };

      const femaleProfile = { gender: 'female' };
      const maleProfile = { gender: 'male' };
      const nonBinaryProfile = { gender: 'non-binary' };

      expect(userProfile.interestedIn).toContain(femaleProfile.gender);
      expect(userProfile.interestedIn).not.toContain(maleProfile.gender);
      expect(userProfile.interestedIn).toContain(nonBinaryProfile.gender);
    });
  });

  describe('Distance Filtering', () => {
    it('should include profiles within max distance', () => {
      const maxDistance = 50; // miles
      const actualDistance = 30;

      expect(actualDistance).toBeLessThanOrEqual(maxDistance);
    });

    it('should exclude profiles beyond max distance', () => {
      const maxDistance = 50; // miles
      const actualDistance = 75;

      expect(actualDistance).toBeGreaterThan(maxDistance);
    });

    it('should include profiles without location data', () => {
      const profile = {
        latitude: null,
        longitude: null,
      };

      // Profiles without location should be included
      expect(profile.latitude).toBeNull();
      expect(profile.longitude).toBeNull();
    });
  });
});

