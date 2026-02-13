import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';

// Custom hook for authentication
const useAuth = () => {
  const [user, setUser] = React.useState(null);
  const [token, setToken] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      
      const data = await response.json();
      
      if (data.success) {
        setToken(data.token);
        setUser(data.user);
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        return { success: true };
      } else {
        throw new Error(data.error || 'Login failed');
      }
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  const isAuthenticated = !!token && !!user;

  return {
    user,
    token,
    loading,
    isAuthenticated,
    login,
    logout
  };
};

// Mock React
const React = {
  useState: vi.fn(),
  useEffect: vi.fn()
};

// Mock fetch
global.fetch = vi.fn();

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};
global.localStorage = localStorageMock;

describe('useAuth Hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    
    // Mock React.useState
    let stateValues = {};
    React.useState.mockImplementation((initialValue) => {
      const key = Math.random().toString();
      stateValues[key] = initialValue;
      
      const setState = (newValue) => {
        stateValues[key] = typeof newValue === 'function' 
          ? newValue(stateValues[key]) 
          : newValue;
      };
      
      return [stateValues[key], setState];
    });

    // Mock React.useEffect
    React.useEffect.mockImplementation((callback) => {
      callback();
    });
  });

  it('initializes with default values', () => {
    localStorageMock.getItem.mockReturnValue(null);
    
    const { result } = renderHook(() => useAuth());
    
    expect(result.current.user).toBeNull();
    expect(result.current.token).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
  });

  it('loads user from localStorage on initialization', () => {
    const mockUser = { id: 1, email: 'test@example.com' };
    const mockToken = 'test-token';
    
    localStorageMock.getItem
      .mockReturnValueOnce(mockToken)
      .mockReturnValueOnce(JSON.stringify(mockUser));
    
    const { result } = renderHook(() => useAuth());
    
    expect(result.current.user).toEqual(mockUser);
    expect(result.current.token).toBe(mockToken);
    expect(result.current.isAuthenticated).toBe(true);
  });

  it('handles successful login', async () => {
    const mockResponse = {
      success: true,
      token: 'new-token',
      user: { id: 1, email: 'test@example.com' }
    };

    fetch.mockResolvedValue({
      json: vi.fn().mockResolvedValue(mockResponse)
    });

    const { result } = renderHook(() => useAuth());

    await act(async () => {
      const loginResult = await result.current.login('test@example.com', 'password');
      expect(loginResult.success).toBe(true);
    });

    expect(localStorageMock.setItem).toHaveBeenCalledWith('token', 'new-token');
    expect(localStorageMock.setItem).toHaveBeenCalledWith('user', JSON.stringify(mockResponse.user));
  });

  it('handles login failure', async () => {
    const mockResponse = {
      success: false,
      error: 'Invalid credentials'
    };

    fetch.mockResolvedValue({
      json: vi.fn().mockResolvedValue(mockResponse)
    });

    const { result } = renderHook(() => useAuth());

    await expect(async () => {
      await act(async () => {
        await result.current.login('test@example.com', 'wrong-password');
      });
    }).rejects.toThrow('Invalid credentials');
  });

  it('handles network errors during login', async () => {
    fetch.mockRejectedValue(new Error('Network error'));

    const { result } = renderHook(() => useAuth());

    await expect(async () => {
      await act(async () => {
        await result.current.login('test@example.com', 'password');
      });
    }).rejects.toThrow('Network error');
  });

  it('clears authentication on logout', () => {
    const { result } = renderHook(() => useAuth());

    act(() => {
      result.current.logout();
    });

    expect(localStorageMock.removeItem).toHaveBeenCalledWith('token');
    expect(localStorageMock.removeItem).toHaveBeenCalledWith('user');
  });

  it('sets loading state correctly during login', async () => {
    let resolveLogin;
    const loginPromise = new Promise(resolve => {
      resolveLogin = resolve;
    });

    fetch.mockReturnValue(loginPromise);

    const { result } = renderHook(() => useAuth());

    // Start login
    act(() => {
      result.current.login('test@example.com', 'password');
    });

    expect(result.current.loading).toBe(true);

    // Complete login
    await act(async () => {
      resolveLogin({
        json: vi.fn().mockResolvedValue({
          success: true,
          token: 'token',
          user: { id: 1 }
        })
      });
      await loginPromise;
    });

    expect(result.current.loading).toBe(false);
  });

  it('handles malformed user data in localStorage', () => {
    localStorageMock.getItem
      .mockReturnValueOnce('valid-token')
      .mockReturnValueOnce('invalid-json');

    const { result } = renderHook(() => useAuth());

    expect(result.current.user).toBeNull();
    expect(result.current.token).toBe('valid-token');
    expect(result.current.isAuthenticated).toBe(false);
  });

  it('handles missing token with valid user data', () => {
    const mockUser = { id: 1, email: 'test@example.com' };
    
    localStorageMock.getItem
      .mockReturnValueOnce(null)
      .mockReturnValueOnce(JSON.stringify(mockUser));

    const { result } = renderHook(() => useAuth());

    expect(result.current.user).toBeNull();
    expect(result.current.token).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
  });
});