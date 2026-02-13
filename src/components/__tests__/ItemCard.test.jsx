import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import ItemCard from '../ItemCard';

// Mock framer-motion to avoid animation issues in tests
vi.mock('framer-motion', () => ({
  motion: {
    article: ({ children, ...props }) => <article {...props}>{children}</article>
  }
}));

const mockItem = {
  id: '1',
  title: 'Lost iPhone 13',
  category: 'Electronics',
  description: 'Black iPhone 13 with blue case, lost in library',
  status: 'Lost',
  location: 'Main Library',
  createdAt: '2024-01-15T10:30:00Z',
  photo: 'https://example.com/photo.jpg'
};

const renderWithRouter = (component) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

describe('ItemCard', () => {
  it('renders item information correctly', () => {
    renderWithRouter(<ItemCard item={mockItem} />);
    
    expect(screen.getByText('Lost iPhone 13')).toBeInTheDocument();
    expect(screen.getByText('Electronics • 1/15/2024')).toBeInTheDocument();
    expect(screen.getByText('Black iPhone 13 with blue case, lost in library')).toBeInTheDocument();
    expect(screen.getByText('Lost')).toBeInTheDocument();
    expect(screen.getByText('Main Library')).toBeInTheDocument();
  });

  it('displays item photo when available', () => {
    renderWithRouter(<ItemCard item={mockItem} />);
    
    const image = screen.getByAltText('Lost iPhone 13');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', 'https://example.com/photo.jpg');
  });

  it('displays placeholder when no photo available', () => {
    const itemWithoutPhoto = { ...mockItem, photo: null };
    renderWithRouter(<ItemCard item={itemWithoutPhoto} />);
    
    expect(screen.getByText('Photo')).toBeInTheDocument();
    expect(screen.queryByAltText('Lost iPhone 13')).not.toBeInTheDocument();
  });

  it('applies correct status styling for Lost items', () => {
    renderWithRouter(<ItemCard item={mockItem} />);
    
    const statusBadge = screen.getByText('Lost');
    expect(statusBadge).toHaveClass('bg-red-100', 'text-red-700');
  });

  it('applies correct status styling for Found items', () => {
    const foundItem = { ...mockItem, status: 'Found' };
    renderWithRouter(<ItemCard item={foundItem} />);
    
    const statusBadge = screen.getByText('Found');
    expect(statusBadge).toHaveClass('bg-green-100', 'text-green-700');
  });

  it('applies correct status styling for Claimed items', () => {
    const claimedItem = { ...mockItem, status: 'Claimed' };
    renderWithRouter(<ItemCard item={claimedItem} />);
    
    const statusBadge = screen.getByText('Claimed');
    expect(statusBadge).toHaveClass('bg-yellow-100', 'text-yellow-700');
  });

  it('creates correct link to item detail page', () => {
    renderWithRouter(<ItemCard item={mockItem} />);
    
    const link = screen.getByRole('link', { name: 'Lost iPhone 13' });
    expect(link).toHaveAttribute('href', '/items/1');
  });

  it('formats date correctly', () => {
    const itemWithDifferentDate = {
      ...mockItem,
      createdAt: '2024-12-25T15:45:00Z'
    };
    renderWithRouter(<ItemCard item={itemWithDifferentDate} />);
    
    expect(screen.getByText(/Electronics • 12\/25\/2024/)).toBeInTheDocument();
  });

  it('handles long descriptions with line clamp', () => {
    const itemWithLongDescription = {
      ...mockItem,
      description: 'This is a very long description that should be truncated with line clamp to prevent the card from becoming too tall and maintain consistent layout across all item cards in the grid.'
    };
    renderWithRouter(<ItemCard item={itemWithLongDescription} />);
    
    const description = screen.getByText(/This is a very long description/);
    expect(description).toHaveClass('line-clamp-2');
  });

  it('handles missing optional fields gracefully', () => {
    const minimalItem = {
      id: '2',
      title: 'Test Item',
      category: 'Other',
      description: 'Test description',
      status: 'Lost',
      location: 'Test Location',
      createdAt: '2024-01-01T00:00:00Z'
    };
    
    expect(() => {
      renderWithRouter(<ItemCard item={minimalItem} />);
    }).not.toThrow();
    
    expect(screen.getByText('Test Item')).toBeInTheDocument();
  });
});