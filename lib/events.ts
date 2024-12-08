import { format } from 'date-fns';

export interface Event {
  type: 'Visits' | 'Calls' | 'Tasks';
  count: number;
  color: string;
}

// Deterministic random number generator
function seededRandom(seed: string) {
  const hash = seed.split('').reduce((acc, char) => {
    return ((acc << 5) - acc) + char.charCodeAt(0) | 0;
  }, 0);
  
  const x = Math.sin(hash) * 10000;
  return x - Math.floor(x);
}

export function generateEventsForDay(date: Date): Event[] {
  // Create a stable seed based on the date
  const seed = format(date, 'yyyy-MM-dd');
  
  const events: Event[] = [
    {
      type: 'Visits',
      count: Math.floor(seededRandom(seed + 'visits') * 3),
      color: 'bg-pink-100 text-pink-800'
    },
    {
      type: 'Calls',
      count: Math.floor(seededRandom(seed + 'calls') * 4),
      color: 'bg-blue-100 text-blue-800'
    },
    {
      type: 'Tasks',
      count: Math.floor(seededRandom(seed + 'tasks') * 2),
      color: 'bg-purple-100 text-purple-800'
    }
  ];
  
  return events.filter(event => event.count > 0);
}