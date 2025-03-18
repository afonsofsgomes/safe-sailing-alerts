
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';

interface TimeSelectionSectionProps {
  isFullDay: boolean;
  setIsFullDay: (value: boolean) => void;
  startTime: string;
  setStartTime: (time: string) => void;
  endTime: string;
  setEndTime: (time: string) => void;
}

export const TimeSelectionSection = ({
  isFullDay,
  setIsFullDay,
  startTime,
  setStartTime,
  endTime,
  setEndTime
}: TimeSelectionSectionProps) => {
  return (
    <>
      <div className="flex items-center space-x-2">
        <Switch 
          id="full-day" 
          checked={isFullDay} 
          onCheckedChange={setIsFullDay}
        />
        <Label htmlFor="full-day">Full day disruption</Label>
      </div>

      {!isFullDay && (
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="start-time">Start Time</Label>
            <Input 
              id="start-time" 
              type="time" 
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              required={!isFullDay}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="end-time">End Time</Label>
            <Input 
              id="end-time" 
              type="time" 
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              required={!isFullDay}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default TimeSelectionSection;
