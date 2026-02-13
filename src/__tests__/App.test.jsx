import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import App from '../App';

// Mock the API service
vi.mock('../services/api', () => ({
  getItems: vi.fn(),
  login: vi.fn(),
  register: vi.fn(),
  createItem: vi.fn(),
  updateItem: vi.fn(),
  deleteItem: vi.fn()
}));

// Mock react-i18next
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key) => key,
    i18n: { changeLanguage: vi.fn() }
  }),
  I18nextProvider: ({ children }) => children,
  initReactI18next: {
    type: '3rdParty',
    init: vi.fn()
  }
}));

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }) => <div {...props}>{children}</div>,
    article: ({ children, ...props }) => <article {...props}>{children}</article>,
    button: ({ children, ...props }) => <button {...props}>{children}</button>
  },
  AnimatePresence: ({ children }) => children
}));

import { getItems, login, createItem } from '../services/api';

const renderWithRouter = (component) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

describe('App Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    
    // Mock successful API responses
    getItems.mockResolvedValue({
      success: true,
      data: [
        {
          id: 1,
          title: 'Lost iPhone',
          description: 'Black iPhone 13',
          category: 'Electronics',
          status: 'Lost',
          location: 'Library',
          createdAt: '2024-01-15T10:00:00Z'
        }
      ]
    });
  });

  it('renders the main application', () => {
    renderWithRouter(<App />);
    
    expect(screen.getByText(/public sector lost/i)).toBeInTheDocument();
  });

  it('shows login page by default when not authenticated', () => {
    renderWithRouter(<App />);
    
    expect(screen.getByText(/sign in/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
  });

  it('loads items on successful authentication', async () => {
    login.mockResolvedValue({
      success: true,
      token: 'test-token',
      user: { id: 1, email: 'test@example.com', role: 'user' }
    });

    renderWithRouter(<App />);

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const loginButton = screen.getByRole('button', { name: /sign in/i });

    await userEvent.type(emailInput, 'test@example.com');
    await userEvent.type(passwordInput, 'password123');
    await userEvent.click(loginButton);

    await waitFor(() => {
      expect(getItems).toHaveBeenCalled();
    });
  });

  it('displays items after successful login', async () => {
    login.mockResolvedValue({
      success: true,
      token: 'test-token',
      user: { id: 1, email: 'test@example.com', role: 'user' }
    });

    renderWithRouter(<App />);

    // Login
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const loginButton = screen.getByRole('button', { name: /sign in/i });

    await userEvent.type(emailInput, 'test@example.com');
    await userEvent.type(passwordInput, 'password123');
    await userEvent.click(loginButton);

    await waitFor(() => {
      expect(screen.getByText('Lost iPhone')).toBeInTheDocument();
    });
  });

  it('handles search functionality', async () => {
    login.mockResolvedValue({
      success: true,
      token: 'test-token',
      user: { id: 1, email: 'test@example.com', role: 'user' }
    });

    renderWithRouter(<App />);

    // Login first
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const loginButton = screen.getByRole('button', { name: /sign in/i });

    await userEvent.type(emailInput, 'test@example.com');
    await userEvent.type(passwordInput, 'password123');
    await userEvent.click(loginButton);

    await waitFor(() => {
      expect(screen.getByText('Lost iPhone')).toBeInTheDocument();
    });

    // Test search
    const searchInput = screen.getByPlaceholderText(/search by title/i);
    await userEvent.type(searchInput, 'iPhone');

    expect(screen.getByText('Lost iPhone')).toBeInTheDocument();
  });

  it('handles category filtering', async () => {
    login.mockResolvedValue({
      success: true,
      token: 'test-token',
      user: { id: 1, email: 'test@example.com', role: 'user' }
    });

    getItems.mockResolvedValue({
      success: true,
      data: [
        {
          id: 1,
          title: 'Lost iPhone',
          category: 'Electronics',
          status: 'Lost',
          location: 'Library',
          createdAt: '2024-01-15T10:00:00Z'
        },
        {
          id: 2,
          title: 'Lost Jacket',
          category: 'Clothing',
          status: 'Lost',
          location: 'Cafeteria',
          createdAt: '2024-01-14T10:00:00Z'
        }
      ]
    });

    renderWithRouter(<App />);

    // Login first
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const loginButton = screen.getByRole('button', { name: /sign in/i });

    await userEvent.type(emailInput, 'test@example.com');
    await userEvent.type(passwordInput, 'password123');
    await userEvent.click(loginButton);

    await waitFor(() => {
      expect(screen.getByText('Lost iPhone')).toBeInTheDocument();
      expect(screen.getByText('Lost Jacket')).toBeInTheDocument();
    });

    // Test category filter
    const categorySelect = screen.getByDisplayValue(/all categories/i);
    await userEvent.selectOptions(categorySelect, 'Electronics');

    expect(screen.getByText('Lost iPhone')).toBeInTheDocument();
    expect(screen.queryByText('Lost Jacket')).not.toBeInTheDocument();
  });

  it('opens add item modal', async () => {
    login.mockResolvedValue({
      success: true,
      token: 'test-token',
      user: { id: 1, email: 'test@example.com', role: 'user' }
    });

    renderWithRouter(<App />);

    // Login first
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const loginButton = screen.getByRole('button', { name: /sign in/i });

    await userEvent.type(emailInput, 'test@example.com');
    await userEvent.type(passwordInput, 'password123');
    await userEvent.click(loginButton);

    await waitFor(() => {
      expect(screen.getByText(/add item/i)).toBeInTheDocument();
    });

    const addButton = screen.getByText(/add item/i);
    await userEvent.click(addButton);

    expect(screen.getByText(/report new item/i)).toBeInTheDocument();
  });

  it('creates new item successfully', async () => {
    login.mockResolvedValue({
      success: true,
      token: 'test-token',
      user: { id: 1, email: 'test@example.com', role: 'user' }
    });

    createItem.mockResolvedValue({
      success: true,
      data: {
        id: 2,
        title: 'New Lost Item',
        description: 'Test description',
        category: 'Electronics',
        status: 'Lost'
      }
    });

    renderWithRouter(<App />);

    // Login and open add modal
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const loginButton = screen.getByRole('button', { name: /sign in/i });

    await userEvent.type(emailInput, 'test@example.com');
    await userEvent.type(passwordInput, 'password123');
    await userEvent.click(loginButton);

    await waitFor(() => {
      const addButton = screen.getByText(/add item/i);
      userEvent.click(addButton);
    });

    await waitFor(() => {
      expect(screen.getByText(/report new item/i)).toBeInTheDocument();
    });

    // Fill form
    const titleInput = screen.getByLabelText(/title/i);
    const descriptionInput = screen.getByLabelText(/description/i);
    const submitButton = screen.getByRole('button', { name: /submit/i });

    await userEvent.type(titleInput, 'New Lost Item');
    await userEvent.type(descriptionInput, 'Test description');
    await userEvent.click(submitButton);

    await waitFor(() => {
      expect(createItem).toHaveBeenCalledWith(expect.objectContaining({
        title: 'New Lost Item',
        description: 'Test description'
      }));
    });
  });

  it('handles logout functionality', async () => {
    login.mockResolvedValue({
      success: true,
      token: 'test-token',
      user: { id: 1, email: 'test@example.com', role: 'user' }
    });

    renderWithRouter(<App />);

    // Login first
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const loginButton = screen.getByRole('button', { name: /sign in/i });

    await userEvent.type(emailInput, 'test@example.com');
    await userEvent.type(passwordInput, 'password123');
    await userEvent.click(loginButton);

    await waitFor(() => {
      expect(screen.getByText(/logout/i)).toBeInTheDocument();
    });

    const logoutButton = screen.getByText(/logout/i);
    await userEvent.click(logoutButton);

    expect(screen.getByText(/sign in/i)).toBeInTheDocument();
  });

  it('persists authentication state on page reload', () => {
    localStorage.setItem('token', 'test-token');
    localStorage.setItem('user', JSON.stringify({
      id: 1,
      email: 'test@example.com',
      role: 'user'
    }));

    renderWithRouter(<App />);

    expect(getItems).toHaveBeenCalled();
  });

  it('handles API errors gracefully', async () => {
    getItems.mockRejectedValue(new Error('Network error'));

    localStorage.setItem('token', 'test-token');
    localStorage.setItem('user', JSON.stringify({
      id: 1,
      email: 'test@example.com',
      role: 'user'
    }));

    renderWithRouter(<App />);

    await waitFor(() => {
      expect(screen.getByText(/error loading items/i)).toBeInTheDocument();
    });
  });

  it('shows loading state while fetching items', async () => {
    getItems.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 1000)));

    localStorage.setItem('token', 'test-token');
    localStorage.setItem('user', JSON.stringify({
      id: 1,
      email: 'test@example.com',
      role: 'user'
    }));

    renderWithRouter(<App />);

    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });
});