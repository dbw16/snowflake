import { describe, it, expect, beforeEach, vi } from 'vitest';
import { NextRequest } from 'next/server';

// Mock the next-auth module
vi.mock('next-auth/next', () => ({
  getServerSession: vi.fn(),
}));

// Mock the auth options
vi.mock('../../../../lib/auth', () => ({
  authOptions: {},
}));

// Mock the comments functions
vi.mock('../../../../lib/comments', () => ({
  addComment: vi.fn(),
  getComments: vi.fn(),
}));

// Mock the access functions
vi.mock('../../../../lib/access', () => ({
  isUserAllowed: vi.fn(),
}));

import { getServerSession } from 'next-auth/next';
import { addComment, getComments } from '../../../../lib/comments';
import { isUserAllowed } from '../../../../lib/access';
import { GET, POST } from '../route';

const mockGetServerSession = vi.mocked(getServerSession);
const mockAddComment = vi.mocked(addComment);
const mockGetComments = vi.mocked(getComments);
const mockIsUserAllowed = vi.mocked(isUserAllowed);

describe('GET /api/comments', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should reject requests without authentication', async () => {
    mockGetServerSession.mockResolvedValue(null);
    
    const request = new NextRequest('http://localhost:3000/api/comments?trackId=test&milestone=1&reportKey=user1', {
      method: 'GET',
    });

    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data.error).toBe('Unauthorized');
    expect(mockGetComments).not.toHaveBeenCalled();
  });

  it('should return 400 for missing required parameters', async () => {
    mockGetServerSession.mockResolvedValue({ user: { name: 'testuser' } });
    
    const request = new NextRequest('http://localhost:3000/api/comments', {
      method: 'GET',
    });

    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe('trackId, milestone, and reportKey are required');
  });

  it('should return 403 when user is not allowed access to the report', async () => {
    mockGetServerSession.mockResolvedValue({ user: { name: 'testuser' } });
    mockIsUserAllowed.mockResolvedValue(false);
    
    const request = new NextRequest('http://localhost:3000/api/comments?trackId=test&milestone=1&reportKey=user1', {
      method: 'GET',
    });

    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(403);
    expect(data.error).toBe('Forbidden');
    expect(mockIsUserAllowed).toHaveBeenCalledWith({ reportKey: 'user1', username: 'testuser' });
  });

  it('should return comments when user has access', async () => {
    const mockComments = [
      { id: '1', text: 'Test comment', authorId: 'testuser' },
      { id: '2', text: 'Another comment', authorId: 'otheruser' }
    ];

    mockGetServerSession.mockResolvedValue({ user: { name: 'testuser' } });
    mockIsUserAllowed.mockResolvedValue(true);
    mockGetComments.mockResolvedValue(mockComments);
    
    const request = new NextRequest('http://localhost:3000/api/comments?trackId=test&milestone=1&reportKey=user1', {
      method: 'GET',
    });

    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.comments).toEqual(mockComments);
    expect(mockGetComments).toHaveBeenCalledWith({
      trackId: 'test',
      milestone: 1,
      reportKey: 'user1',
      signalIndex: null
    });
  });

  it('should handle signalIndex parameter', async () => {
    mockGetServerSession.mockResolvedValue({ user: { name: 'testuser' } });
    mockIsUserAllowed.mockResolvedValue(true);
    mockGetComments.mockResolvedValue([]);
    
    const request = new NextRequest('http://localhost:3000/api/comments?trackId=test&milestone=1&reportKey=user1&signalIndex=5', {
      method: 'GET',
    });

    const response = await GET(request);

    expect(response.status).toBe(200);
    expect(mockGetComments).toHaveBeenCalledWith({
      trackId: 'test',
      milestone: 1,
      reportKey: 'user1',
      signalIndex: 5
    });
  });

  it('should handle errors gracefully', async () => {
    mockGetServerSession.mockResolvedValue({ user: { name: 'testuser' } });
    mockIsUserAllowed.mockResolvedValue(true);
    mockGetComments.mockRejectedValue(new Error('Database error'));
    
    const request = new NextRequest('http://localhost:3000/api/comments?trackId=test&milestone=1&reportKey=user1', {
      method: 'GET',
    });

    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.error).toBe('Database error');
  });
});

