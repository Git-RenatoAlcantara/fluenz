'use client';

import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
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

  const handleToday = () => {
    onDateChange(new Date());
  };

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      {/* Date Navigation */}
      <div className="flex items-center gap-3">
        <Button variant="outline" size="sm" onClick={handleToday} className="gap-2">
          <CalendarIcon className="h-4 w-4" />
          Hoje
        </Button>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" onClick={handlePrevious}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="min-w-[180px] text-center">
            <h2 className="text-lg font-semibold">
              {format(currentDate, view === 'Year' ? 'yyyy' : 'MMMM yyyy', { locale: ptBR })}
            </h2>
          </div>
          <Button variant="ghost" size="icon" onClick={handleNext}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* View Selector */}
      <div className="flex items-center gap-1 bg-muted p-1 rounded-lg">
        {views.map((v) => (
          <Button
            key={v}
            variant={view === v ? "default" : "ghost"}
            size="sm"
            onClick={() => onViewChange(v)}
            className={view === v ? "" : "hover:bg-background"}
          >
            {v}
          </Button>
        ))}
      </div>
    </div>
  );
}