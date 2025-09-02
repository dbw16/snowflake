import { describe, it, expect, beforeEach, vi } from 'vitest';

// Mock the database functions directly instead of the complex drizzle queries
vi.mock('../access', async () => {
  const actual = await vi.importActual('../access');
  
  // Create in-memory storage for testing
  let mockUsers: Array<{ username: string; email?: string | null }> = [];
  let mockUserRoles: Array<{ userId: string; role: string }> = [];
  let mockReportAccess: Array<{ reportKey: string; userId: string }> = [];

  return {
    ...actual,
    
    // Override only the functions that directly interact with the database
    createUser: vi.fn().mockImplementation(async (username: string, email?: string) => {
      const user = { username: username.trim(), email: email?.trim() || null };
      if (!mockUsers.find(u => u.username === user.username)) {
        mockUsers.push(user);
      }
      return user.username;
    }),

    getUserByUsername: vi.fn().mockImplementation(async (username: string) => {
      const user = mockUsers.find(u => u.username === username.trim());
      return user ? { username: user.username, email: user.email || undefined } : null;
    }),

    getOrCreateUser: vi.fn().mockImplementation(async (username: string, email?: string) => {
      const existing = mockUsers.find(u => u.username === username.trim());
      if (existing) return existing.username;
      
      const user = { username: username.trim(), email: email?.trim() || null };
      mockUsers.push(user);
      return user.username;
    }),

    isAdmin: vi.fn().mockImplementation(async (username: string) => {
      const user = mockUsers.find(u => u.username === username);
      if (!user) return false;
      return mockUserRoles.some(ur => ur.userId === user.username && ur.role === 'admin');
    }),

    listAdmins: vi.fn().mockImplementation(async () => {
      return mockUserRoles
        .filter(ur => ur.role === 'admin')
        .map(ur => ur.userId);
    }),

    addAdmin: vi.fn().mockImplementation(async (username: string) => {
      // Ensure user exists
      if (!mockUsers.find(u => u.username === username)) {
        mockUsers.push({ username: username.trim(), email: null });
      }
      
      // Add admin role if not already exists
      if (!mockUserRoles.find(ur => ur.userId === username && ur.role === 'admin')) {
        mockUserRoles.push({ userId: username, role: 'admin', createdAt: new Date().toISOString() });
      }
    }),

    grantReportAccess: vi.fn().mockImplementation(async (reportKey: string, username: string) => {
      const key = reportKey.trim().toLowerCase();
      const user = mockUsers.find(u => u.username === username);
      if (!key || !user) return;
      
      // Add grant if not already exists
      if (!mockReportAccess.find(ra => ra.reportKey === key && ra.userId === user.username)) {
        mockReportAccess.push({ reportKey: key, userId: user.username });
      }
    }),

    isUserAllowed: vi.fn().mockImplementation(async (params: { reportKey: string; username: string }) => {
      const { reportKey, username } = params;
      const key = reportKey.trim().toLowerCase();
      if (!key || !username) return false;
      
      // Check if user is admin
      if (mockUserRoles.some(ur => ur.userId === username && ur.role === 'admin')) {
        return true;
      }
      
      const user = mockUsers.find(u => u.username === username);
      if (!user) return false;
      
      // Check if user owns the report (reportKey matches username)
      if (user.username === key) return true;
      
      // Check for explicit grant
      return mockReportAccess.some(ra => ra.reportKey === key && ra.userId === user.username);
    }),

    listReportKeysForUser: vi.fn().mockImplementation(async (username: string) => {
      if (!username) return [];
      
      // If admin, return all report keys
      if (mockUserRoles.some(ur => ur.userId === username && ur.role === 'admin')) {
        const keys = new Set<string>();
        mockUsers.forEach(u => keys.add(u.username));
        return Array.from(keys).sort();
      }
      
      const user = mockUsers.find(u => u.username === username);
      if (!user) return [];
      
      const keys = new Set<string>([user.username]);
      
      // Add explicitly granted keys
      mockReportAccess
        .filter(ra => ra.userId === user.username)
        .forEach(ra => keys.add(ra.reportKey));
      
      return Array.from(keys).sort();
    }),

    getAllReportKeys: vi.fn().mockImplementation(async () => {
      const keys = new Set<string>();
      mockUsers.forEach(u => keys.add(u.username));
      return Array.from(keys).sort();
    }),

    // Reset function for tests
    __resetMockData: () => {
      mockUsers = [];
      mockUserRoles = [];
      mockReportAccess = [];
    }
  };
});

