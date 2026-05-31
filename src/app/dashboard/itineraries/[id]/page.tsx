import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { auth } from '@/auth';
import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default async function ViewItineraryPage({
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
    include: {
      travelDays: {
        orderBy: { date: 'asc' },
      },
    },
  });

  if (!itinerary) {
    notFound();
  }

  const role = session.user.role;

  return (
    <div className="max-w-4xl mx-auto py-12 px-6">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-bold text-zinc-100 mb-2">
            {itinerary.name}
          </h1>
          <div className="flex items-center text-zinc-400 gap-2">
            <CalendarIcon size={16} />
            <span>
              {format(itinerary.startDate, 'MMM d, yyyy')} -{' '}
              {format(itinerary.endDate, 'MMM d, yyyy')}
            </span>
          </div>
        </div>
        <div className="flex gap-4">
          <Link href="/dashboard">
            <Button
              variant="outline"
              className="bg-zinc-900/50 border-white/10 text-zinc-300 hover:text-white hover:bg-zinc-800"
            >
              Back to Dashboard
            </Button>
          </Link>
          {(role === 'ADMIN' ||
            (role === 'EDITOR' && itinerary.userId === session.user.id)) && (
            <Link href={`/dashboard/itineraries/${itinerary.id}/edit`}>
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                Edit Trip
              </Button>
            </Link>
          )}
        </div>
      </div>

      <div className="space-y-6">
        <h2 className="text-xl font-semibold text-zinc-200">Travel Days</h2>
        {itinerary.travelDays.length === 0 ? (
          <p className="text-zinc-500">No travel days scheduled.</p>
        ) : (
          <div className="grid gap-4">
            {itinerary.travelDays.map((day, index) => (
              <div
                key={day.id}
                className="bg-zinc-900/50 p-6 rounded-2xl border border-white/5 flex flex-col md:flex-row gap-6 md:items-center hover:bg-zinc-900/80 transition-colors"
              >
                <div className="flex-shrink-0 text-center md:w-32">
                  <div className="text-sm font-medium text-emerald-400 mb-1">
                    Day {index + 1}
                  </div>
                  <div className="text-xl font-bold text-zinc-100">
                    {format(day.date, 'MMM d')}
                  </div>
                  <div className="text-sm text-zinc-500">
                    {format(day.date, 'EEEE')}
                  </div>
                </div>
                <div className="flex-grow border-l border-white/10 pl-6 flex items-center justify-center text-zinc-500 italic">
                  No activities planned yet.
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
