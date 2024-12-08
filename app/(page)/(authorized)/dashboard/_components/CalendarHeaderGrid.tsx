export default function CalendarHeaderGrid(){

    return (
        <div className="grid grid-cols-7 gap-1">
            {['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SAB'].map((day) => (
                <div
                key={day}
                className="h-8 flex items-center justify-center text-sm font-medium text-muted-foreground"
                >
                {day}
                </div>
            ))}
        </div>
    )
}