import { describe, it, expect } from 'vitest';
import { calculatePollResults, isPollActive } from '../../utils/pollUtils';

describe('Poll Utilities', () => {
  describe('calculatePollResults', () => {
    it('calculates correct percentages', () => {
      const votes = [
        { selected_option: 'A' },
        { selected_option: 'A' },
        { selected_option: 'B' },
      ];
      const options = ['A', 'B', 'C'];

      const { results, totalVotes, getPercentage } = calculatePollResults(votes, options);

      expect(totalVotes).toBe(3);
      expect(getPercentage('A')).toBe(66.66666666666666);
      expect(getPercentage('B')).toBe(33.33333333333333);
      expect(getPercentage('C')).toBe(0);
    });

    it('handles no votes', () => {
      const votes: { selected_option: string }[] = [];
      const options = ['A', 'B'];

      const { totalVotes, getPercentage } = calculatePollResults(votes, options);

      expect(totalVotes).toBe(0);
      expect(getPercentage('A')).toBe(0);
      expect(getPercentage('B')).toBe(0);
    });
  });

  describe('isPollActive', () => {
    it('returns true for active polls', () => {
      const now = new Date();
      const startTime = new Date(now.getTime() - 1000); // 1 second ago
      const endTime = new Date(now.getTime() + 1000); // 1 second from now

      expect(isPollActive(startTime, endTime)).toBe(true);
    });

    it('returns false for future polls', () => {
      const now = new Date();
      const startTime = new Date(now.getTime() + 1000);
      const endTime = new Date(now.getTime() + 2000);

      expect(isPollActive(startTime, endTime)).toBe(false);
    });

    it('returns false for ended polls', () => {
      const now = new Date();
      const startTime = new Date(now.getTime() - 2000);
      const endTime = new Date(now.getTime() - 1000);

      expect(isPollActive(startTime, endTime)).toBe(false);
    });
  });
});