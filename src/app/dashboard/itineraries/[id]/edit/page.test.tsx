import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import EditItineraryPage from './page';

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

// Mock EditItineraryForm so we do not have to render the complex client component
vi.mock('./edit-form', () => ({
  default: ({ itinerary }: { itinerary: { name: string } }) => (
    <div data-testid="mock-edit-form">{itinerary.name}</div>
  ),
}));

describe('EditItineraryPage Server Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const mockItinerary = {
    id: '123',
    name: 'Test Trip',
    startDate: new Date('2026-06-01'),
    endDate: new Date('2026-06-10'),
    userId: 'user1',
  };

  it('calls notFound if user is EDITOR and does not own the itinerary', async () => {
    mockAuth.mockResolvedValueOnce({ user: { id: 'user2', role: 'EDITOR' } });
    mockFindUnique.mockResolvedValueOnce(mockItinerary);
    await expect(
      EditItineraryPage({ params: Promise.resolve({ id: '123' }) })
    ).rejects.toThrow('NOT_FOUND');
    expect(mockNotFound).toHaveBeenCalledTimes(1);
  });

  it('calls notFound if user is VIEWER', async () => {
    mockAuth.mockResolvedValueOnce({ user: { id: 'user2', role: 'VIEWER' } });
    mockFindUnique.mockResolvedValueOnce(mockItinerary);
    await expect(
      EditItineraryPage({ params: Promise.resolve({ id: '123' }) })
    ).rejects.toThrow('NOT_FOUND');
    expect(mockNotFound).toHaveBeenCalledTimes(1);
  });

  it('renders successfully if user is EDITOR and owns the itinerary', async () => {
    mockAuth.mockResolvedValueOnce({ user: { id: 'user1', role: 'EDITOR' } });
    mockFindUnique.mockResolvedValueOnce(mockItinerary);
    const ui = await EditItineraryPage({
      params: Promise.resolve({ id: '123' }),
    });
    render(ui);
    expect(screen.getByTestId('mock-edit-form')).toBeDefined();
  });

  it('renders successfully if user is ADMIN (bypasses ownership check)', async () => {
    mockAuth.mockResolvedValueOnce({ user: { id: 'user2', role: 'ADMIN' } });
    mockFindUnique.mockResolvedValueOnce(mockItinerary);
    const ui = await EditItineraryPage({
      params: Promise.resolve({ id: '123' }),
    });
    render(ui);
    expect(screen.getByTestId('mock-edit-form')).toBeDefined();
  });
});
