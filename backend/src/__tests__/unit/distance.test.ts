import { calculateDistance } from '../../utils/distance';

describe('Distance Utils', () => {
  describe('calculateDistance', () => {
    it('should calculate distance between two coordinates', () => {
      // New York to Los Angeles (approx 2451 miles)
      const nyLat = 40.7128;
      const nyLon = -74.006;
      const laLat = 34.0522;
      const laLon = -118.2437;

      const distance = calculateDistance(nyLat, nyLon, laLat, laLon);
      
      expect(distance).toBeGreaterThan(2400);
      expect(distance).toBeLessThan(2500);
    });

    it('should return 0 for same coordinates', () => {
      const lat = 40.7128;
      const lon = -74.006;

      const distance = calculateDistance(lat, lon, lat, lon);
      
      expect(distance).toBe(0);
    });

    it('should calculate short distances accurately', () => {
      // Two points about 1 mile apart in Manhattan
      const lat1 = 40.7589;
      const lon1 = -73.9851;
      const lat2 = 40.7484;
      const lon2 = -73.9857;

      const distance = calculateDistance(lat1, lon1, lat2, lon2);
      
      expect(distance).toBeGreaterThan(0.5);
      expect(distance).toBeLessThan(1.5);
    });
  });
});

