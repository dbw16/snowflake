import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GET } from '../route';
import { getServerSession } from 'next-auth/next';
import { isAdmin, listUsersWithAccessToReport } from '../../../../lib/access';

// Mock dependencies
vi.mock('next-auth/next');
vi.mock('../../../../lib/access');

const mockGetServerSession = vi.mocked(getServerSession);
const mockIsAdmin = vi.mocked(isAdmin);
const mockListUsersWithAccessToReport = vi.mocked(listUsersWithAccessToReport);

describe('Report Users API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('GET /api/report-users', () => {
    it('should return 403 when user is not authenticated', async () => {
      mockGetServerSession.mockResolvedValue(null);
      
      const request = new Request('http://localhost/api/report-users?reportKey=test-key');
      const response = await GET(request as any);
      
      expect(response.status).toBe(403);
      const data = await response.json();
      expect(data.error).toBe('Forbidden');
      expect(mockIsAdmin).not.toHaveBeenCalled();
    });

    it('should return 403 when session user has no name', async () => {
      mockGetServerSession.mockResolvedValue({ user: { name: null } } as any);
      
      const request = new Request('http://localhost/api/report-users?reportKey=test-key');
      const response = await GET(request as any);
      
      expect(response.status).toBe(403);
      const data = await response.json();
      expect(data.error).toBe('Forbidden');
      expect(mockIsAdmin).not.toHaveBeenCalled();
    });

    it('should return 403 when session user has empty name', async () => {
      mockGetServerSession.mockResolvedValue({ user: { name: '' } } as any);
      
      const request = new Request('http://localhost/api/report-users?reportKey=test-key');
      const response = await GET(request as any);
      
      expect(response.status).toBe(403);
      const data = await response.json();
      expect(data.error).toBe('Forbidden');
      expect(mockIsAdmin).not.toHaveBeenCalled();
    });

    it('should return 403 when user is not an admin', async () => {
      mockGetServerSession.mockResolvedValue({ user: { name: 'testuser' } } as any);
      mockIsAdmin.mockResolvedValue(false);
      
      const request = new Request('http://localhost/api/report-users?reportKey=test-key');
      const response = await GET(request as any);
      
      expect(response.status).toBe(403);
      const data = await response.json();
      expect(data.error).toBe('Forbidden');
      expect(mockIsAdmin).toHaveBeenCalledWith('testuser');
    });

    it('should return 400 when reportKey is missing', async () => {
      mockGetServerSession.mockResolvedValue({ user: { name: 'admin' } } as any);
      mockIsAdmin.mockResolvedValue(true);
      
      const request = new Request('http://localhost/api/report-users');
      const response = await GET(request as any);
      
      expect(response.status).toBe(400);
      const data = await response.json();
      expect(data.error).toBe('reportKey is required');
    });

    it('should return 400 when reportKey is empty', async () => {
      mockGetServerSession.mockResolvedValue({ user: { name: 'admin' } } as any);
      mockIsAdmin.mockResolvedValue(true);
      
      const request = new Request('http://localhost/api/report-users?reportKey=');
      const response = await GET(request as any);
      
      expect(response.status).toBe(400);
      const data = await response.json();
      expect(data.error).toBe('reportKey is required');
    });

    it('should return users when admin requests with valid reportKey', async () => {
      const mockUsers = [
        { id: 'user1', name: 'User One', email: 'user1@example.com' },
        { id: 'user2', name: 'User Two', email: 'user2@example.com' },
      ];
      
      mockGetServerSession.mockResolvedValue({ user: { name: 'admin' } } as any);
      mockIsAdmin.mockResolvedValue(true);
      mockListUsersWithAccessToReport.mockResolvedValue(mockUsers);
      
      const request = new Request('http://localhost/api/report-users?reportKey=test-key');
      const response = await GET(request as any);
      
      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.users).toEqual(mockUsers);
      expect(mockListUsersWithAccessToReport).toHaveBeenCalledWith('test-key');
    });

    it('should return empty array when no users have access', async () => {
      mockGetServerSession.mockResolvedValue({ user: { name: 'admin' } } as any);
      mockIsAdmin.mockResolvedValue(true);
      mockListUsersWithAccessToReport.mockResolvedValue([]);
      
      const request = new Request('http://localhost/api/report-users?reportKey=test-key');
      const response = await GET(request as any);
      
      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.users).toEqual([]);
    });

    it('should return 500 when listUsersWithAccessToReport throws an error', async () => {
      mockGetServerSession.mockResolvedValue({ user: { name: 'admin' } } as any);
      mockIsAdmin.mockResolvedValue(true);
      mockListUsersWithAccessToReport.mockRejectedValue(new Error('Database error'));
      
      const request = new Request('http://localhost/api/report-users?reportKey=test-key');
      const response = await GET(request as any);
      
      expect(response.status).toBe(500);
      const data = await response.json();
      expect(data.error).toBe('Database error');
    });

    it('should return 500 with generic message when error has no message', async () => {
      mockGetServerSession.mockResolvedValue({ user: { name: 'admin' } } as any);
      mockIsAdmin.mockResolvedValue(true);
      mockListUsersWithAccessToReport.mockRejectedValue(new Error());
      
      const request = new Request('http://localhost/api/report-users?reportKey=test-key');
      const response = await GET(request as any);
      
      expect(response.status).toBe(500);
      const data = await response.json();
      expect(data.error).toBe('Failed to list users for report');
    });

    it('should handle isAdmin throwing an error', async () => {
      mockGetServerSession.mockResolvedValue({ user: { name: 'testuser' } } as any);
      mockIsAdmin.mockRejectedValue(new Error('Admin check failed'));
      
      const request = new Request('http://localhost/api/report-users?reportKey=test-key');
      
      // This should throw since isAdmin is awaited without try/catch
      await expect(GET(request as any)).rejects.toThrow('Admin check failed');
    });

    it('should handle session without user object', async () => {
      mockGetServerSession.mockResolvedValue({ user: undefined } as any);
      
      const request = new Request('http://localhost/api/report-users?reportKey=test-key');
      const response = await GET(request as any);
      
      expect(response.status).toBe(403);
      const data = await response.json();
      expect(data.error).toBe('Forbidden');
    });

    it('should handle whitespace-only reportKey as empty', async () => {
      mockGetServerSession.mockResolvedValue({ user: { name: 'admin' } } as any);
      mockIsAdmin.mockResolvedValue(true);
      
      // URL decodes %20 to space, so "   " becomes valid but still empty after || ''
      const request = new Request('http://localhost/api/report-users?reportKey=   ');
      const response = await GET(request as any);
      
      expect(response.status).toBe(400);
      const data = await response.json();
      expect(data.error).toBe('reportKey is required');
    });
  });
});