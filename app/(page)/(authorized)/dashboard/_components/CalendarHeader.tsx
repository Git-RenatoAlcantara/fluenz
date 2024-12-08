'use client';

import { ChevronLeft, ChevronRight, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { CalendarViewType } from '@/lib/types/calendar';

interface CalendarHeaderProps {
  currentDate: Date;
  view: CalendarViewType;
  onViewChange: (view: CalendarViewType) => void;
  onDateChange: (date: Date) => void;
}

export default function CalendarHeader({
  currentDate,
  view,
  onViewChange,
  onDateChange,
}: CalendarHeaderProps) {
  const views: CalendarViewType[] = ['Day', 'Week', 'Month', 'Year'];

  const handlePrevious = () => {
    const newDate = new Date(currentDate);
    if (view === 'Month') newDate.setMonth(currentDate.getMonth() - 1);
    if (view === 'Week') newDate.setDate(currentDate.getDate() - 7);
    if (view === 'Day') newDate.setDate(currentDate.getDate() - 1);
    if (view === 'Year') newDate.setFullYear(currentDate.getFullYear() - 1);
    onDateChange(newDate);
  };

  const handleNext = () => {
    const newDate = new Date(currentDate);
    if (view === 'Month') newDate.setMonth(currentDate.getMonth() + 1);
    if (view === 'Week') newDate.setDate(currentDate.getDate() + 7);
    if (view === 'Day') newDate.setDate(currentDate.getDate() + 1);
    if (view === 'Year') newDate.setFullYear(currentDate.getFullYear() + 1);
    onDateChange(newDate);
  };

  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          {views.map((v) => (
            <Button
              key={v}
              variant={view === v ? "default" : "ghost"}
              size="sm"
              onClick={() => onViewChange(v)}
            >
              {v}
            </Button>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={handlePrevious}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <h2 className="text-xl font-semibold px-4">
            {format(currentDate, view === 'Year' ? 'yyyy' : 'MMMM yyyy')}
          </h2>
          <Button variant="outline" size="icon" onClick={handleNext}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex items-center gap-2">

        </div>
      </div>
    </div>
  );
}