describe('POST /api/comments', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should reject requests without authentication', async () => {
    mockGetServerSession.mockResolvedValue(null);
    
    const request = new NextRequest('http://localhost:3000/api/comments', {
      method: 'POST',
      body: JSON.stringify({ trackId: 'test', milestone: 1, text: 'Test comment', reportKey: 'user1' }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data.error).toBe('Unauthorized');
    expect(mockAddComment).not.toHaveBeenCalled();
  });

  it('should return 400 for missing required parameters', async () => {
    mockGetServerSession.mockResolvedValue({ user: { name: 'testuser' } });
    
    const request = new NextRequest('http://localhost:3000/api/comments', {
      method: 'POST',
      body: JSON.stringify({ trackId: 'test' }), // Missing required fields
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe('trackId, milestone, text, and reportKey are required');
  });

  it('should return 403 when user is not allowed access to the report', async () => {
    mockGetServerSession.mockResolvedValue({ user: { name: 'testuser' } });
    mockIsUserAllowed.mockResolvedValue(false);
    
    const request = new NextRequest('http://localhost:3000/api/comments', {
      method: 'POST',
      body: JSON.stringify({ 
        trackId: 'test', 
        milestone: 1, 
        text: 'Test comment', 
        reportKey: 'user1' 
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(403);
    expect(data.error).toBe('Forbidden');
    expect(mockIsUserAllowed).toHaveBeenCalledWith({ reportKey: 'user1', username: 'testuser' });
  });

  it('should successfully add a comment when user has access', async () => {
    const mockComment = { id: 'new-comment-id', text: 'Test comment', authorName: 'testuser' };
    mockGetServerSession.mockResolvedValue({ user: { name: 'testuser' } });
    mockIsUserAllowed.mockResolvedValue(true);
    mockAddComment.mockResolvedValue(mockComment);
    
    const request = new NextRequest('http://localhost:3000/api/comments', {
      method: 'POST',
      body: JSON.stringify({ 
        trackId: 'test', 
        milestone: 1, 
        text: 'Test comment', 
        reportKey: 'user1' 
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(201);
    expect(data.comment).toEqual(mockComment);
    expect(mockAddComment).toHaveBeenCalledWith({
      trackId: 'test',
      milestone: 1,
      signalIndex: null,
      authorName: 'testuser',
      text: 'Test comment',
      reportKey: 'user1',
      parentId: null
    });
  });

  it('should handle signalIndex and parentId parameters', async () => {
    mockGetServerSession.mockResolvedValue({ user: { name: 'testuser' } });
    mockIsUserAllowed.mockResolvedValue(true);
    mockAddComment.mockResolvedValue({ id: 'comment-id' });
    
    const request = new NextRequest('http://localhost:3000/api/comments', {
      method: 'POST',
      body: JSON.stringify({ 
        trackId: 'test', 
        milestone: 1, 
        text: 'Reply comment', 
        reportKey: 'user1',
        signalIndex: 3,
        parentId: 'parent-comment-id'
      }),
    });

    const response = await POST(request);

    expect(response.status).toBe(201);
    expect(mockAddComment).toHaveBeenCalledWith({
      trackId: 'test',
      milestone: 1,
      signalIndex: 3,
      authorName: 'testuser',
      text: 'Reply comment',
      reportKey: 'user1',
      parentId: 'parent-comment-id'
    });
  });

  it('should NOT trim whitespace from text (current implementation)', async () => {
    mockGetServerSession.mockResolvedValue({ user: { name: 'testuser' } });
    mockIsUserAllowed.mockResolvedValue(true);
    mockAddComment.mockResolvedValue({ id: 'comment-id' });
    
    const request = new NextRequest('http://localhost:3000/api/comments', {
      method: 'POST',
      body: JSON.stringify({ 
        trackId: 'test', 
        milestone: 1, 
        text: '  Test comment with spaces  ', 
        reportKey: 'user1'
      }),
    });

    const response = await POST(request);

    expect(response.status).toBe(201);
    expect(mockAddComment).toHaveBeenCalledWith(
      expect.objectContaining({
        text: '  Test comment with spaces  ',
        authorName: 'testuser'
      })
    );
  });

  it('should handle errors gracefully', async () => {
    mockGetServerSession.mockResolvedValue({ user: { name: 'testuser' } });
    mockIsUserAllowed.mockResolvedValue(true);
    mockAddComment.mockRejectedValue(new Error('Database error'));
    
    const request = new NextRequest('http://localhost:3000/api/comments', {
      method: 'POST',
      body: JSON.stringify({ 
        trackId: 'test', 
        milestone: 1, 
        text: 'Test comment', 
        reportKey: 'user1' 
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.error).toBe('Database error');
  });
});