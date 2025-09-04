import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GET, POST } from '../route';
import { getServerSession } from 'next-auth/next';
import { isUserAllowed } from '../../../../lib/access';
import { getMilestones, setMilestones, updateMilestone } from '../../../../lib/milestones';

// Mock dependencies
vi.mock('next-auth/next');
vi.mock('../../../../lib/access');
vi.mock('../../../../lib/milestones');

const mockGetServerSession = vi.mocked(getServerSession);
const mockIsUserAllowed = vi.mocked(isUserAllowed);
const mockGetMilestones = vi.mocked(getMilestones);
const mockSetMilestones = vi.mocked(setMilestones);
const mockUpdateMilestone = vi.mocked(updateMilestone);

describe('Milestones API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('GET /api/milestones', () => {
    it('should return 401 when user is not authenticated', async () => {
      mockGetServerSession.mockResolvedValue(null);
      
      const request = new Request('http://localhost/api/milestones?reportKey=test-key');
      const response = await GET(request as any);
      
      expect(response.status).toBe(401);
      const data = await response.json();
      expect(data.error).toBe('Unauthorized');
    });

    it('should return 400 when reportKey is missing', async () => {
      mockGetServerSession.mockResolvedValue({ user: { name: 'testuser' } } as any);
      
      const request = new Request('http://localhost/api/milestones');
      const response = await GET(request as any);
      
      expect(response.status).toBe(400);
      const data = await response.json();
      expect(data.error).toBe('reportKey is required');
    });

    it('should return 403 when user is not allowed to access report', async () => {
      mockGetServerSession.mockResolvedValue({ user: { name: 'testuser' } } as any);
      mockIsUserAllowed.mockResolvedValue(false);
      
      const request = new Request('http://localhost/api/milestones?reportKey=test-key');
      const response = await GET(request as any);
      
      expect(response.status).toBe(403);
      const data = await response.json();
      expect(data.error).toBe('Forbidden');
      expect(mockIsUserAllowed).toHaveBeenCalledWith({ reportKey: 'test-key', username: 'testuser' });
    });

    it('should return milestones when user is authorized', async () => {
      const mockMilestones = { 'MOBILE': 3, 'WEB_CLIENT': 2 };
      mockGetServerSession.mockResolvedValue({ user: { name: 'testuser' } } as any);
      mockIsUserAllowed.mockResolvedValue(true);
      mockGetMilestones.mockResolvedValue(mockMilestones);
      
      const request = new Request('http://localhost/api/milestones?reportKey=test-key');
      const response = await GET(request as any);
      
      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.milestoneByTrack).toEqual(mockMilestones);
      expect(mockGetMilestones).toHaveBeenCalledWith('test-key');
    });

    it('should return 500 when getMilestones throws an error', async () => {
      mockGetServerSession.mockResolvedValue({ user: { name: 'testuser' } } as any);
      mockIsUserAllowed.mockResolvedValue(true);
      mockGetMilestones.mockRejectedValue(new Error('Database error'));
      
      const request = new Request('http://localhost/api/milestones?reportKey=test-key');
      const response = await GET(request as any);
      
      expect(response.status).toBe(500);
      const data = await response.json();
      expect(data.error).toBe('Database error');
    });

    it('should return 500 with generic message when error has no message', async () => {
      mockGetServerSession.mockResolvedValue({ user: { name: 'testuser' } } as any);
      mockIsUserAllowed.mockResolvedValue(true);
      mockGetMilestones.mockRejectedValue(new Error());
      
      const request = new Request('http://localhost/api/milestones?reportKey=test-key');
      const response = await GET(request as any);
      
      expect(response.status).toBe(500);
      const data = await response.json();
      expect(data.error).toBe('Failed to load milestones');
    });
  });

  describe('POST /api/milestones', () => {
    it('should return 401 when user is not authenticated', async () => {
      mockGetServerSession.mockResolvedValue(null);
      
      const request = new Request('http://localhost/api/milestones', {
        method: 'POST',
        body: JSON.stringify({ reportKey: 'test-key' })
      });
      const response = await POST(request as any);
      
      expect(response.status).toBe(401);
      const data = await response.json();
      expect(data.error).toBe('Unauthorized');
    });

    it('should return 400 when reportKey is missing', async () => {
      mockGetServerSession.mockResolvedValue({ user: { name: 'testuser' } } as any);
      
      const request = new Request('http://localhost/api/milestones', {
        method: 'POST',
        body: JSON.stringify({})
      });
      const response = await POST(request as any);
      
      expect(response.status).toBe(400);
      const data = await response.json();
      expect(data.error).toBe('reportKey is required');
    });

    it('should return 403 when user is not allowed to access report', async () => {
      mockGetServerSession.mockResolvedValue({ user: { name: 'testuser' } } as any);
      mockIsUserAllowed.mockResolvedValue(false);
      
      const request = new Request('http://localhost/api/milestones', {
        method: 'POST',
        body: JSON.stringify({ reportKey: 'test-key', trackId: 'MOBILE', milestone: 3 })
      });
      const response = await POST(request as any);
      
      expect(response.status).toBe(403);
      const data = await response.json();
      expect(data.error).toBe('Forbidden');
    });

    it('should update single milestone when trackId and milestone are provided', async () => {
      const mockUpdatedMilestones = { 'MOBILE': 3, 'WEB_CLIENT': 2 };
      mockGetServerSession.mockResolvedValue({ user: { name: 'testuser' } } as any);
      mockIsUserAllowed.mockResolvedValue(true);
      mockUpdateMilestone.mockResolvedValue(mockUpdatedMilestones);
      
      const request = new Request('http://localhost/api/milestones', {
        method: 'POST',
        body: JSON.stringify({ reportKey: 'test-key', trackId: 'MOBILE', milestone: 3 })
      });
      const response = await POST(request as any);
      
      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.milestoneByTrack).toEqual(mockUpdatedMilestones);
      expect(mockUpdateMilestone).toHaveBeenCalledWith({
        reportKey: 'test-key',
        trackId: 'MOBILE',
        milestone: 3,
        updatedBy: 'testuser'
      });
    });

    it('should update multiple milestones when milestoneByTrack is provided', async () => {
      const milestoneByTrack = { 'MOBILE': 3, 'WEB_CLIENT': 2 };
      const mockUpdatedMilestones = { 'MOBILE': 3, 'WEB_CLIENT': 2, 'SERVERS': 1 };
      mockGetServerSession.mockResolvedValue({ user: { name: 'testuser' } } as any);
      mockIsUserAllowed.mockResolvedValue(true);
      mockSetMilestones.mockResolvedValue(mockUpdatedMilestones);
      
      const request = new Request('http://localhost/api/milestones', {
        method: 'POST',
        body: JSON.stringify({ reportKey: 'test-key', milestoneByTrack })
      });
      const response = await POST(request as any);
      
      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.milestoneByTrack).toEqual(mockUpdatedMilestones);
      expect(mockSetMilestones).toHaveBeenCalledWith({
        reportKey: 'test-key',
        milestoneByTrack,
        updatedBy: 'testuser'
      });
    });

    it('should return 400 when neither trackId/milestone nor milestoneByTrack is provided', async () => {
      mockGetServerSession.mockResolvedValue({ user: { name: 'testuser' } } as any);
      mockIsUserAllowed.mockResolvedValue(true);
      
      const request = new Request('http://localhost/api/milestones', {
        method: 'POST',
        body: JSON.stringify({ reportKey: 'test-key' })
      });
      const response = await POST(request as any);
      
      expect(response.status).toBe(400);
      const data = await response.json();
      expect(data.error).toBe('Provide (trackId and milestone) or milestoneByTrack');
    });

    it('should return 400 when milestone is NaN', async () => {
      mockGetServerSession.mockResolvedValue({ user: { name: 'testuser' } } as any);
      mockIsUserAllowed.mockResolvedValue(true);
      
      const request = new Request('http://localhost/api/milestones', {
        method: 'POST',
        body: JSON.stringify({ reportKey: 'test-key', trackId: 'MOBILE', milestone: 'invalid' })
      });
      const response = await POST(request as any);
      
      expect(response.status).toBe(400);
      const data = await response.json();
      expect(data.error).toBe('Provide (trackId and milestone) or milestoneByTrack');
    });

    it('should handle milestone value of 0', async () => {
      const mockUpdatedMilestones = { 'MOBILE': 0 };
      mockGetServerSession.mockResolvedValue({ user: { name: 'testuser' } } as any);
      mockIsUserAllowed.mockResolvedValue(true);
      mockUpdateMilestone.mockResolvedValue(mockUpdatedMilestones);
      
      const request = new Request('http://localhost/api/milestones', {
        method: 'POST',
        body: JSON.stringify({ reportKey: 'test-key', trackId: 'MOBILE', milestone: 0 })
      });
      const response = await POST(request as any);
      
      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.milestoneByTrack).toEqual(mockUpdatedMilestones);
      expect(mockUpdateMilestone).toHaveBeenCalledWith({
        reportKey: 'test-key',
        trackId: 'MOBILE',
        milestone: 0,
        updatedBy: 'testuser'
      });
    });

    it('should return 500 when update operation throws an error', async () => {
      mockGetServerSession.mockResolvedValue({ user: { name: 'testuser' } } as any);
      mockIsUserAllowed.mockResolvedValue(true);
      mockUpdateMilestone.mockRejectedValue(new Error('Database error'));
      
      const request = new Request('http://localhost/api/milestones', {
        method: 'POST',
        body: JSON.stringify({ reportKey: 'test-key', trackId: 'MOBILE', milestone: 3 })
      });
      const response = await POST(request as any);
      
      expect(response.status).toBe(500);
      const data = await response.json();
      expect(data.error).toBe('Database error');
    });

    it('should return 500 with generic message when error has no message', async () => {
      mockGetServerSession.mockResolvedValue({ user: { name: 'testuser' } } as any);
      mockIsUserAllowed.mockResolvedValue(true);
      mockUpdateMilestone.mockRejectedValue(new Error());
      
      const request = new Request('http://localhost/api/milestones', {
        method: 'POST',
        body: JSON.stringify({ reportKey: 'test-key', trackId: 'MOBILE', milestone: 3 })
      });
      const response = await POST(request as any);
      
      expect(response.status).toBe(500);
      const data = await response.json();
      expect(data.error).toBe('Failed to update milestones');
    });
  });
});