'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { DatePickerWithRange } from '@/components/date-range-picker';
import { updateItinerary } from '@/actions/itinerary';
import { DateRange } from 'react-day-picker';
import type { Itinerary } from '@prisma/client';

export default function EditItineraryForm({
  itinerary,
}: {
  itinerary: Itinerary;
}) {
  const router = useRouter();
  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(itinerary.startDate),
    to: new Date(itinerary.endDate),
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);
  const [name, setName] = useState(itinerary.name);

  const isFormValid = name.trim().length > 0 && date?.from && date?.to;

  async function handleSubmit(formData: FormData) {
    setIsPending(true);
    setError(null);
    setSuccess(null);

    const res = await updateItinerary(itinerary.id, formData);

    if (res.error) {
      setError(res.error);
    } else {
      setSuccess('Trip updated successfully.');
      router.refresh();
    }
    setIsPending(false);
  }

  return (
    <form
      action={handleSubmit}
      className="space-y-6 bg-zinc-900/50 p-8 rounded-2xl border border-white/5"
    >
      <div className="space-y-2">
        <Label htmlFor="name" className="text-zinc-200">
          Trip Name
        </Label>
        <Input
          id="name"
          name="name"
          required
          data-testid="edit-trip-name-input"
          className="bg-zinc-950/50 border-white/10 text-zinc-100"
          value={name}
          onChange={(e) => setName(e.target.value)}
          aria-invalid={!!error}
          aria-describedby={
            error
              ? 'edit-trip-error'
              : success
                ? 'edit-trip-success'
                : undefined
          }
        />
      </div>

      <div className="space-y-2">
        <Label className="text-zinc-200">Dates</Label>
        <DatePickerWithRange date={date} setDate={setDate} />
      </div>

      {error && (
        <div
          id="edit-trip-error"
          role="alert"
          aria-live="polite"
          className="text-sm text-rose-500 bg-rose-500/10 p-3 rounded-lg border border-rose-500/20"
        >
          {error}
        </div>
      )}

      {success && (
        <div
          id="edit-trip-success"
          role="status"
          aria-live="polite"
          className="text-sm text-emerald-500 bg-emerald-500/10 p-3 rounded-lg border border-emerald-500/20"
        >
          {success}
        </div>
      )}

      <div className="flex justify-end gap-4 mt-8">
        <Button
          type="button"
          variant="ghost"
          onClick={() => router.push('/dashboard')}
          className="text-zinc-300 hover:text-white"
        >
          Back to Dashboard
        </Button>
        <Button
          type="submit"
          data-testid="edit-trip-submit-button"
          disabled={isPending || !isFormValid}
          className="bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
        >
          {isPending ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>
    </form>
  );
}
