'use server';

import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { auth } from '@/auth';
import { revalidatePath } from 'next/cache';
import { eachDayOfInterval } from 'date-fns';

const itinerarySchema = z
  .object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    startDate: z
      .string()
      .refine((val) => !isNaN(Date.parse(val)), 'Invalid start date'),
    endDate: z
      .string()
      .refine((val) => !isNaN(Date.parse(val)), 'Invalid end date'),
  })
  .refine((data) => new Date(data.startDate) <= new Date(data.endDate), {
    message: 'End date cannot be before start date',
    path: ['endDate'],
  });

export async function createItinerary(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: 'Unauthorized' };
  }
  if (session.user.role === 'VIEWER') {
    return { error: 'Viewers cannot create itineraries' };
  }

  const data = Object.fromEntries(formData.entries());
  const parsed = itinerarySchema.safeParse(data);

  if (!parsed.success) {
    const errors = parsed.error.flatten().fieldErrors;
    const errorMessages = Object.values(errors).flat();
    return {
      error: errorMessages[0] || 'Invalid input data',
      fields: errors,
    };
  }

  const { name, startDate, endDate } = parsed.data;

  try {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const days = eachDayOfInterval({ start, end });

    const itinerary = await prisma.itinerary.create({
      data: {
        name,
        startDate: start,
        endDate: end,
        userId: session.user.id,
        travelDays: {
          create: days.map((date) => ({ date })),
        },
      },
    });

    revalidatePath('/dashboard');
    return { success: true, id: itinerary.id };
  } catch {
    return { error: 'Failed to create itinerary' };
  }
}

export async function updateItinerary(id: string, formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: 'Unauthorized' };
  }
  if (session.user.role === 'VIEWER') {
    return { error: 'Viewers cannot update itineraries' };
  }

  const data = Object.fromEntries(formData.entries());
  const parsed = itinerarySchema.safeParse(data);

  if (!parsed.success) {
    const errors = parsed.error.flatten().fieldErrors;
    const errorMessages = Object.values(errors).flat();
    return {
      error: errorMessages[0] || 'Invalid input data',
      fields: errors,
    };
  }

  const { name, startDate, endDate } = parsed.data;

  try {
    // Ensure the user owns this itinerary
    const existing = await prisma.itinerary.findUnique({
      where: { id },
    });
    if (
      !existing ||
      (existing.userId !== session.user.id && session.user.role !== 'ADMIN')
    ) {
      return { error: 'Unauthorized or not found' };
    }

    await prisma.itinerary.update({
      where: { id },
      data: {
        name,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
      },
    });

    revalidatePath('/dashboard');
    return { success: true };
  } catch {
    return { error: 'Failed to update itinerary' };
  }
}

export async function deleteItinerary(id: string) {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: 'Unauthorized' };
  }
  if (session.user.role === 'VIEWER') {
    return { error: 'Viewers cannot delete itineraries' };
  }

  try {
    const existing = await prisma.itinerary.findUnique({
      where: { id },
    });
    if (
      !existing ||
      (existing.userId !== session.user.id && session.user.role !== 'ADMIN')
    ) {
      return { error: 'Unauthorized or not found' };
    }

    await prisma.itinerary.delete({
      where: { id },
    });

    revalidatePath('/dashboard');
    return { success: true };
  } catch {
    return { error: 'Failed to delete itinerary' };
  }
}
