'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { DatePickerWithRange } from '@/components/date-range-picker';
import { createItinerary } from '@/actions/itinerary';
import { DateRange } from 'react-day-picker';

export default function NewItineraryPage() {
  const router = useRouter();
  const [date, setDate] = useState<DateRange | undefined>();
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);
  const [name, setName] = useState('');

  const isFormValid = name.trim().length > 0 && date?.from && date?.to;

  async function handleSubmit(formData: FormData) {
    setIsPending(true);
    setError(null);
    const res = await createItinerary(formData);

    if (res.error) {
      setError(res.error);
      setIsPending(false);
    } else if (res.id) {
      router.push(`/dashboard/itineraries/${res.id}`);
    }
  }

  return (
    <div className="max-w-2xl mx-auto py-12 px-6">
      <h1 className="text-3xl font-bold mb-8 text-zinc-100">Create New Trip</h1>

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
            placeholder="e.g., Summer in Kyoto"
            data-testid="create-trip-name-input"
            required
            className="bg-zinc-950/50 border-white/10 text-zinc-100"
            value={name}
            onChange={(e) => setName(e.target.value)}
            aria-invalid={!!error}
            aria-describedby={error ? 'create-trip-error' : undefined}
          />
        </div>

        <div className="space-y-2">
          <Label className="text-zinc-200">Dates</Label>
          <DatePickerWithRange date={date} setDate={setDate} />
        </div>

        {error && (
          <div
            id="create-trip-error"
            role="alert"
            aria-live="polite"
            className="text-sm text-rose-500 bg-rose-500/10 p-3 rounded-lg border border-rose-500/20"
          >
            {error}
          </div>
        )}

        <div className="flex justify-end gap-4 mt-8">
          <Button
            type="button"
            variant="ghost"
            onClick={() => router.back()}
            className="text-zinc-300 hover:text-white"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            data-testid="create-trip-submit-button"
            disabled={isPending || !isFormValid}
            className="bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
          >
            {isPending ? 'Creating...' : 'Create Trip'}
          </Button>
        </div>
      </form>
    </div>
  );
}
