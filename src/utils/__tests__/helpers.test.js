import { describe, it, expect } from 'vitest';

// Utility functions for testing
export const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString();
};

export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password) => {
  return password.length >= 8;
};

export const formatItemStatus = (status) => {
  return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
};

export const truncateText = (text, maxLength) => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

export const generateItemId = () => {
  return Math.random().toString(36).substr(2, 9);
};

export const filterItemsByCategory = (items, category) => {
  if (!category || category === 'all') return items;
  return items.filter(item => item.category.toLowerCase() === category.toLowerCase());
};

export const filterItemsByStatus = (items, status) => {
  if (!status || status === 'all') return items;
  return items.filter(item => item.status.toLowerCase() === status.toLowerCase());
};

export const searchItems = (items, searchTerm) => {
  if (!searchTerm) return items;
  const term = searchTerm.toLowerCase();
  return items.filter(item => 
    item.title.toLowerCase().includes(term) ||
    item.description.toLowerCase().includes(term) ||
    item.location.toLowerCase().includes(term)
  );
};

export const sortItemsByDate = (items, order = 'desc') => {
  return [...items].sort((a, b) => {
    const dateA = new Date(a.createdAt);
    const dateB = new Date(b.createdAt);
    return order === 'desc' ? dateB - dateA : dateA - dateB;
  });
};

