import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// Mock fetch globally
global.fetch = vi.fn();

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};
global.localStorage = localStorageMock;

// Import API functions after mocking
import { 
  getAuthToken, 
  handleResponse,
  login,
  register,
  getItems,
  createItem,
  updateItem,
  deleteItem,
  submitClaim
} from '../api';

describe('API Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    fetch.mockClear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('getAuthToken', () => {
    it('returns token from localStorage', () => {
      localStorageMock.getItem.mockReturnValue('test-token');
      
      const token = getAuthToken();
      
      expect(localStorageMock.getItem).toHaveBeenCalledWith('token');
      expect(token).toBe('test-token');
    });

    it('returns null when no token exists', () => {
      localStorageMock.getItem.mockReturnValue(null);
      
      const token = getAuthToken();
      
      expect(token).toBeNull();
    });
  });

  describe('handleResponse', () => {
    it('returns json data for successful response', async () => {
      const mockData = { success: true, data: { id: 1 } };
      const mockResponse = {
        ok: true,
        json: vi.fn().mockResolvedValue(mockData)
      };

      const result = await handleResponse(mockResponse);

      expect(result).toEqual(mockData);
      expect(mockResponse.json).toHaveBeenCalled();
    });

    it('throws error for failed response', async () => {
      const mockError = { error: 'Not found' };
      const mockResponse = {
        ok: false,
        json: vi.fn().mockResolvedValue(mockError)
      };

      await expect(handleResponse(mockResponse)).rejects.toThrow('Not found');
    });

    it('throws generic error when no error message provided', async () => {
      const mockResponse = {
        ok: false,
        json: vi.fn().mockResolvedValue({})
      };

      await expect(handleResponse(mockResponse)).rejects.toThrow('Request failed');
    });
  });

  describe('Authentication API', () => {
    describe('login', () => {
      it('successfully logs in user', async () => {
        const mockResponse = {
          success: true,
          token: 'new-token',
          user: { id: 1, email: 'test@example.com' }
        };

        fetch.mockResolvedValue({
          ok: true,
          json: vi.fn().mockResolvedValue(mockResponse)
        });

        const result = await login('test@example.com', 'password');

        expect(fetch).toHaveBeenCalledWith('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: 'test@example.com',
            password: 'password'
          })
        });

        expect(result).toEqual(mockResponse);
      });

      it('handles login failure', async () => {
        fetch.mockResolvedValue({
          ok: false,
          json: vi.fn().mockResolvedValue({ error: 'Invalid credentials' })
        });

        await expect(login('test@example.com', 'wrong-password'))
          .rejects.toThrow('Invalid credentials');
      });
    });

    describe('register', () => {
      it('successfully registers user', async () => {
        const userData = {
          name: 'John Doe',
          email: 'john@example.com',
          password: 'password123',
          phone: '+1234567890'
        };

        const mockResponse = {
          success: true,
          user: { id: 1, ...userData }
        };

        fetch.mockResolvedValue({
          ok: true,
          json: vi.fn().mockResolvedValue(mockResponse)
        });

        const result = await register(userData);

        expect(fetch).toHaveBeenCalledWith('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(userData)
        });

        expect(result).toEqual(mockResponse);
      });
    });
  });

  describe('Items API', () => {
    beforeEach(() => {
      localStorageMock.getItem.mockReturnValue('test-token');
    });

    describe('getItems', () => {
      it('fetches items successfully', async () => {
        const mockItems = {
          success: true,
          data: [
            { id: 1, title: 'Lost Phone', status: 'Lost' },
            { id: 2, title: 'Found Keys', status: 'Found' }
          ]
        };

        fetch.mockResolvedValue({
          ok: true,
          json: vi.fn().mockResolvedValue(mockItems)
        });

        const result = await getItems();

        expect(fetch).toHaveBeenCalledWith('/api/items', {
          headers: {
            'Authorization': 'Bearer test-token',
            'Content-Type': 'application/json'
          }
        });

        expect(result).toEqual(mockItems);
      });

      it('fetches items with query parameters', async () => {
        const mockItems = { success: true, data: [] };

        fetch.mockResolvedValue({
          ok: true,
          json: vi.fn().mockResolvedValue(mockItems)
        });

        await getItems({ category: 'electronics', status: 'lost' });

        expect(fetch).toHaveBeenCalledWith('/api/items?category=electronics&status=lost', {
          headers: {
            'Authorization': 'Bearer test-token',
            'Content-Type': 'application/json'
          }
        });
      });
    });

    describe('createItem', () => {
      it('creates item successfully', async () => {
        const itemData = {
          title: 'Lost Laptop',
          description: 'MacBook Pro 13-inch',
          category: 'electronics',
          status: 'lost'
        };

        const mockResponse = {
          success: true,
          data: { id: 1, ...itemData }
        };

        fetch.mockResolvedValue({
          ok: true,
          json: vi.fn().mockResolvedValue(mockResponse)
        });

        const result = await createItem(itemData);

        expect(fetch).toHaveBeenCalledWith('/api/items', {
          method: 'POST',
          headers: {
            'Authorization': 'Bearer test-token',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(itemData)
        });

        expect(result).toEqual(mockResponse);
      });
    });

    describe('updateItem', () => {
      it('updates item successfully', async () => {
        const updateData = { status: 'claimed' };
        const mockResponse = {
          success: true,
          data: { id: 1, status: 'claimed' }
        };

        fetch.mockResolvedValue({
          ok: true,
          json: vi.fn().mockResolvedValue(mockResponse)
        });

        const result = await updateItem(1, updateData);

        expect(fetch).toHaveBeenCalledWith('/api/items/1', {
          method: 'PUT',
          headers: {
            'Authorization': 'Bearer test-token',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(updateData)
        });

        expect(result).toEqual(mockResponse);
      });
    });

    describe('deleteItem', () => {
      it('deletes item successfully', async () => {
        const mockResponse = { success: true };

        fetch.mockResolvedValue({
          ok: true,
          json: vi.fn().mockResolvedValue(mockResponse)
        });

        const result = await deleteItem(1);

        expect(fetch).toHaveBeenCalledWith('/api/items/1', {
          method: 'DELETE',
          headers: {
            'Authorization': 'Bearer test-token',
            'Content-Type': 'application/json'
          }
        });

        expect(result).toEqual(mockResponse);
      });
    });
  });

  describe('Claims API', () => {
    beforeEach(() => {
      localStorageMock.getItem.mockReturnValue('test-token');
    });

    describe('submitClaim', () => {
      it('submits claim successfully', async () => {
        const claimData = {
          itemId: 1,
          description: 'This is my phone',
          contactInfo: 'john@example.com'
        };

        const mockResponse = {
          success: true,
          data: { id: 1, ...claimData }
        };

        fetch.mockResolvedValue({
          ok: true,
          json: vi.fn().mockResolvedValue(mockResponse)
        });

        const result = await submitClaim(claimData);

        expect(fetch).toHaveBeenCalledWith('/api/claims', {
          method: 'POST',
          headers: {
            'Authorization': 'Bearer test-token',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(claimData)
        });

        expect(result).toEqual(mockResponse);
      });
    });
  });

  describe('Error Handling', () => {
    it('handles network errors', async () => {
      fetch.mockRejectedValue(new Error('Network error'));

      await expect(getItems()).rejects.toThrow('Network error');
    });

    it('handles unauthorized requests', async () => {
      fetch.mockResolvedValue({
        ok: false,
        status: 401,
        json: vi.fn().mockResolvedValue({ error: 'Unauthorized' })
      });

      await expect(getItems()).rejects.toThrow('Unauthorized');
    });

    it('handles server errors', async () => {
      fetch.mockResolvedValue({
        ok: false,
        status: 500,
        json: vi.fn().mockResolvedValue({ error: 'Internal server error' })
      });

      await expect(getItems()).rejects.toThrow('Internal server error');
    });
  });
});