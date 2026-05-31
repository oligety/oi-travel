import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import ViewItineraryPage from './page';

// Mock auth
const mockAuth = vi.fn();
vi.mock('@/auth', () => ({
  auth: () => mockAuth(),
}));

// Mock next/navigation
const mockNotFound = vi.fn();
vi.mock('next/navigation', () => ({
  notFound: () => {
    mockNotFound();
    throw new Error('NOT_FOUND');
  },
}));

// Mock prisma
const mockFindUnique = vi.fn();
vi.mock('@/lib/prisma', () => ({
  prisma: {
    itinerary: {
      findUnique: () => mockFindUnique(),
    },
  },
}));

describe('ViewItineraryPage Server Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const mockItinerary = {
    id: '123',
    name: 'Test Trip',
    startDate: new Date('2026-06-01'),
    endDate: new Date('2026-06-10'),
    userId: 'user1',
    travelDays: [],
  };

  it('calls notFound if not authenticated', async () => {
    mockAuth.mockResolvedValueOnce(null);
    await expect(
      ViewItineraryPage({ params: Promise.resolve({ id: '123' }) })
    ).rejects.toThrow('NOT_FOUND');
    expect(mockNotFound).toHaveBeenCalledTimes(1);
  });

  it('calls notFound if itinerary does not exist', async () => {
    mockAuth.mockResolvedValueOnce({ user: { id: 'user1', role: 'EDITOR' } });
    mockFindUnique.mockResolvedValueOnce(null);
    await expect(
      ViewItineraryPage({ params: Promise.resolve({ id: '123' }) })
    ).rejects.toThrow('NOT_FOUND');
    expect(mockNotFound).toHaveBeenCalledTimes(1);
  });

  it('renders successfully but hides Edit Trip if user is EDITOR and does not own the itinerary', async () => {
    mockAuth.mockResolvedValueOnce({ user: { id: 'user2', role: 'EDITOR' } });
    mockFindUnique.mockResolvedValueOnce(mockItinerary);
    const ui = await ViewItineraryPage({
      params: Promise.resolve({ id: '123' }),
    });
    render(ui);
    expect(screen.getByText('Test Trip')).toBeDefined();
    expect(screen.queryByText('Edit Trip')).toBeNull();
  });

  it('renders successfully and shows Edit Trip if user is EDITOR and owns the itinerary', async () => {
    mockAuth.mockResolvedValueOnce({ user: { id: 'user1', role: 'EDITOR' } });
    mockFindUnique.mockResolvedValueOnce(mockItinerary);
    const ui = await ViewItineraryPage({
      params: Promise.resolve({ id: '123' }),
    });
    render(ui);
    expect(screen.getByText('Test Trip')).toBeDefined();
    expect(screen.getByText('Edit Trip')).toBeDefined();
  });

  it('renders successfully and shows Edit Trip if user is ADMIN (bypasses ownership check)', async () => {
    mockAuth.mockResolvedValueOnce({ user: { id: 'user2', role: 'ADMIN' } });
    mockFindUnique.mockResolvedValueOnce(mockItinerary);
    const ui = await ViewItineraryPage({
      params: Promise.resolve({ id: '123' }),
    });
    render(ui);
    expect(screen.getByText('Test Trip')).toBeDefined();
    expect(screen.getByText('Edit Trip')).toBeDefined();
  });

  it('renders successfully and hides Edit Trip if user is VIEWER', async () => {
    mockAuth.mockResolvedValueOnce({ user: { id: 'user2', role: 'VIEWER' } });
    mockFindUnique.mockResolvedValueOnce(mockItinerary);
    const ui = await ViewItineraryPage({
      params: Promise.resolve({ id: '123' }),
    });
    render(ui);
    expect(screen.getByText('Test Trip')).toBeDefined();
    expect(screen.queryByText('Edit Trip')).toBeNull();
  });
});
