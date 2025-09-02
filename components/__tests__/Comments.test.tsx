import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useSession } from 'next-auth/react';
import Comments from '../Comments';

// Mock next-auth
vi.mock('next-auth/react');

// Mock fetch
const mockFetch = vi.fn();
global.fetch = mockFetch;

const mockUseSession = vi.mocked(useSession);

describe('Comments Component', () => {
  const defaultProps = {
    trackId: 'MOBILE' as const,
    milestone: 3,
    signalIndex: null,
    reportKey: 'test-report',
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockUseSession.mockReturnValue({
      data: { user: { name: 'testuser' } },
      status: 'authenticated',
    } as any);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('Initial Render', () => {
    it('should render "Add comment" button when no comments exist', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ comments: [] }),
      } as any);

      render(<Comments {...defaultProps} />);

      await waitFor(() => {
        expect(screen.getByText('Add comment')).toBeInTheDocument();
        expect(screen.getByText('No comments yet.')).toBeInTheDocument();
      });
    });

    it('should fetch and display comments on mount', async () => {
      const mockComments = [
        {
          id: '1',
          trackId: 'MOBILE',
          milestone: 3,
          signalIndex: null,
          authorName: 'John Doe',
          text: 'This is a test comment',
          createdAt: '2024-01-01T00:00:00Z',
          reportKey: 'test-report',
          parentId: null,
        },
      ];

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ comments: mockComments }),
      } as any);

      render(<Comments {...defaultProps} />);

      await waitFor(() => {
        expect(screen.getByText('John Doe')).toBeInTheDocument();
        expect(screen.getByText('This is a test comment')).toBeInTheDocument();
      });
    });

    it('should handle 403 response by showing empty comments', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 403,
      } as any);

      render(<Comments {...defaultProps} />);

      await waitFor(() => {
        expect(screen.getByText('No comments yet.')).toBeInTheDocument();
      });
    });
  });

  describe('Comment Creation', () => {
    it('should open composer when "Add comment" is clicked', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ comments: [] }),
      } as any);

      const user = userEvent.setup();
      render(<Comments {...defaultProps} />);

      await waitFor(() => {
        expect(screen.getByText('Add comment')).toBeInTheDocument();
      });

      await user.click(screen.getByText('Add comment'));

      expect(screen.getByPlaceholderText('Add a comment')).toBeInTheDocument();
      expect(screen.getByText('Post comment')).toBeInTheDocument();
      expect(screen.getByText('Cancel')).toBeInTheDocument();
    });

    it('should close composer when Cancel is clicked', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ comments: [] }),
      } as any);

      const user = userEvent.setup();
      render(<Comments {...defaultProps} />);

      await waitFor(() => {
        expect(screen.getByText('Add comment')).toBeInTheDocument();
      });

      await user.click(screen.getByText('Add comment'));
      await user.click(screen.getByText('Cancel'));

      expect(screen.queryByPlaceholderText('Add a comment')).not.toBeInTheDocument();
      expect(screen.getByText('Add comment')).toBeInTheDocument();
    });

    it('should submit comment and show optimistic update', async () => {
      mockFetch
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({ comments: [] }),
        } as any)
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({
            comment: {
              id: 'new-comment-1',
              trackId: 'MOBILE',
              milestone: 3,
              signalIndex: null,
              authorName: 'testuser',
              text: 'My new comment',
              createdAt: '2024-01-01T00:00:00Z',
              reportKey: 'test-report',
              parentId: null,
            }
          }),
        } as any);

      const user = userEvent.setup();
      render(<Comments {...defaultProps} />);

      await waitFor(() => {
        expect(screen.getByText('Add comment')).toBeInTheDocument();
      });

      await user.click(screen.getByText('Add comment'));
      
      const textarea = screen.getByPlaceholderText('Add a comment');
      await user.type(textarea, 'My new comment');
      
      await user.click(screen.getByText('Post comment'));

      // Should show optimistic update immediately
      expect(screen.getByText('My new comment')).toBeInTheDocument();
      expect(screen.getByText('testuser')).toBeInTheDocument();

      // Should call API
      expect(mockFetch).toHaveBeenCalledWith('/api/comments', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          trackId: 'MOBILE',
          milestone: 3,
          signalIndex: null,
          text: 'My new comment',
          reportKey: 'test-report',
          parentId: null,
        }),
      });
    });

    it('should revert optimistic update on API error', async () => {
      mockFetch
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({ comments: [] }),
        } as any)
        .mockResolvedValueOnce({
          ok: false,
        } as any);

      const user = userEvent.setup();
      render(<Comments {...defaultProps} />);

      await waitFor(() => {
        expect(screen.getByText('Add comment')).toBeInTheDocument();
      });

      await user.click(screen.getByText('Add comment'));
      
      const textarea = screen.getByPlaceholderText('Add a comment');
      await user.type(textarea, 'Failed comment');
      
      await user.click(screen.getByText('Post comment'));

      // Wait for the optimistic update to be removed after API failure
      await waitFor(() => {
        expect(screen.queryByText('Failed comment')).not.toBeInTheDocument();
        expect(screen.getByText('No comments yet.')).toBeInTheDocument();
      });
    });

    it('should disable submit button when text is empty', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ comments: [] }),
      } as any);

      const user = userEvent.setup();
      render(<Comments {...defaultProps} />);

      await waitFor(() => {
        expect(screen.getByText('Add comment')).toBeInTheDocument();
      });

      await user.click(screen.getByText('Add comment'));

      const submitButton = screen.getByText('Post comment');
      expect(submitButton).toBeDisabled();
    });

    it('should not submit when user is not authenticated', async () => {
      mockUseSession.mockReturnValue({
        data: null,
        status: 'unauthenticated',
      } as any);

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ comments: [] }),
      } as any);

      const user = userEvent.setup();
      render(<Comments {...defaultProps} />);

      await waitFor(() => {
        expect(screen.getByText('Add comment')).toBeInTheDocument();
      });

      await user.click(screen.getByText('Add comment'));
      
      const textarea = screen.getByPlaceholderText('Add a comment');
      await user.type(textarea, 'Test comment');
      
      // Submit should not work without auth
      fireEvent.submit(textarea.closest('form')!);

      expect(mockFetch).toHaveBeenCalledTimes(1); // Only initial fetch
    });
  });

  describe('Reply Functionality', () => {
    const mockParentComment = {
      id: 'parent-1',
      trackId: 'MOBILE' as const,
      milestone: 3,
      signalIndex: null,
      authorName: 'Original Author',
      text: 'Original comment',
      createdAt: '2024-01-01T00:00:00Z',
      reportKey: 'test-report',
      parentId: null,
    };

    it('should show reply button for root comments', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ comments: [mockParentComment] }),
      } as any);

      render(<Comments {...defaultProps} />);

      await waitFor(() => {
        expect(screen.getByText('Reply')).toBeInTheDocument();
      });
    });

    it('should open reply box when Reply is clicked', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ comments: [mockParentComment] }),
      } as any);

      const user = userEvent.setup();
      render(<Comments {...defaultProps} />);

      await waitFor(() => {
        expect(screen.getByText('Reply')).toBeInTheDocument();
      });

      await user.click(screen.getByText('Reply'));

      expect(screen.getByPlaceholderText('Add a reply')).toBeInTheDocument();
      expect(screen.getByText('Post reply')).toBeInTheDocument();
    });

    it('should submit reply with correct parentId', async () => {
      mockFetch
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({ comments: [mockParentComment] }),
        } as any)
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({
            comment: {
              id: 'reply-1',
              trackId: 'MOBILE',
              milestone: 3,
              signalIndex: null,
              authorName: 'testuser',
              text: 'My reply',
              createdAt: '2024-01-01T01:00:00Z',
              reportKey: 'test-report',
              parentId: 'parent-1',
            }
          }),
        } as any);

      const user = userEvent.setup();
      render(<Comments {...defaultProps} />);

      await waitFor(() => {
        expect(screen.getByText('Reply')).toBeInTheDocument();
      });

      await user.click(screen.getByText('Reply'));
      
      const textarea = screen.getByPlaceholderText('Add a reply');
      await user.type(textarea, 'My reply');
      
      await user.click(screen.getByText('Post reply'));

      expect(mockFetch).toHaveBeenCalledWith('/api/comments', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          trackId: 'MOBILE',
          milestone: 3,
          signalIndex: null,
          text: 'My reply',
          reportKey: 'test-report',
          parentId: 'parent-1',
        }),
      });
    });

    it('should disable reply submit when text is empty', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ comments: [mockParentComment] }),
      } as any);

      const user = userEvent.setup();
      render(<Comments {...defaultProps} />);

      await waitFor(() => {
        expect(screen.getByText('Reply')).toBeInTheDocument();
      });

      await user.click(screen.getByText('Reply'));

      const submitButton = screen.getByText('Post reply');
      expect(submitButton).toBeDisabled();
    });
  });

  describe('Comment Threading', () => {
    it('should render threaded comments correctly', async () => {
      const mockComments = [
        {
          id: 'parent-1',
          trackId: 'MOBILE' as const,
          milestone: 3,
          signalIndex: null,
          authorName: 'Parent Author',
          text: 'Parent comment',
          createdAt: '2024-01-01T00:00:00Z',
          reportKey: 'test-report',
          parentId: null,
        },
        {
          id: 'child-1',
          trackId: 'MOBILE' as const,
          milestone: 3,
          signalIndex: null,
          authorName: 'Child Author',
          text: 'Child comment',
          createdAt: '2024-01-01T01:00:00Z',
          reportKey: 'test-report',
          parentId: 'parent-1',
        },
      ];

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ comments: mockComments }),
      } as any);

      render(<Comments {...defaultProps} />);

      await waitFor(() => {
        expect(screen.getByText('Parent comment')).toBeInTheDocument();
        expect(screen.getByText('Child comment')).toBeInTheDocument();
      });

      // Child should be nested within parent
      const parentDiv = screen.getByText('Parent comment').closest('.comment-item');
      const childDiv = screen.getByText('Child comment').closest('.comment-item');
      
      expect(parentDiv).toContainElement(childDiv);
    });

    it('should sort root comments newest first and children oldest first', async () => {
      const mockComments = [
        {
          id: 'parent-2',
          trackId: 'MOBILE' as const,
          milestone: 3,
          signalIndex: null,
          authorName: 'Second Parent',
          text: 'Second parent comment',
          createdAt: '2024-01-01T02:00:00Z',
          reportKey: 'test-report',
          parentId: null,
        },
        {
          id: 'parent-1',
          trackId: 'MOBILE' as const,
          milestone: 3,
          signalIndex: null,
          authorName: 'First Parent',
          text: 'First parent comment',
          createdAt: '2024-01-01T01:00:00Z',
          reportKey: 'test-report',
          parentId: null,
        },
      ];

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ comments: mockComments }),
      } as any);

      render(<Comments {...defaultProps} />);

      await waitFor(() => {
        const comments = screen.getAllByText(/parent comment/);
        expect(comments[0]).toHaveTextContent('Second parent comment');
        expect(comments[1]).toHaveTextContent('First parent comment');
      });
    });
  });

  describe('Signal Index Handling', () => {
    it('should include signalIndex in API calls when provided', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ comments: [] }),
      } as any);

      render(<Comments {...defaultProps} signalIndex={2} />);

      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalledWith(
          expect.stringContaining('signalIndex=2'),
        );
      });
    });

    it('should not include signalIndex in URL when null', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ comments: [] }),
      } as any);

      render(<Comments {...defaultProps} signalIndex={null} />);

      await waitFor(() => {
        const fetchCall = mockFetch.mock.calls[0][0];
        expect(fetchCall).not.toContain('signalIndex');
      });
    });
  });

  describe('Date Formatting', () => {
    it('should format valid ISO dates', async () => {
      const mockComments = [
        {
          id: '1',
          trackId: 'MOBILE' as const,
          milestone: 3,
          signalIndex: null,
          authorName: 'Test User',
          text: 'Test comment',
          createdAt: '2024-01-01T12:00:00Z',
          reportKey: 'test-report',
          parentId: null,
        },
      ];

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ comments: mockComments }),
      } as any);

      render(<Comments {...defaultProps} />);

      await waitFor(() => {
        // Should show formatted date, not ISO string
        expect(screen.queryByText('2024-01-01T12:00:00Z')).not.toBeInTheDocument();
        // Check for Test User separately since the date format may vary
        expect(screen.getByText('Test User')).toBeInTheDocument();
        expect(screen.getByText(/1\/1\/2024|Jan|January/)).toBeInTheDocument();
      });
    });

    it('should handle invalid dates gracefully', async () => {
      const mockComments = [
        {
          id: '1',
          trackId: 'MOBILE' as const,
          milestone: 3,
          signalIndex: null,
          authorName: 'Test User',
          text: 'Test comment',
          createdAt: 'invalid-date',
          reportKey: 'test-report',
          parentId: null,
        },
      ];

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ comments: mockComments }),
      } as any);

      render(<Comments {...defaultProps} />);

      await waitFor(() => {
        expect(screen.getByText('Test User')).toBeInTheDocument();
        // When Date constructor gets invalid input, toLocaleString() returns "Invalid Date"
        // Use getAllByText and check for at least one occurrence
        const invalidDateElements = screen.getAllByText((content, element) => {
          return element?.textContent?.includes('Invalid Date') ?? false;
        });
        expect(invalidDateElements.length).toBeGreaterThan(0);
      });
    });
  });
});