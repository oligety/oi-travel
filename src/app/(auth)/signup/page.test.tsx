import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import SignupPage from './page';
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
  signUpAction: vi.fn(),
}));

describe('SignupPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the signup form correctly', () => {
    render(<SignupPage />);
    expect(
      screen.getByRole('heading', { name: /create account/i })
    ).toBeDefined();
    expect(screen.getByPlaceholderText(/enter your name/i)).toBeDefined();
    expect(screen.getByPlaceholderText(/enter your email/i)).toBeDefined();
    expect(screen.getByPlaceholderText(/create a password/i)).toBeDefined();
    expect(
      screen.getByRole('button', { name: /create account/i })
    ).toBeDefined();
  });

  it('disables the submit button if inputs are empty', () => {
    render(<SignupPage />);
    const submitButton = screen.getByRole('button', {
      name: /create account/i,
    }) as HTMLButtonElement;

    // Initially disabled
    expect(submitButton.disabled).toBe(true);

    const nameInput = screen.getByPlaceholderText(/enter your name/i);
    const emailInput = screen.getByPlaceholderText(/enter your email/i);
    const passwordInput = screen.getByPlaceholderText(/create a password/i);

    // Fill name, still disabled
    fireEvent.change(nameInput, { target: { value: 'John' } });
    expect(submitButton.disabled).toBe(true);

    // Fill email, still disabled
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    expect(submitButton.disabled).toBe(true);

    // Fill all, should be enabled
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    expect(submitButton.disabled).toBe(false);
  });

  it('shows an error message if input data is invalid (e.g. password too short)', async () => {
    // Mock validation error returned by the server action
    vi.mocked(authActions.signUpAction).mockResolvedValueOnce({
      error: 'Password must be at least 6 characters',
    });

    render(<SignupPage />);

    const nameInput = screen.getByPlaceholderText(/enter your name/i);
    const emailInput = screen.getByPlaceholderText(/enter your email/i);
    const passwordInput = screen.getByPlaceholderText(/create a password/i);
    const submitButton = screen.getByRole('button', {
      name: /create account/i,
    });

    // The user provides a password that is too short
    fireEvent.change(nameInput, { target: { value: 'Olivier' } });
    fireEvent.change(emailInput, { target: { value: 'oliechti@gmx.ch' } });
    fireEvent.change(passwordInput, { target: { value: '1234' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(
        screen.getByText('Password must be at least 6 characters')
      ).toBeDefined();
    });

    expect(authActions.signUpAction).toHaveBeenCalledTimes(1);
  });

  it('submits the form successfully and does not show error', async () => {
    // Mock successful signup
    vi.mocked(authActions.signUpAction).mockResolvedValueOnce({
      success: true,
    });

    render(<SignupPage />);

    const nameInput = screen.getByPlaceholderText(/enter your name/i);
    const emailInput = screen.getByPlaceholderText(/enter your email/i);
    const passwordInput = screen.getByPlaceholderText(/create a password/i);
    const submitButton = screen.getByRole('button', {
      name: /create account/i,
    });

    fireEvent.change(nameInput, { target: { value: 'Olivier' } });
    fireEvent.change(emailInput, { target: { value: 'oliechti@gmx.ch' } });
    fireEvent.change(passwordInput, { target: { value: 'securepassword123' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(authActions.signUpAction).toHaveBeenCalledTimes(1);
    });

    // Ensure no error is shown
    const errorText = screen.queryByText(
      'Password must be at least 6 characters'
    );
    expect(errorText).toBeNull();
  });
});
