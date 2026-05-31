import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import AdminPage from './page';

// Mock auth
const mockAuth = vi.fn();
vi.mock('@/auth', () => ({
  auth: () => mockAuth(),
}));

// Mock next/navigation
const mockRedirect = vi.fn();
const mockNotFound = vi.fn();
vi.mock('next/navigation', () => ({
  redirect: (url: string) => {
    mockRedirect(url);
    throw new Error('REDIRECT');
  },
  notFound: () => {
    mockNotFound();
    throw new Error('NOT_FOUND');
  },
}));

// Mock prisma
const mockFindMany = vi.fn();
vi.mock('@/lib/prisma', () => ({
  prisma: {
    user: {
      findMany: () => mockFindMany(),
    },
  },
}));

describe('AdminPage Server Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('redirects to login if not authenticated', async () => {
    mockAuth.mockResolvedValueOnce(null);

    await expect(AdminPage()).rejects.toThrow('REDIRECT');
    expect(mockRedirect).toHaveBeenCalledWith('/login');
  });

  it('calls notFound if user is authenticated but not an ADMIN', async () => {
    mockAuth.mockResolvedValueOnce({
      user: { id: '1', role: 'EDITOR' },
    });

    await expect(AdminPage()).rejects.toThrow('NOT_FOUND');
    expect(mockNotFound).toHaveBeenCalledTimes(1);
  });

  it('fetches users and renders successfully if user is ADMIN', async () => {
    mockAuth.mockResolvedValueOnce({
      user: { id: '1', role: 'ADMIN' },
    });

    mockFindMany.mockResolvedValueOnce([
      {
        id: '1',
        name: 'Test User',
        email: 'test@example.com',
        role: 'EDITOR',
        createdAt: new Date('2026-05-01'),
      },
    ]);

    const ui = await AdminPage();
    render(ui);

    expect(screen.getByText('Admin Portal')).toBeDefined();
    expect(mockFindMany).toHaveBeenCalledTimes(1);
    expect(screen.getByText('test@example.com')).toBeDefined();
  });
});
