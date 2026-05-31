import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ItineraryList } from './itinerary-list';

// Mock useRouter
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
}));

// Mock the server action
vi.mock('@/actions/itinerary', () => ({
  deleteItinerary: vi.fn(),
}));

describe('ItineraryList', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const mockItineraries = [
    {
      id: 'trip1',
      name: 'Paris Trip',
      startDate: new Date('2026-06-01'),
      endDate: new Date('2026-06-10'),
      userId: 'user1',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  it('shows Create Trip button for EDITOR role on empty state', () => {
    render(
      <ItineraryList itineraries={[]} role="EDITOR" currentUserId="user1" />
    );
    expect(screen.getByText('No trips planned yet')).toBeDefined();
    expect(screen.getByText('Create Trip')).toBeDefined();
  });

  it('hides Create Trip button for VIEWER role on empty state', () => {
    render(
      <ItineraryList itineraries={[]} role="VIEWER" currentUserId="user1" />
    );
    expect(screen.getByText('No trips planned yet')).toBeDefined();
    expect(screen.queryByText('Create Trip')).toBeNull();
  });

  it('shows Edit and Delete buttons for EDITOR role when trips exist and user owns them', () => {
    render(
      <ItineraryList
        itineraries={mockItineraries}
        role="EDITOR"
        currentUserId="user1"
      />
    );
    expect(screen.getByText('Paris Trip')).toBeDefined();
    expect(screen.getByText('Actions')).toBeDefined();
    expect(
      screen.getByRole('button', { name: /Edit Paris Trip/i })
    ).toBeDefined();
    expect(
      screen.getByRole('button', { name: /Delete Paris Trip/i })
    ).toBeDefined();
  });

  it('hides Edit and Delete buttons for EDITOR role when trips exist and user does not own them', () => {
    render(
      <ItineraryList
        itineraries={mockItineraries}
        role="EDITOR"
        currentUserId="user2"
      />
    );
    expect(screen.getByText('Paris Trip')).toBeDefined();
    expect(screen.getByText('Actions')).toBeDefined();
    expect(
      screen.queryByRole('button', { name: /Edit Paris Trip/i })
    ).toBeNull();
    expect(
      screen.queryByRole('button', { name: /Delete Paris Trip/i })
    ).toBeNull();
  });

  it('shows Edit and Delete buttons for ADMIN role when trips exist regardless of ownership', () => {
    render(
      <ItineraryList
        itineraries={mockItineraries}
        role="ADMIN"
        currentUserId="user2"
      />
    );
    expect(screen.getByText('Paris Trip')).toBeDefined();
    expect(screen.getByText('Actions')).toBeDefined();
    expect(
      screen.getByRole('button', { name: /Edit Paris Trip/i })
    ).toBeDefined();
    expect(
      screen.getByRole('button', { name: /Delete Paris Trip/i })
    ).toBeDefined();
  });

  it('hides Edit and Delete buttons for VIEWER role when trips exist', () => {
    render(
      <ItineraryList
        itineraries={mockItineraries}
        role="VIEWER"
        currentUserId="user1"
      />
    );
    expect(screen.getByText('Paris Trip')).toBeDefined();
    expect(screen.queryByText('Actions')).toBeNull();
    expect(
      screen.queryByRole('button', { name: /Edit Paris Trip/i })
    ).toBeNull();
    expect(
      screen.queryByRole('button', { name: /Delete Paris Trip/i })
    ).toBeNull();
  });
});
