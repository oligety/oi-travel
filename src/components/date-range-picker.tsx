'use client';

import * as React from 'react';
import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';
import { DateRange } from 'react-day-picker';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

export function DatePickerWithRange({
  className,
  date,
  setDate,
}: {
  className?: string;
  date: DateRange | undefined;
  setDate: (date: DateRange | undefined) => void;
}) {
  return (
    <div className={cn('grid gap-2', className)}>
      <Popover>
        <PopoverTrigger
          render={
            <Button
              id="date"
              type="button"
              variant={'outline'}
              className={cn(
                'w-full justify-start text-left font-normal bg-zinc-900/50 border-white/10 hover:bg-zinc-800 text-zinc-100',
                !date && 'text-zinc-500'
              )}
            />
          }
        >
          <CalendarIcon className="mr-2 h-4 w-4 text-zinc-500" />
          {date?.from ? (
            date.to ? (
              <>
                {format(date.from, 'LLL dd, y')} -{' '}
                {format(date.to, 'LLL dd, y')}
              </>
            ) : (
              format(date.from, 'LLL dd, y')
            )
          ) : (
            <span>Pick a date range</span>
          )}
        </PopoverTrigger>
        <PopoverContent
          className="w-auto p-0 bg-zinc-950 border-white/10 text-zinc-100"
          align="start"
        >
          <Calendar
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={setDate}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>

      {/* Hidden inputs to pass data seamlessly to FormData */}
      {date?.from && (
        <input type="hidden" name="startDate" value={date.from.toISOString()} />
      )}
      {date?.to && (
        <input type="hidden" name="endDate" value={date.to.toISOString()} />
      )}
    </div>
  );
}
