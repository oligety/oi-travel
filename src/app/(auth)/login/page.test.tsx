import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import LoginPage from './page';
import * as authActions from '@/actions/auth';

// Mock the next/navigation router
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
}));

// Mock the framer-motion library to prevent animation issues in jsdom
vi.mock('framer-motion', async () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const actual = (await vi.importActual('framer-motion')) as any;
  return {
    ...actual,
    motion: {
      ...actual.motion,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      div: ({ children, className }: any) => (
        <div className={className}>{children}</div>
      ),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      p: ({ children, className }: any) => (
        <p className={className}>{children}</p>
      ),
    },
  };
});

// Mock the server action
vi.mock('@/actions/auth', () => ({
  loginAction: vi.fn(),
}));

describe('LoginPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the login form correctly', () => {
    render(<LoginPage />);
    expect(
      screen.getByRole('heading', { name: /welcome back/i })
    ).toBeDefined();
    expect(screen.getByPlaceholderText(/enter your email/i)).toBeDefined();
    expect(screen.getByPlaceholderText(/enter your password/i)).toBeDefined();
    expect(screen.getByRole('button', { name: /sign in/i })).toBeDefined();
  });

  it('shows an error message if login fails', async () => {
    vi.mocked(authActions.loginAction).mockResolvedValueOnce({
      error: 'Invalid credentials.',
    });

    render(<LoginPage />);

    const emailInput = screen.getByPlaceholderText(/enter your email/i);
    const passwordInput = screen.getByPlaceholderText(/enter your password/i);
    const submitButton = screen.getByRole('button', { name: /sign in/i });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'wrongpassword' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Invalid credentials.')).toBeDefined();
    });

    expect(authActions.loginAction).toHaveBeenCalledTimes(1);
  });

  it('submits the form successfully and does not show error', async () => {
    // Mock successful login which returns undefined or success object without error
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    vi.mocked(authActions.loginAction).mockResolvedValueOnce(undefined as any);

    render(<LoginPage />);

    const emailInput = screen.getByPlaceholderText(/enter your email/i);
    const passwordInput = screen.getByPlaceholderText(/enter your password/i);
    const submitButton = screen.getByRole('button', { name: /sign in/i });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'correctpassword' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(authActions.loginAction).toHaveBeenCalledTimes(1);
    });

    // Ensure no error is shown
    const errorText = screen.queryByText('Invalid credentials.');
    expect(errorText).toBeNull();
  });
});
