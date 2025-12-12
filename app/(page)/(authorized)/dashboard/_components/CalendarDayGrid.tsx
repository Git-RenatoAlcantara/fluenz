'use client';

import { useMemo } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth } from 'date-fns';
import { CalendarViewType } from '@/lib/types/calendar';
import CalendarDay from './CalendarDay';
import { ScrollArea } from "@/components/ui/scroll-area"

interface CalendarGridProps {
  currentDate: Date;
  view: CalendarViewType;
}

export default function CalendarDayGrid({ currentDate, view }: CalendarGridProps) {
  const days = useMemo(() => {
    const start = startOfMonth(currentDate);
    const end = endOfMonth(currentDate);
    return eachDayOfInterval({ start, end });
  }, [currentDate]);

  const startingDayIndex = days[0].getDay();
  const daysWithPadding = Array(startingDayIndex).fill(null).concat(days);

  return (
    <div className="grid grid-cols-7 gap-1 auto-rows-fr">
      {daysWithPadding.map((day, index) => (
          <CalendarDay
          key={index}
          date={day}
          isCurrentMonth={day ? isSameMonth(day, currentDate) : false}
          />
      ))}
    </div>
  );
}