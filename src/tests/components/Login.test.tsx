import { describe, it, expect, vi } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Login from '../../pages/Login';
import { renderWithProviders } from '../utils/test-utils';

describe('Login Component', () => {
  it('renders login form', () => {
    renderWithProviders(<Login />);
    expect(screen.getByPlaceholderText(/email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
  });

  it('handles successful login', async () => {
    const user = userEvent.setup();
    renderWithProviders(<Login />);

    await user.type(screen.getByPlaceholderText(/email/i), 'test@example.com');
    await user.type(screen.getByPlaceholderText(/password/i), 'password123');
    await user.click(screen.getByRole('button', { name: /sign in/i }));

    await waitFor(() => {
      expect(window.location.pathname).toBe('/dashboard');
    });
  });

  it('displays error message on login failure', async () => {
    const user = userEvent.setup();
    renderWithProviders(<Login />);

    await user.type(screen.getByPlaceholderText(/email/i), 'invalid@example.com');
    await user.type(screen.getByPlaceholderText(/password/i), 'wrongpassword');
    await user.click(screen.getByRole('button', { name: /sign in/i }));

    await waitFor(() => {
      expect(screen.getByText(/failed to sign in/i)).toBeInTheDocument();
    });
  });
});