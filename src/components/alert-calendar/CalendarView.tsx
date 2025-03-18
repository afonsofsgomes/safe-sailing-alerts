
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/auth';
import { Disruption } from '@/lib/types';

interface CalendarViewProps {
  selectedDate: Date | undefined;
  setSelectedDate: (date: Date | undefined) => void;
  disruptions: Disruption[];
  onAddDisruption: () => void;
  hasDisruption: (date: Date) => boolean;
}

export const CalendarView = ({
  selectedDate,
  setSelectedDate,
  disruptions,
  onAddDisruption,
  hasDisruption
}: CalendarViewProps) => {
  const { user } = useAuth();

  return (
    <div className="flex-1 bg-white rounded-xl shadow-sm border p-5 animate-fade-in">
      <Calendar
        mode="single"
        selected={selectedDate}
        onSelect={setSelectedDate}
        className="rounded-md pointer-events-auto"
        modifiers={{
          disruption: (date) => hasDisruption(date),
        }}
        modifiersClassNames={{
          disruption: "bg-red-100 text-red-600 font-medium rounded-md",
        }}
      />
      
      <div className="mt-4 flex flex-wrap gap-2">
        <Button 
          className="flex items-center gap-2 bg-sea-500 hover:bg-sea-600 transition-colors"
          onClick={onAddDisruption}
        >
          Add Disruption
        </Button>
      </div>
    </div>
  );
};

export default CalendarView;
