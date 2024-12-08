'use client';

import cookies from "js-cookie";
import { format } from 'date-fns';
import { generateEventsForDay } from '@/lib/events';
import dayjs from "dayjs";
import { BadgeCheck } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { fetchVideo } from '../_actions/fetchVideo';

interface CalendarDayProps {
  date: Date | null;
  isCurrentMonth: boolean;
}

export default function CalendarDay({ date, isCurrentMonth }: CalendarDayProps) {
  const userId: string = cookies.get("userId") || "";

  if (!date) {
    return <div className="h-32 bg-muted/5 rounded-lg" />;
  }

  const fetchDataOptions = {
        userId: parseInt(userId)
    }

    const {isLoading, data} = useQuery({
        queryKey: ['data', fetchDataOptions],
        queryFn: () => fetchVideo(fetchDataOptions),
    })


  
  /*
  const [logs, setLogs] = useState<ILog[]>()

  useEffect(() => {
      const storage = localStorage.getItem("logs");
      if(storage){
        console.log(format(date, "dd-mm-yyyy"))
          setLogs(JSON.parse(storage));
      }
  },[])
  */

  const events = generateEventsForDay(date);

  return (
    <div
      className={`h-32 p-2 rounded-lg border transition-colors ${
        isCurrentMonth ? 'bg-card' : 'bg-muted/5'
      }`}
    >
      <div className="text-sm font-medium mb-1 border-b text-center">
        {format(date, 'd')}
      </div>
      <div className="flex justify-center items-center h-full">
        {data?.videos?.some(log => log.last_view_at === dayjs(date).format("DD-MM-YYYY")) && <BadgeCheck size={40} className='text-green-400'/> }
      </div>
    </div>
  );
}