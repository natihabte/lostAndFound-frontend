import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import Login from '../Login';

// Mock the API service
vi.mock('../../services/api', () => ({
  login: vi.fn()
}));

// Mock react-i18next
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key) => key,
    i18n: { changeLanguage: vi.fn() }
  })
}));

import { login } from '../../services/api';

const renderWithRouter = (component) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

describe('Login Component', () => {
  const mockHandleLogin = vi.fn();
  const mockSetCurrentPage = vi.fn();
  const mockSetShowPrivacyPolicy = vi.fn();
  const mockSetShowTermsOfService = vi.fn();

  const defaultProps = {
    handleLogin: mockHandleLogin,
    setCurrentPage: mockSetCurrentPage,
    setShowPrivacyPolicy: mockSetShowPrivacyPolicy,
    setShowTermsOfService: mockSetShowTermsOfService
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders login form elements', () => {
    renderWithRouter(<Login {...defaultProps} />);

    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
  });

  it('allows user to input email and password', async () => {
    const user = userEvent.setup();
    renderWithRouter(<Login {...defaultProps} />);

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);

    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'password123');

    expect(emailInput).toHaveValue('test@example.com');
    expect(passwordInput).toHaveValue('password123');
  });

  it('submits form with correct credentials', async () => {
    const user = userEvent.setup();
    login.mockResolvedValue({
      success: true,
      token: 'test-token',
      user: { id: 1, email: 'test@example.com' }
    });

    renderWithRouter(<Login {...defaultProps} />);

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole('button', { name: /sign in/i });

    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'password123');
    await user.click(submitButton);

    await waitFor(() => {
      expect(login).toHaveBeenCalledWith('test@example.com', 'password123');
    });
  });

  it('displays error message on login failure', async () => {
    const user = userEvent.setup();
    login.mockRejectedValue(new Error('Invalid credentials'));

    renderWithRouter(<Login {...defaultProps} />);

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole('button', { name: /sign in/i });

    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'wrongpassword');
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument();
    });
  });

  it('shows loading state during login', async () => {
    const user = userEvent.setup();
    login.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 1000)));

    renderWithRouter(<Login {...defaultProps} />);

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole('button', { name: /sign in/i });

    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'password123');
    await user.click(submitButton);

    expect(screen.getByText(/signing in/i)).toBeInTheDocument();
    expect(submitButton).toBeDisabled();
  });

  it('validates required fields', async () => {
    const user = userEvent.setup();
    renderWithRouter(<Login {...defaultProps} />);

    const submitButton = screen.getByRole('button', { name: /sign in/i });
    await user.click(submitButton);

    expect(screen.getByText(/email is required/i)).toBeInTheDocument();
    expect(screen.getByText(/password is required/i)).toBeInTheDocument();
  });

  it('validates email format', async () => {
    const user = userEvent.setup();
    renderWithRouter(<Login {...defaultProps} />);

    const emailInput = screen.getByLabelText(/email/i);
    const submitButton = screen.getByRole('button', { name: /sign in/i });

    await user.type(emailInput, 'invalid-email');
    await user.click(submitButton);

    expect(screen.getByText(/please enter a valid email/i)).toBeInTheDocument();
  });

  it('navigates to registration page', async () => {
    const user = userEvent.setup();
    renderWithRouter(<Login {...defaultProps} />);

    const registerLink = screen.getByText(/create account/i);
    await user.click(registerLink);

    expect(mockSetCurrentPage).toHaveBeenCalledWith('register');
  });

  it('navigates to forgot password page', async () => {
    const user = userEvent.setup();
    renderWithRouter(<Login {...defaultProps} />);

    const forgotPasswordLink = screen.getByText(/forgot password/i);
    await user.click(registerLink);

    expect(mockSetCurrentPage).toHaveBeenCalledWith('forgot-password');
  });

  it('shows privacy policy when link is clicked', async () => {
    const user = userEvent.setup();
    renderWithRouter(<Login {...defaultProps} />);

    const privacyLink = screen.getByText(/privacy policy/i);
    await user.click(privacyLink);

    expect(mockSetShowPrivacyPolicy).toHaveBeenCalledWith(true);
  });

  it('shows terms of service when link is clicked', async () => {
    const user = userEvent.setup();
    renderWithRouter(<Login {...defaultProps} />);

    const termsLink = screen.getByText(/terms of service/i);
    await user.click(termsLink);

    expect(mockSetShowTermsOfService).toHaveBeenCalledWith(true);
  });

  it('handles keyboard navigation', async () => {
    const user = userEvent.setup();
    renderWithRouter(<Login {...defaultProps} />);

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);

    await user.click(emailInput);
    await user.keyboard('{Tab}');

    expect(passwordInput).toHaveFocus();
  });

  it('clears error message when user starts typing', async () => {
    const user = userEvent.setup();
    login.mockRejectedValue(new Error('Invalid credentials'));

    renderWithRouter(<Login {...defaultProps} />);

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole('button', { name: /sign in/i });

    // Trigger error
    await user.click(submitButton);
    await waitFor(() => {
      expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument();
    });

    // Start typing to clear error
    await user.type(emailInput, 'a');
    expect(screen.queryByText(/invalid credentials/i)).not.toBeInTheDocument();
  });

  it('remembers user preference for "Remember me"', async () => {
    const user = userEvent.setup();
    renderWithRouter(<Login {...defaultProps} />);

    const rememberCheckbox = screen.getByLabelText(/remember me/i);
    await user.click(rememberCheckbox);

    expect(rememberCheckbox).toBeChecked();
  });
});