describe('Utility Functions', () => {
  describe('formatDate', () => {
    it('formats date string correctly', () => {
      const dateString = '2024-01-15T10:30:00Z';
      const formatted = formatDate(dateString);
      expect(formatted).toBe('1/15/2024');
    });

    it('handles different date formats', () => {
      const dateString = '2024-12-25';
      const formatted = formatDate(dateString);
      expect(formatted).toBe('12/25/2024');
    });
  });

  describe('validateEmail', () => {
    it('validates correct email addresses', () => {
      expect(validateEmail('test@example.com')).toBe(true);
      expect(validateEmail('user.name@domain.co.uk')).toBe(true);
      expect(validateEmail('user+tag@example.org')).toBe(true);
    });

    it('rejects invalid email addresses', () => {
      expect(validateEmail('invalid-email')).toBe(false);
      expect(validateEmail('test@')).toBe(false);
      expect(validateEmail('@example.com')).toBe(false);
      expect(validateEmail('test.example.com')).toBe(false);
    });
  });

  describe('validatePassword', () => {
    it('validates passwords with minimum length', () => {
      expect(validatePassword('password123')).toBe(true);
      expect(validatePassword('12345678')).toBe(true);
    });

    it('rejects passwords that are too short', () => {
      expect(validatePassword('short')).toBe(false);
      expect(validatePassword('1234567')).toBe(false);
    });
  });

  describe('formatItemStatus', () => {
    it('formats status with proper capitalization', () => {
      expect(formatItemStatus('lost')).toBe('Lost');
      expect(formatItemStatus('FOUND')).toBe('Found');
      expect(formatItemStatus('cLaImEd')).toBe('Claimed');
    });
  });

  describe('truncateText', () => {
    it('truncates text longer than max length', () => {
      const longText = 'This is a very long text that should be truncated';
      expect(truncateText(longText, 20)).toBe('This is a very long ...');
    });

    it('returns original text if shorter than max length', () => {
      const shortText = 'Short text';
      expect(truncateText(shortText, 20)).toBe('Short text');
    });

    it('handles exact length text', () => {
      const exactText = 'Exactly twenty chars';
      expect(truncateText(exactText, 20)).toBe('Exactly twenty chars');
    });
  });

  describe('generateItemId', () => {
    it('generates unique IDs', () => {
      const id1 = generateItemId();
      const id2 = generateItemId();
      expect(id1).not.toBe(id2);
      expect(id1).toHaveLength(9);
      expect(id2).toHaveLength(9);
    });
  });

  describe('filterItemsByCategory', () => {
    const mockItems = [
      { id: 1, category: 'Electronics', title: 'Phone' },
      { id: 2, category: 'Clothing', title: 'Jacket' },
      { id: 3, category: 'Electronics', title: 'Laptop' }
    ];

    it('filters items by category', () => {
      const filtered = filterItemsByCategory(mockItems, 'Electronics');
      expect(filtered).toHaveLength(2);
      expect(filtered.every(item => item.category === 'Electronics')).toBe(true);
    });

    it('returns all items for "all" category', () => {
      const filtered = filterItemsByCategory(mockItems, 'all');
      expect(filtered).toHaveLength(3);
    });

    it('returns all items when no category specified', () => {
      const filtered = filterItemsByCategory(mockItems);
      expect(filtered).toHaveLength(3);
    });

    it('handles case insensitive filtering', () => {
      const filtered = filterItemsByCategory(mockItems, 'electronics');
      expect(filtered).toHaveLength(2);
    });
  });

  describe('filterItemsByStatus', () => {
    const mockItems = [
      { id: 1, status: 'Lost', title: 'Phone' },
      { id: 2, status: 'Found', title: 'Keys' },
      { id: 3, status: 'Lost', title: 'Wallet' }
    ];

    it('filters items by status', () => {
      const filtered = filterItemsByStatus(mockItems, 'Lost');
      expect(filtered).toHaveLength(2);
      expect(filtered.every(item => item.status === 'Lost')).toBe(true);
    });

    it('returns all items for "all" status', () => {
      const filtered = filterItemsByStatus(mockItems, 'all');
      expect(filtered).toHaveLength(3);
    });

    it('handles case insensitive filtering', () => {
      const filtered = filterItemsByStatus(mockItems, 'found');
      expect(filtered).toHaveLength(1);
    });
  });

  describe('searchItems', () => {
    const mockItems = [
      { 
        id: 1, 
        title: 'iPhone 13', 
        description: 'Black phone with blue case',
        location: 'Library'
      },
      { 
        id: 2, 
        title: 'Car Keys', 
        description: 'Toyota keys with red keychain',
        location: 'Parking Lot'
      },
      { 
        id: 3, 
        title: 'Laptop', 
        description: 'MacBook Pro 13-inch',
        location: 'Computer Lab'
      }
    ];

    it('searches by title', () => {
      const results = searchItems(mockItems, 'iPhone');
      expect(results).toHaveLength(1);
      expect(results[0].title).toBe('iPhone 13');
    });

    it('searches by description', () => {
      const results = searchItems(mockItems, 'blue case');
      expect(results).toHaveLength(1);
      expect(results[0].title).toBe('iPhone 13');
    });

    it('searches by location', () => {
      const results = searchItems(mockItems, 'Library');
      expect(results).toHaveLength(1);
      expect(results[0].location).toBe('Library');
    });

    it('returns all items when no search term', () => {
      const results = searchItems(mockItems, '');
      expect(results).toHaveLength(3);
    });

    it('handles case insensitive search', () => {
      const results = searchItems(mockItems, 'IPHONE');
      expect(results).toHaveLength(1);
    });

    it('returns empty array when no matches', () => {
      const results = searchItems(mockItems, 'nonexistent');
      expect(results).toHaveLength(0);
    });
  });

  describe('sortItemsByDate', () => {
    const mockItems = [
      { id: 1, createdAt: '2024-01-15T10:00:00Z' },
      { id: 2, createdAt: '2024-01-10T10:00:00Z' },
      { id: 3, createdAt: '2024-01-20T10:00:00Z' }
    ];

    it('sorts items by date in descending order by default', () => {
      const sorted = sortItemsByDate(mockItems);
      expect(sorted[0].id).toBe(3); // Most recent
      expect(sorted[1].id).toBe(1);
      expect(sorted[2].id).toBe(2); // Oldest
    });

    it('sorts items by date in ascending order', () => {
      const sorted = sortItemsByDate(mockItems, 'asc');
      expect(sorted[0].id).toBe(2); // Oldest
      expect(sorted[1].id).toBe(1);
      expect(sorted[2].id).toBe(3); // Most recent
    });

    it('does not mutate original array', () => {
      const originalOrder = mockItems.map(item => item.id);
      sortItemsByDate(mockItems);
      const currentOrder = mockItems.map(item => item.id);
      expect(currentOrder).toEqual(originalOrder);
    });
  });
});