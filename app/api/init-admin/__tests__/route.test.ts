import { describe, it, expect, beforeEach, vi } from 'vitest';
import { NextRequest } from 'next/server';

// Mock the next-auth module
vi.mock('next-auth/next', () => ({
  getServerSession: vi.fn(),
}));

// Mock the access functions
vi.mock('../../../../lib/access', () => ({
  addAdmin: vi.fn(),
  isAdmin: vi.fn(),
  listAdmins: vi.fn(),
}));

// Mock the auth options
vi.mock('../../auth/[...nextauth]/route', () => ({
  authOptions: {},
}));

import { getServerSession } from 'next-auth/next';
import { addAdmin, isAdmin, listAdmins } from '../../../../lib/access';
import { POST } from '../route';

const mockGetServerSession = vi.mocked(getServerSession);
const mockAddAdmin = vi.mocked(addAdmin);
const mockIsAdmin = vi.mocked(isAdmin);
const mockListAdmins = vi.mocked(listAdmins);

describe('POST /api/init-admin', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should reject requests without authentication', async () => {
    mockGetServerSession.mockResolvedValue(null);
    
    const request = new NextRequest('http://localhost:3000/api/init-admin', {
      method: 'POST',
      body: JSON.stringify({ username: 'testuser' }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data.error).toBe('Authentication required');
    expect(mockAddAdmin).not.toHaveBeenCalled();
  });

  it('should allow first admin creation when no admins exist', async () => {
    mockGetServerSession.mockResolvedValue({ 
      user: { name: 'firstuser' } 
    });
    mockListAdmins.mockResolvedValue([]); // No existing admins
    mockIsAdmin.mockResolvedValue(false);
    mockAddAdmin.mockResolvedValue(undefined);

    const request = new NextRequest('http://localhost:3000/api/init-admin', {
      method: 'POST',
      body: JSON.stringify({ username: 'newadmin' }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(mockAddAdmin).toHaveBeenCalledWith('newadmin');
  });

  it('should reject non-admin users when admins exist', async () => {
    mockGetServerSession.mockResolvedValue({ 
      user: { name: 'normaluser' } 
    });
    mockListAdmins.mockResolvedValue(['existingadmin']); // Admins exist
    mockIsAdmin.mockResolvedValue(false); // Current user is not admin
    
    const request = new NextRequest('http://localhost:3000/api/init-admin', {
      method: 'POST',
      body: JSON.stringify({ username: 'newadmin' }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(403);
    expect(data.error).toBe('Only existing administrators can create new admin users');
    expect(mockAddAdmin).not.toHaveBeenCalled();
  });

  it('should allow admin users to create new admins', async () => {
    mockGetServerSession.mockResolvedValue({ 
      user: { name: 'existingadmin' } 
    });
    mockListAdmins.mockResolvedValue(['existingadmin']); // Admins exist
    mockIsAdmin.mockResolvedValue(true); // Current user is admin
    mockAddAdmin.mockResolvedValue(undefined);
    
    const request = new NextRequest('http://localhost:3000/api/init-admin', {
      method: 'POST',
      body: JSON.stringify({ username: 'newadmin' }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(mockAddAdmin).toHaveBeenCalledWith('newadmin');
  });

  it('should reject requests with missing username', async () => {
    mockGetServerSession.mockResolvedValue({ 
      user: { name: 'admin' } 
    });
    mockListAdmins.mockResolvedValue(['admin']);
    mockIsAdmin.mockResolvedValue(true);
    
    const request = new NextRequest('http://localhost:3000/api/init-admin', {
      method: 'POST',
      body: JSON.stringify({}), // No username
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe('Valid username is required');
    expect(mockAddAdmin).not.toHaveBeenCalled();
  });

  it('should reject requests with empty username', async () => {
    mockGetServerSession.mockResolvedValue({ 
      user: { name: 'admin' } 
    });
    mockListAdmins.mockResolvedValue(['admin']);
    mockIsAdmin.mockResolvedValue(true);
    
    const request = new NextRequest('http://localhost:3000/api/init-admin', {
      method: 'POST',
      body: JSON.stringify({ username: '   ' }), // Empty/whitespace username
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe('Valid username is required');
    expect(mockAddAdmin).not.toHaveBeenCalled();
  });

  it('should trim usernames before processing', async () => {
    mockGetServerSession.mockResolvedValue({ 
      user: { name: 'admin' } 
    });
    mockListAdmins.mockResolvedValue(['admin']);
    mockIsAdmin.mockResolvedValue(true);
    mockAddAdmin.mockResolvedValue(undefined);
    
    const request = new NextRequest('http://localhost:3000/api/init-admin', {
      method: 'POST',
      body: JSON.stringify({ username: '  newadmin  ' }), // Username with spaces
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(mockAddAdmin).toHaveBeenCalledWith('newadmin'); // Should be trimmed
  });
});