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
    expect(screen.getByTestId('login-email-input')).toBeDefined();
    expect(screen.getByTestId('login-password-input')).toBeDefined();
    expect(screen.getByTestId('login-submit-button')).toBeDefined();
  });

  it('disables the submit button if inputs are empty', () => {
    render(<LoginPage />);
    const submitButton = screen.getByTestId(
      'login-submit-button'
    ) as HTMLButtonElement;

    // Initially disabled
    expect(submitButton.disabled).toBe(true);

    const emailInput = screen.getByTestId('login-email-input');
    const passwordInput = screen.getByTestId('login-password-input');

    // Fill only email, still disabled
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    expect(submitButton.disabled).toBe(true);

    // Fill both, should be enabled
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    expect(submitButton.disabled).toBe(false);
  });

  it('shows an error message if login fails', async () => {
    vi.mocked(authActions.loginAction).mockResolvedValueOnce({
      error: 'Invalid credentials.',
    });

    render(<LoginPage />);

    const emailInput = screen.getByTestId('login-email-input');
    const passwordInput = screen.getByTestId('login-password-input');
    const submitButton = screen.getByTestId('login-submit-button');

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

    const emailInput = screen.getByTestId('login-email-input');
    const passwordInput = screen.getByTestId('login-password-input');
    const submitButton = screen.getByTestId('login-submit-button');

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
