import { describe, it, expect, vi, beforeEach } from 'vitest';
import { POST, DELETE } from '../route';
import { getServerSession } from 'next-auth/next';
import { grantAccess, revokeAccess } from '../../../../lib/report-access';

// Mock dependencies
vi.mock('next-auth/next');
vi.mock('../../../../lib/report-access');

const mockGetServerSession = vi.mocked(getServerSession);
const mockGrantAccess = vi.mocked(grantAccess);
const mockRevokeAccess = vi.mocked(revokeAccess);

describe('Report Access API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('POST /api/report-access (Grant Access)', () => {
    it('should return 400 when reportKey is missing', async () => {
      const request = new Request('http://localhost/api/report-access', {
        method: 'POST',
        body: JSON.stringify({ userId: 'testuser' })
      });
      const response = await POST(request as any);
      
      expect(response.status).toBe(400);
      const data = await response.json();
      expect(data.error).toBe('reportKey and userId are required');
    });

    it('should return 400 when userId is missing', async () => {
      const request = new Request('http://localhost/api/report-access', {
        method: 'POST',
        body: JSON.stringify({ reportKey: 'test-key' })
      });
      const response = await POST(request as any);
      
      expect(response.status).toBe(400);
      const data = await response.json();
      expect(data.error).toBe('reportKey and userId are required');
    });

    it('should return 400 when both reportKey and userId are missing', async () => {
      const request = new Request('http://localhost/api/report-access', {
        method: 'POST',
        body: JSON.stringify({})
      });
      const response = await POST(request as any);
      
      expect(response.status).toBe(400);
      const data = await response.json();
      expect(data.error).toBe('reportKey and userId are required');
    });

    it('should return 403 when user is not the report owner', async () => {
      mockGetServerSession.mockResolvedValue({ user: { name: 'differentuser' } } as any);
      
      const request = new Request('http://localhost/api/report-access', {
        method: 'POST',
        body: JSON.stringify({ reportKey: 'reportowner', userId: 'testuser' })
      });
      const response = await POST(request as any);
      
      expect(response.status).toBe(403);
      const data = await response.json();
      expect(data.error).toBe('Forbidden');
    });

    it('should grant access when user is the report owner', async () => {
      const mockAccess = { id: 'access-1', reportKey: 'reportowner', userId: 'testuser' };
      mockGetServerSession.mockResolvedValue({ user: { name: 'reportowner' } } as any);
      mockGrantAccess.mockResolvedValue(mockAccess);
      
      const request = new Request('http://localhost/api/report-access', {
        method: 'POST',
        body: JSON.stringify({ reportKey: 'reportowner', userId: 'testuser' })
      });
      const response = await POST(request as any);
      
      expect(response.status).toBe(201);
      const data = await response.json();
      expect(data.access).toEqual(mockAccess);
      expect(mockGrantAccess).toHaveBeenCalledWith({ reportKey: 'reportowner', userId: 'testuser' });
    });

    it('should handle case when session user name is empty', async () => {
      mockGetServerSession.mockResolvedValue({ user: { name: '' } } as any);
      
      const request = new Request('http://localhost/api/report-access', {
        method: 'POST',
        body: JSON.stringify({ reportKey: 'reportowner', userId: 'testuser' })
      });
      const response = await POST(request as any);
      
      expect(response.status).toBe(403);
      const data = await response.json();
      expect(data.error).toBe('Forbidden');
    });

    it('should handle case when session user is undefined', async () => {
      mockGetServerSession.mockResolvedValue({ user: undefined } as any);
      
      const request = new Request('http://localhost/api/report-access', {
        method: 'POST',
        body: JSON.stringify({ reportKey: 'reportowner', userId: 'testuser' })
      });
      const response = await POST(request as any);
      
      expect(response.status).toBe(403);
      const data = await response.json();
      expect(data.error).toBe('Forbidden');
    });

    it('should return 500 when grantAccess throws an error', async () => {
      mockGetServerSession.mockResolvedValue({ user: { name: 'reportowner' } } as any);
      mockGrantAccess.mockRejectedValue(new Error('Database error'));
      
      const request = new Request('http://localhost/api/report-access', {
        method: 'POST',
        body: JSON.stringify({ reportKey: 'reportowner', userId: 'testuser' })
      });
      const response = await POST(request as any);
      
      expect(response.status).toBe(500);
      const data = await response.json();
      expect(data.error).toBe('Database error');
    });

    it('should return 500 with generic message when error has no message', async () => {
      mockGetServerSession.mockResolvedValue({ user: { name: 'reportowner' } } as any);
      mockGrantAccess.mockRejectedValue(new Error());
      
      const request = new Request('http://localhost/api/report-access', {
        method: 'POST',
        body: JSON.stringify({ reportKey: 'reportowner', userId: 'testuser' })
      });
      const response = await POST(request as any);
      
      expect(response.status).toBe(500);
      const data = await response.json();
      expect(data.error).toBe('Failed to grant access');
    });
  });

  describe('DELETE /api/report-access (Revoke Access)', () => {
    it('should return 400 when reportKey is missing', async () => {
      const request = new Request('http://localhost/api/report-access', {
        method: 'DELETE',
        body: JSON.stringify({ userId: 'testuser' })
      });
      const response = await DELETE(request as any);
      
      expect(response.status).toBe(400);
      const data = await response.json();
      expect(data.error).toBe('reportKey and userId are required');
    });

    it('should return 400 when userId is missing', async () => {
      const request = new Request('http://localhost/api/report-access', {
        method: 'DELETE',
        body: JSON.stringify({ reportKey: 'test-key' })
      });
      const response = await DELETE(request as any);
      
      expect(response.status).toBe(400);
      const data = await response.json();
      expect(data.error).toBe('reportKey and userId are required');
    });

    it('should return 403 when user is not the report owner', async () => {
      mockGetServerSession.mockResolvedValue({ user: { name: 'differentuser' } } as any);
      
      const request = new Request('http://localhost/api/report-access', {
        method: 'DELETE',
        body: JSON.stringify({ reportKey: 'reportowner', userId: 'testuser' })
      });
      const response = await DELETE(request as any);
      
      expect(response.status).toBe(403);
      const data = await response.json();
      expect(data.error).toBe('Forbidden');
    });

    it('should revoke access when user is the report owner', async () => {
      const mockAccess = { id: 'access-1', reportKey: 'reportowner', userId: 'testuser' };
      mockGetServerSession.mockResolvedValue({ user: { name: 'reportowner' } } as any);
      mockRevokeAccess.mockResolvedValue(mockAccess);
      
      const request = new Request('http://localhost/api/report-access', {
        method: 'DELETE',
        body: JSON.stringify({ reportKey: 'reportowner', userId: 'testuser' })
      });
      const response = await DELETE(request as any);
      
      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.access).toEqual(mockAccess);
      expect(mockRevokeAccess).toHaveBeenCalledWith({ reportKey: 'reportowner', userId: 'testuser' });
    });

    it('should handle case when session user name is empty', async () => {
      mockGetServerSession.mockResolvedValue({ user: { name: '' } } as any);
      
      const request = new Request('http://localhost/api/report-access', {
        method: 'DELETE',
        body: JSON.stringify({ reportKey: 'reportowner', userId: 'testuser' })
      });
      const response = await DELETE(request as any);
      
      expect(response.status).toBe(403);
      const data = await response.json();
      expect(data.error).toBe('Forbidden');
    });

    it('should return 500 when revokeAccess throws an error', async () => {
      mockGetServerSession.mockResolvedValue({ user: { name: 'reportowner' } } as any);
      mockRevokeAccess.mockRejectedValue(new Error('Database error'));
      
      const request = new Request('http://localhost/api/report-access', {
        method: 'DELETE',
        body: JSON.stringify({ reportKey: 'reportowner', userId: 'testuser' })
      });
      const response = await DELETE(request as any);
      
      expect(response.status).toBe(500);
      const data = await response.json();
      expect(data.error).toBe('Database error');
    });

    it('should return 500 with generic message when error has no message', async () => {
      mockGetServerSession.mockResolvedValue({ user: { name: 'reportowner' } } as any);
      mockRevokeAccess.mockRejectedValue(new Error());
      
      const request = new Request('http://localhost/api/report-access', {
        method: 'DELETE',
        body: JSON.stringify({ reportKey: 'reportowner', userId: 'testuser' })
      });
      const response = await DELETE(request as any);
      
      expect(response.status).toBe(500);
      const data = await response.json();
      expect(data.error).toBe('Failed to revoke access');
    });
  });
});