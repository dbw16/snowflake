import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import AuthWrapper from '../AuthWrapper';

// Mock next-auth/react
vi.mock('next-auth/react', () => ({
  SessionProvider: vi.fn(({ children }) => <div data-testid="session-provider">{children}</div>),
}));

describe('AuthWrapper Component', () => {
  it('renders children wrapped in SessionProvider', () => {
    render(
      <AuthWrapper>
        <div data-testid="child-content">Test Content</div>
      </AuthWrapper>
    );

    expect(screen.getByTestId('session-provider')).toBeInTheDocument();
    expect(screen.getByTestId('child-content')).toBeInTheDocument();
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('passes multiple children to SessionProvider', () => {
    render(
      <AuthWrapper>
        <div data-testid="child-1">First Child</div>
        <div data-testid="child-2">Second Child</div>
      </AuthWrapper>
    );

    expect(screen.getByTestId('session-provider')).toBeInTheDocument();
    expect(screen.getByTestId('child-1')).toBeInTheDocument();
    expect(screen.getByTestId('child-2')).toBeInTheDocument();
  });

  it('handles null/undefined children gracefully', () => {
    render(<AuthWrapper>{null}</AuthWrapper>);
    
    expect(screen.getByTestId('session-provider')).toBeInTheDocument();
  });
});