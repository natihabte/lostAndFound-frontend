import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SearchBar from '../SearchBar';

describe('SearchBar', () => {
  const mockOnChange = vi.fn();
  const mockOnSubmit = vi.fn();
  const defaultProps = {
    value: '',
    onChange: mockOnChange,
    onSubmit: mockOnSubmit
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders search input and button', () => {
    render(<SearchBar {...defaultProps} />);
    
    expect(screen.getByPlaceholderText('Search by title, description, or location...')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Search' })).toBeInTheDocument();
  });

  it('displays the current value in input', () => {
    render(<SearchBar {...defaultProps} value="test search" />);
    
    const input = screen.getByDisplayValue('test search');
    expect(input).toBeInTheDocument();
  });

  it('calls onChange when user types in input', async () => {
    const user = userEvent.setup();
    render(<SearchBar {...defaultProps} />);
    
    const input = screen.getByPlaceholderText('Search by title, description, or location...');
    await user.type(input, 'iPhone');
    
    expect(mockOnChange).toHaveBeenCalledTimes(6); // One call per character
    expect(mockOnChange).toHaveBeenLastCalledWith('iPhone');
  });

  it('calls onSubmit when form is submitted via button click', async () => {
    const user = userEvent.setup();
    render(<SearchBar {...defaultProps} />);
    
    const button = screen.getByRole('button', { name: 'Search' });
    await user.click(button);
    
    expect(mockOnSubmit).toHaveBeenCalledTimes(1);
  });

  it('calls onSubmit when Enter key is pressed in input', () => {
    render(<SearchBar {...defaultProps} />);
    
    const input = screen.getByPlaceholderText('Search by title, description, or location...');
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });
    
    expect(mockOnSubmit).toHaveBeenCalledTimes(1);
  });

  it('prevents default form submission behavior', () => {
    render(<SearchBar {...defaultProps} />);
    
    const form = screen.getByRole('button', { name: 'Search' }).closest('form');
    const submitEvent = new Event('submit', { bubbles: true, cancelable: true });
    const preventDefaultSpy = vi.spyOn(submitEvent, 'preventDefault');
    
    fireEvent(form, submitEvent);
    
    expect(preventDefaultSpy).toHaveBeenCalled();
  });

  it('has correct styling classes', () => {
    render(<SearchBar {...defaultProps} />);
    
    const input = screen.getByPlaceholderText('Search by title, description, or location...');
    const button = screen.getByRole('button', { name: 'Search' });
    
    expect(input).toHaveClass('flex-1', 'border', 'rounded-md', 'px-3', 'py-2');
    expect(button).toHaveClass('px-4', 'py-2', 'bg-indigo-600', 'text-white', 'rounded-md');
  });

  it('focuses input when clicked', async () => {
    const user = userEvent.setup();
    render(<SearchBar {...defaultProps} />);
    
    const input = screen.getByPlaceholderText('Search by title, description, or location...');
    await user.click(input);
    
    expect(input).toHaveFocus();
  });

  it('handles empty search submission', async () => {
    const user = userEvent.setup();
    render(<SearchBar {...defaultProps} value="" />);
    
    const button = screen.getByRole('button', { name: 'Search' });
    await user.click(button);
    
    expect(mockOnSubmit).toHaveBeenCalledTimes(1);
  });

  it('handles special characters in search', async () => {
    const user = userEvent.setup();
    render(<SearchBar {...defaultProps} />);
    
    const input = screen.getByPlaceholderText('Search by title, description, or location...');
    await user.type(input, '!@#$%^&*()');
    
    expect(mockOnChange).toHaveBeenCalledWith('!@#$%^&*()');
  });

  it('handles long search queries', async () => {
    const user = userEvent.setup();
    const longQuery = 'This is a very long search query that exceeds normal length expectations';
    render(<SearchBar {...defaultProps} />);
    
    const input = screen.getByPlaceholderText('Search by title, description, or location...');
    await user.type(input, longQuery);
    
    expect(mockOnChange).toHaveBeenLastCalledWith(longQuery);
  });
});