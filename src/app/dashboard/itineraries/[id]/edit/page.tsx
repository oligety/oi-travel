import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import EditItineraryForm from './edit-form';
import { auth } from '@/auth';

// Next.js 16 dynamic page parameters
export default async function EditItineraryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  if (!session?.user?.id) {
    return notFound();
  }

  const { id } = await params;
  const itinerary = await prisma.itinerary.findUnique({
    where: { id },
  });

  if (
    !itinerary ||
    (itinerary.userId !== session.user.id && session.user.role !== 'ADMIN')
  ) {
    notFound();
  }

  return (
    <div className="max-w-2xl mx-auto py-12 px-6">
      <h1 className="text-3xl font-bold mb-8 text-zinc-100">
        Edit Trip: {itinerary.name}
      </h1>
      <EditItineraryForm itinerary={itinerary} />
    </div>
  );
}
