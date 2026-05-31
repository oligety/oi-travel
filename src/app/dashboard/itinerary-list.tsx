'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { format } from 'date-fns';
import { Edit2, Trash2, Calendar, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { deleteItinerary } from '@/actions/itinerary';
import type { Itinerary } from '@prisma/client';

export function ItineraryList({
  itineraries,
  role = 'EDITOR',
  currentUserId,
}: {
  itineraries: Itinerary[];
  role?: string;
  currentUserId?: string;
}) {
  const router = useRouter();
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleDelete() {
    if (!deleteId) return;
    setIsDeleting(true);
    await deleteItinerary(deleteId);
    setIsDeleting(false);
    setDeleteId(null);
  }

  if (itineraries.length === 0) {
    return (
      <div className="glass-panel flex flex-col items-center justify-center rounded-3xl p-10 text-center col-span-full py-20 border-dashed border-2 border-zinc-800">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-zinc-900 border border-white/5">
          <MapPin className="text-primary-400" size={32} />
        </div>
        <h3 className="text-xl font-semibold text-zinc-200">
          No trips planned yet
        </h3>
        <p className="mt-2 text-zinc-500 max-w-sm">
          Your passport is waiting. Start exploring destinations and crafting
          your first perfect itinerary.
        </p>
        {role !== 'VIEWER' && (
          <Link href="/dashboard/itineraries/new">
            <Button className="mt-6 font-medium shadow-lg shadow-primary/20 px-8 bg-primary hover:bg-primary/90">
              Create Trip
            </Button>
          </Link>
        )}
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-white/10 bg-zinc-900/30 overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="border-white/10 hover:bg-transparent">
            <TableHead className="text-zinc-400">Trip Name</TableHead>
            <TableHead className="text-zinc-400">Dates</TableHead>
            {role !== 'VIEWER' && (
              <TableHead className="text-zinc-400 text-right">
                Actions
              </TableHead>
            )}
          </TableRow>
        </TableHeader>
        <TableBody>
          {itineraries.map((trip) => (
            <TableRow
              key={trip.id}
              onClick={() => router.push(`/dashboard/itineraries/${trip.id}`)}
              className="border-white/10 hover:bg-white/5 transition-colors cursor-pointer"
            >
              <TableCell className="font-medium text-zinc-200">
                {trip.name}
              </TableCell>
              <TableCell className="text-zinc-400">
                <div className="flex items-center gap-2">
                  <Calendar size={14} className="text-zinc-500" />
                  {format(new Date(trip.startDate), 'MMM d, yyyy')} -{' '}
                  {format(new Date(trip.endDate), 'MMM d, yyyy')}
                </div>
              </TableCell>
              {role !== 'VIEWER' && (
                <TableCell className="text-right">
                  {(role === 'ADMIN' ||
                    (role === 'EDITOR' && trip.userId === currentUserId)) && (
                    <div className="flex justify-end gap-2">
                      <Link
                        href={`/dashboard/itineraries/${trip.id}/edit`}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Button
                          variant="ghost"
                          size="sm"
                          aria-label={`Edit ${trip.name}`}
                          className="h-8 text-zinc-400 hover:text-emerald-400 hover:bg-emerald-400/10"
                        >
                          <Edit2 size={14} className="mr-2" /> Edit
                        </Button>
                      </Link>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          setDeleteId(trip.id);
                        }}
                        aria-label={`Delete ${trip.name}`}
                        className="h-8 text-zinc-400 hover:text-rose-400 hover:bg-rose-400/10"
                      >
                        <Trash2 size={14} className="mr-2" /> Delete
                      </Button>
                    </div>
                  )}
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
      >
        <DialogContent className="bg-zinc-950 border-white/10 text-zinc-100">
          <DialogHeader>
            <DialogTitle>Delete Trip</DialogTitle>
            <DialogDescription className="text-zinc-400">
              Are you sure you want to delete this itinerary? This action cannot
              be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4 gap-2 sm:gap-0">
            <Button
              variant="ghost"
              onClick={() => setDeleteId(null)}
              className="text-zinc-300 hover:text-white"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-rose-500 hover:bg-rose-600 text-white"
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
