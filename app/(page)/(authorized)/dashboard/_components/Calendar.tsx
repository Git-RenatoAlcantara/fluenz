import { CalendarViewType } from "@/lib/types/calendar";
import { useState } from "react";
import CalendarHeader from "./CalendarHeader";
import CalendarGrid from "./CalendarDayGrid";
import CalendarHeaderGrid from "./CalendarHeaderGrid";
import CalendarDayGrid from "./CalendarDayGrid";

export default function Calendar(){

    const [currentDate, setCurrentDate] = useState(new Date());
    const [view, setView] = useState<CalendarViewType>('Month');
    
    return (
        <div className="shadow-lg p-6">
        <CalendarHeader 
            currentDate={currentDate}
            view={view}
            onViewChange={setView}
            onDateChange={setCurrentDate}
        />
        <div className="w-full">
            <CalendarHeaderGrid />
            <CalendarDayGrid 
                currentDate={currentDate}
                view={view}
            />
        </div>
            
    </div>
    )
}