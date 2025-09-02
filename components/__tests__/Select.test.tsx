import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Select, { SelectOption } from '../Select';

const mockOptions: SelectOption[] = [
  { value: 'option1', label: 'Option 1' },
  { value: 'option2', label: 'Option 2' },
  { value: 'option3', label: 'Another Option' },
  { value: 'option4', label: 'Different Choice' },
];

describe('Select Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders with placeholder text', () => {
    render(
      <Select
        options={mockOptions}
        name="test-select"
        placeholder="Choose an option"
      />
    );

    expect(screen.getByPlaceholderText('Choose an option')).toBeInTheDocument();
  });

  it('renders with default placeholder when none provided', () => {
    render(<Select options={mockOptions} name="test-select" />);

    expect(screen.getByPlaceholderText('Select…')).toBeInTheDocument();
  });

  it('shows options when input is focused', async () => {
    const user = userEvent.setup();
    render(<Select options={mockOptions} name="test-select" />);

    const input = screen.getByPlaceholderText('Select…');
    await user.click(input);

    expect(screen.getByRole('listbox')).toBeInTheDocument();
    expect(screen.getByText('Option 1')).toBeInTheDocument();
    expect(screen.getByText('Option 2')).toBeInTheDocument();
  });

  it('filters options based on input text', async () => {
    const user = userEvent.setup();
    render(<Select options={mockOptions} name="test-select" />);

    const input = screen.getByPlaceholderText('Select…');
    await user.type(input, 'Another');

    expect(screen.getByText('Another Option')).toBeInTheDocument();
    expect(screen.queryByText('Option 1')).not.toBeInTheDocument();
    expect(screen.queryByText('Option 2')).not.toBeInTheDocument();
  });

  it('calls onValueChange when an option is selected', async () => {
    const mockOnChange = vi.fn();
    const user = userEvent.setup();
    
    render(
      <Select
        options={mockOptions}
        name="test-select"
        onValueChange={mockOnChange}
      />
    );

    const input = screen.getByPlaceholderText('Select…');
    await user.click(input);
    await user.click(screen.getByText('Option 1'));

    expect(mockOnChange).toHaveBeenCalledWith('option1');
  });

  it('updates input value when an option is selected', async () => {
    const user = userEvent.setup();
    render(<Select options={mockOptions} name="test-select" />);

    const input = screen.getByPlaceholderText('Select…') as HTMLInputElement;
    await user.click(input);
    await user.click(screen.getByText('Option 2'));

    expect(input.value).toBe('Option 2');
  });

  it('closes dropdown when an option is selected', async () => {
    const user = userEvent.setup();
    render(<Select options={mockOptions} name="test-select" />);

    const input = screen.getByPlaceholderText('Select…');
    await user.click(input);
    
    expect(screen.getByRole('listbox')).toBeInTheDocument();
    
    await user.click(screen.getByText('Option 1'));
    
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  it('supports controlled value prop', () => {
    render(
      <Select
        options={mockOptions}
        name="test-select"
        value="option2"
      />
    );

    const input = screen.getByPlaceholderText('Select…') as HTMLInputElement;
    expect(input.value).toBe('Option 2');
  });

  it('updates input when controlled value changes', () => {
    const { rerender } = render(
      <Select
        options={mockOptions}
        name="test-select"
        value="option1"
      />
    );

    const input = screen.getByPlaceholderText('Select…') as HTMLInputElement;
    expect(input.value).toBe('Option 1');

    rerender(
      <Select
        options={mockOptions}
        name="test-select"
        value="option3"
      />
    );

    expect(input.value).toBe('Another Option');
  });

  it('navigates options with keyboard arrows', async () => {
    const user = userEvent.setup();
    render(<Select options={mockOptions} name="test-select" />);

    const input = screen.getByPlaceholderText('Select…');
    await user.click(input);

    // Use ArrowDown to navigate
    await user.keyboard('{ArrowDown}');
    
    const firstOption = screen.getByText('Option 1');
    expect(firstOption).toHaveAttribute('aria-selected', 'true');

    await user.keyboard('{ArrowDown}');
    
    const secondOption = screen.getByText('Option 2');
    expect(secondOption).toHaveAttribute('aria-selected', 'true');
    expect(firstOption).toHaveAttribute('aria-selected', 'false');
  });

  it('selects option with Enter key', async () => {
    const mockOnChange = vi.fn();
    const user = userEvent.setup();
    
    render(
      <Select
        options={mockOptions}
        name="test-select"
        onValueChange={mockOnChange}
      />
    );

    const input = screen.getByPlaceholderText('Select…');
    await user.click(input);
    await user.keyboard('{ArrowDown}');
    await user.keyboard('{Enter}');

    expect(mockOnChange).toHaveBeenCalledWith('option1');
  });

  it('closes dropdown with Escape key', async () => {
    const user = userEvent.setup();
    render(<Select options={mockOptions} name="test-select" />);

    const input = screen.getByPlaceholderText('Select…');
    await user.click(input);
    
    expect(screen.getByRole('listbox')).toBeInTheDocument();
    
    await user.keyboard('{Escape}');
    
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  it('opens dropdown with arrow keys when closed', async () => {
    const user = userEvent.setup();
    render(<Select options={mockOptions} name="test-select" />);

    const input = screen.getByPlaceholderText('Select…');
    input.focus();
    
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    
    await user.keyboard('{ArrowDown}');
    
    expect(screen.getByRole('listbox')).toBeInTheDocument();
  });

  it('closes dropdown when clicking outside', async () => {
    const user = userEvent.setup();
    render(
      <div>
        <Select options={mockOptions} name="test-select" />
        <button>Outside Button</button>
      </div>
    );

    const input = screen.getByPlaceholderText('Select…');
    await user.click(input);
    
    expect(screen.getByRole('listbox')).toBeInTheDocument();
    
    await user.click(screen.getByText('Outside Button'));
    
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  it('calls onValueChange with undefined when invalid text is entered', async () => {
    const mockOnChange = vi.fn();
    const user = userEvent.setup();
    
    render(
      <Select
        options={mockOptions}
        name="test-select"
        onValueChange={mockOnChange}
      />
    );

    const input = screen.getByPlaceholderText('Select…');
    await user.type(input, 'Invalid Option');
    
    // Click outside to trigger validation
    await user.click(document.body);

    expect(mockOnChange).toHaveBeenCalledWith(undefined);
  });

  it('highlights option on mouse hover', async () => {
    const user = userEvent.setup();
    render(<Select options={mockOptions} name="test-select" />);

    const input = screen.getByPlaceholderText('Select…');
    await user.click(input);

    const option = screen.getByText('Option 2');
    await user.hover(option);

    expect(option).toHaveAttribute('aria-selected', 'true');
  });

  it('limits displayed options to 100', () => {
    const manyOptions = Array.from({ length: 150 }, (_, i) => ({
      value: `option${i}`,
      label: `Option ${i}`,
    }));

    render(<Select options={manyOptions} name="test-select" />);
    
    const input = screen.getByPlaceholderText('Select…');
    fireEvent.focus(input);

    const listbox = screen.getByRole('listbox');
    const options = listbox.querySelectorAll('[role="option"]');
    
    expect(options.length).toBe(100);
  });

  it('applies custom styles', () => {
    const customStyle = { backgroundColor: 'rgb(255, 0, 0)', padding: '10px' };
    
    render(
      <Select
        options={mockOptions}
        name="test-select"
        style={customStyle}
      />
    );

    const input = screen.getByPlaceholderText('Select…');
    expect(input).toHaveStyle('background-color: rgb(255, 0, 0)');
    expect(input).toHaveStyle('padding: 10px');
  });

  it('creates hidden select element for form submission', () => {
    const { container } = render(
      <Select options={mockOptions} name="test-select" id="test-id" />
    );

    const hiddenSelect = container.querySelector('select[name="test-select"]');
    expect(hiddenSelect).toBeInTheDocument();
    expect(hiddenSelect).toHaveAttribute('id', 'test-id');
    expect(hiddenSelect).toHaveStyle('display: none');
  });

  it('updates hidden select value when option is selected', async () => {
    const user = userEvent.setup();
    const { container } = render(
      <Select options={mockOptions} name="test-select" />
    );

    const input = screen.getByPlaceholderText('Select…');
    await user.click(input);
    await user.click(screen.getByText('Option 1'));

    const hiddenSelect = container.querySelector('select') as HTMLSelectElement;
    expect(hiddenSelect.value).toBe('option1');
  });
});