import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import DeprecationNotice from '../DeprecationNotice';

describe('DeprecationNotice', () => {
  it('renders the heads up message and link', () => {
    render(<DeprecationNotice />);
    expect(
      screen.getByRole('heading', { name: /heads up: medium isn’t using this tool anymore/i }),
    ).toBeInTheDocument();
    const link = screen.getByRole('link', { name: /read more/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute(
      'href',
      'https://medium.engineering/engineering-growth-at-medium-4935b3234d25',
    );
  });
});