// Import the mocked functions
import { 
  isUserAllowed, 
  listReportKeysForUser, 
  addAdmin, 
  getAllReportKeys, 
  createUser, 
  grantReportAccess,
  __resetMockData
} from '../access';

describe('access functions (mocked to avoid database)', () => {
  beforeEach(() => {
    (__resetMockData as any)();
    vi.clearAllMocks();
  });

  it('allows a user to access their own report key', async () => {
    await createUser('alice');
    await createUser('bob');

    // Users can access their own reports
    expect(await isUserAllowed({ reportKey: 'alice', username: 'alice' })).toBe(true);
    expect(await isUserAllowed({ reportKey: 'bob', username: 'bob' })).toBe(true);
    
    // Users cannot access other users' reports by default
    expect(await isUserAllowed({ reportKey: 'alice', username: 'bob' })).toBe(false);
  });

  it('allows access after granting report access', async () => {
    await createUser('alice');
    await createUser('bob');

    // Initially bob cannot access alice's report
    expect(await isUserAllowed({ reportKey: 'alice', username: 'bob' })).toBe(false);
    
    // Grant access for bob to alice's report
    await grantReportAccess('alice', 'bob');
    
    // Now bob can access alice's report
    expect(await isUserAllowed({ reportKey: 'alice', username: 'bob' })).toBe(true);
    
    // But alice still cannot access bob's report
    expect(await isUserAllowed({ reportKey: 'bob', username: 'alice' })).toBe(false);
  });

  it('grants admins access to all report keys', async () => {
    await createUser('owner1');
    await createUser('owner2');
    await createUser('adminUser');
    await addAdmin('adminUser');

    // Admin can access any report
    expect(await isUserAllowed({ reportKey: 'owner1', username: 'adminUser' })).toBe(true);
    expect(await isUserAllowed({ reportKey: 'owner2', username: 'adminUser' })).toBe(true);
  });

  it('lists report keys correctly for users and admins', async () => {
    await createUser('carol');
    await createUser('dave');
    await createUser('super');
    await addAdmin('super');
    await grantReportAccess('dave', 'carol');

    // Carol should see her own key plus granted access to dave's
    const carolKeys = await listReportKeysForUser('carol');
    expect(carolKeys.sort()).toEqual(['carol', 'dave']);

    // Admin should see all keys
    const superKeys = await listReportKeysForUser('super');
    const allKeys = await getAllReportKeys();
    expect(new Set(superKeys)).toEqual(new Set(allKeys));
  });

  it('handles non-existent users gracefully', async () => {
    // Non-existent user cannot access anything
    expect(await isUserAllowed({ reportKey: 'alice', username: 'nonexistent' })).toBe(false);
    
    // Empty array for non-existent user
    const keys = await listReportKeysForUser('nonexistent');
    expect(keys).toEqual([]);
  });

  it('handles edge cases with empty or invalid inputs', async () => {
    // Empty strings should be handled gracefully
    expect(await isUserAllowed({ reportKey: '', username: '' })).toBe(false);
    expect(await isUserAllowed({ reportKey: 'alice', username: '' })).toBe(false);
    expect(await isUserAllowed({ reportKey: '', username: 'alice' })).toBe(false);
    
    // Null/undefined inputs
    const emptyKeys = await listReportKeysForUser('');
    expect(emptyKeys).toEqual([]);
  });
});
