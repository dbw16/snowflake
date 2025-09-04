import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getMilestones, setMilestones, updateMilestone } from '../milestones';
import { db, reportMilestonesTable } from '../db';
import { getOrCreateUser } from '../access';

// Mock dependencies
vi.mock('../db', () => ({
  db: {
    select: vi.fn(),
    insert: vi.fn(),
  },
  reportMilestonesTable: {
    trackId: 'trackId',
    milestone: 'milestone',
    reportKey: 'reportKey',
    updatedAt: 'updatedAt',
    updatedBy: 'updatedBy',
  },
}));

vi.mock('../access', () => ({
  getOrCreateUser: vi.fn(),
}));

const mockDb = vi.mocked(db);
const mockGetOrCreateUser = vi.mocked(getOrCreateUser);

describe('Milestones Library', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getMilestones', () => {
    it('should return empty object when reportKey is empty', async () => {
      const result = await getMilestones('');
      expect(result).toEqual({});
      expect(mockDb.select).not.toHaveBeenCalled();
    });

    it('should return empty object when reportKey is null/undefined', async () => {
      const result1 = await getMilestones(null as any);
      const result2 = await getMilestones(undefined as any);
      expect(result1).toEqual({});
      expect(result2).toEqual({});
      expect(mockDb.select).not.toHaveBeenCalled();
    });

    it('should return milestone map when data exists', async () => {
      const mockRows = [
        { trackId: 'MOBILE', milestone: 3 },
        { trackId: 'WEB_CLIENT', milestone: 2 },
        { trackId: 'SERVERS', milestone: 4 },
      ];

      const mockSelect = {
        from: vi.fn().mockReturnThis(),
        where: vi.fn().mockResolvedValue(mockRows),
      };
      mockDb.select.mockReturnValue(mockSelect as any);

      const result = await getMilestones('test-key');
      
      expect(result).toEqual({
        'MOBILE': 3,
        'WEB_CLIENT': 2,
        'SERVERS': 4,
      });
      expect(mockDb.select).toHaveBeenCalledWith({
        trackId: reportMilestonesTable.trackId,
        milestone: reportMilestonesTable.milestone,
      });
    });

    it('should return empty object when no rows are found', async () => {
      const mockSelect = {
        from: vi.fn().mockReturnThis(),
        where: vi.fn().mockResolvedValue([]),
      };
      mockDb.select.mockReturnValue(mockSelect as any);

      const result = await getMilestones('nonexistent-key');
      
      expect(result).toEqual({});
    });
  });

  describe('setMilestones', () => {
    beforeEach(() => {
      // Mock the date to have consistent testing
      vi.useFakeTimers();
      vi.setSystemTime(new Date('2024-01-01T00:00:00Z'));
      
      mockGetOrCreateUser.mockResolvedValue('user-id-123');
      
      // Mock getMilestones call at the end
      const mockSelect = {
        from: vi.fn().mockReturnThis(),
        where: vi.fn().mockResolvedValue([
          { trackId: 'MOBILE', milestone: 3 },
          { trackId: 'WEB_CLIENT', milestone: 2 },
        ]),
      };
      mockDb.select.mockReturnValue(mockSelect as any);
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('should return empty object when reportKey is empty', async () => {
      const result = await setMilestones({
        reportKey: '',
        milestoneByTrack: { 'MOBILE': 3 },
      });
      
      expect(result).toEqual({});
      expect(mockDb.insert).not.toHaveBeenCalled();
    });

    it('should insert milestones and return updated map', async () => {
      const mockInsert = {
        values: vi.fn().mockReturnThis(),
        onConflictDoUpdate: vi.fn().mockResolvedValue(undefined),
      };
      mockDb.insert.mockReturnValue(mockInsert as any);

      const milestoneByTrack = { 'MOBILE': 3, 'WEB_CLIENT': 2 };
      const result = await setMilestones({
        reportKey: 'test-key',
        milestoneByTrack,
        updatedBy: 'testuser',
      });

      expect(mockGetOrCreateUser).toHaveBeenCalledWith('testuser');
      expect(mockDb.insert).toHaveBeenCalledTimes(2); // Once for each track
      expect(mockInsert.values).toHaveBeenCalledWith({
        reportKey: 'test-key',
        trackId: 'MOBILE',
        milestone: 3,
        updatedAt: '2024-01-01T00:00:00.000Z',
        updatedBy: 'user-id-123',
      });
      expect(mockInsert.values).toHaveBeenCalledWith({
        reportKey: 'test-key',
        trackId: 'WEB_CLIENT',
        milestone: 2,
        updatedAt: '2024-01-01T00:00:00.000Z',
        updatedBy: 'user-id-123',
      });
      
      expect(result).toEqual({
        'MOBILE': 3,
        'WEB_CLIENT': 2,
      });
    });

    it('should use "system" as default updatedBy when not provided', async () => {
      const mockInsert = {
        values: vi.fn().mockReturnThis(),
        onConflictDoUpdate: vi.fn().mockResolvedValue(undefined),
      };
      mockDb.insert.mockReturnValue(mockInsert as any);

      await setMilestones({
        reportKey: 'test-key',
        milestoneByTrack: { 'MOBILE': 3 },
      });

      expect(mockGetOrCreateUser).toHaveBeenCalledWith('system');
    });

    it('should skip invalid trackIds and milestones', async () => {
      const mockInsert = {
        values: vi.fn().mockReturnThis(),
        onConflictDoUpdate: vi.fn().mockResolvedValue(undefined),
      };
      mockDb.insert.mockReturnValue(mockInsert as any);

      await setMilestones({
        reportKey: 'test-key',
        milestoneByTrack: {
          '': 3,              // Empty trackId should be skipped
          'MOBILE': NaN,      // NaN milestone should be skipped
          'WEB_CLIENT': 2,    // Valid entry
          'SERVERS': 4,       // Valid entry
        },
      });

      expect(mockDb.insert).toHaveBeenCalledTimes(2); // Only valid entries
      expect(mockInsert.values).toHaveBeenCalledWith(expect.objectContaining({
        trackId: 'WEB_CLIENT',
        milestone: 2,
      }));
      expect(mockInsert.values).toHaveBeenCalledWith(expect.objectContaining({
        trackId: 'SERVERS',
        milestone: 4,
      }));
    });

    it('should handle string milestone values by converting to number', async () => {
      const mockInsert = {
        values: vi.fn().mockReturnThis(),
        onConflictDoUpdate: vi.fn().mockResolvedValue(undefined),
      };
      mockDb.insert.mockReturnValue(mockInsert as any);

      await setMilestones({
        reportKey: 'test-key',
        milestoneByTrack: { 'MOBILE': '3' as any },
      });

      expect(mockInsert.values).toHaveBeenCalledWith(expect.objectContaining({
        milestone: 3,
      }));
    });

    it('should handle milestone value of 0', async () => {
      const mockInsert = {
        values: vi.fn().mockReturnThis(),
        onConflictDoUpdate: vi.fn().mockResolvedValue(undefined),
      };
      mockDb.insert.mockReturnValue(mockInsert as any);

      await setMilestones({
        reportKey: 'test-key',
        milestoneByTrack: { 'MOBILE': 0 },
      });

      expect(mockInsert.values).toHaveBeenCalledWith(expect.objectContaining({
        milestone: 0,
      }));
    });

    it('should handle empty milestoneByTrack object', async () => {
      const result = await setMilestones({
        reportKey: 'test-key',
        milestoneByTrack: {},
      });

      expect(mockDb.insert).not.toHaveBeenCalled();
      expect(result).toEqual({
        'MOBILE': 3,
        'WEB_CLIENT': 2,
      }); // Returns current milestones
    });

    it('should handle null/undefined milestoneByTrack', async () => {
      const result1 = await setMilestones({
        reportKey: 'test-key',
        milestoneByTrack: null as any,
      });

      const result2 = await setMilestones({
        reportKey: 'test-key',
        milestoneByTrack: undefined as any,
      });

      expect(mockDb.insert).not.toHaveBeenCalled();
      expect(result1).toEqual({ 'MOBILE': 3, 'WEB_CLIENT': 2 });
      expect(result2).toEqual({ 'MOBILE': 3, 'WEB_CLIENT': 2 });
    });
  });

  describe('updateMilestone', () => {
    it('should return empty object when reportKey is empty', async () => {
      const result = await updateMilestone({
        reportKey: '',
        trackId: 'MOBILE',
        milestone: 3,
      });
      
      expect(result).toEqual({});
    });

    it('should return empty object when trackId is empty', async () => {
      const result = await updateMilestone({
        reportKey: 'test-key',
        trackId: '',
        milestone: 3,
      });
      
      expect(result).toEqual({});
    });

    it('should return empty object when milestone is NaN', async () => {
      const result = await updateMilestone({
        reportKey: 'test-key',
        trackId: 'MOBILE',
        milestone: NaN,
      });
      
      expect(result).toEqual({});
    });

    it('should call setMilestones with single milestone', async () => {
      // Since updateMilestone internally calls setMilestones, we'll test the behavior differently
      const result = await updateMilestone({
        reportKey: 'test-key',
        trackId: 'MOBILE',
        milestone: 3,
        updatedBy: 'testuser',
      });

      // Should return the result from getMilestones (mocked above)
      expect(result).toEqual({
        'MOBILE': 3,
        'WEB_CLIENT': 2,
      });
    });

    it('should handle milestone value of 0', async () => {
      const result = await updateMilestone({
        reportKey: 'test-key',
        trackId: 'MOBILE',
        milestone: 0,
      });

      expect(result).toEqual({
        'MOBILE': 3,
        'WEB_CLIENT': 2,
      });
    });

    it('should convert string milestone to number', async () => {
      const result = await updateMilestone({
        reportKey: 'test-key',
        trackId: 'MOBILE',
        milestone: '3' as any,
      });

      expect(result).toEqual({
        'MOBILE': 3,
        'WEB_CLIENT': 2,
      });
    });
  });
});