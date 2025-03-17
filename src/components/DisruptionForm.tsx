
import { useState } from 'react';
import { useAppStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { DialogFooter } from '@/components/ui/dialog';

interface DisruptionFormProps {
  initialDate?: Date;
  onSuccess?: () => void;
}

export const DisruptionForm = ({ initialDate, onSuccess }: DisruptionFormProps) => {
  const addDisruption = useAppStore((state) => state.addDisruption);
  const { toast } = useToast();

  const [date, setDate] = useState<Date>(initialDate || new Date());
  const [startTime, setStartTime] = useState<string>('09:00');
  const [endTime, setEndTime] = useState<string>('17:00');
  const [reason, setReason] = useState<string>('Unfavorable weather conditions');
  const [isFullDay, setIsFullDay] = useState<boolean>(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (!date) {
      toast({
        title: "Error",
        description: "Please select a date",
        variant: "destructive",
      });
      return;
    }

    if (!reason.trim()) {
      toast({
        title: "Error",
        description: "Please provide a reason for the disruption",
        variant: "destructive",
      });
      return;
    }

    if (!isFullDay && (!startTime || !endTime)) {
      toast({
        title: "Error",
        description: "Please provide both start and end times",
        variant: "destructive",
      });
      return;
    }

    // Add the new disruption
    addDisruption({
      date,
      startTime: isFullDay ? undefined : startTime,
      endTime: isFullDay ? undefined : endTime,
      reason,
      isFullDay,
    });

    toast({
      title: "Success",
      description: "Disruption added successfully",
    });

    // Call the success callback if provided
    if (onSuccess) {
      onSuccess();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="date">Date</Label>
        <Input 
          id="date" 
          type="date" 
          value={date ? date.toISOString().slice(0, 10) : ''}
          onChange={(e) => setDate(new Date(e.target.value))}
          required
        />
      </div>

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

      <div className="space-y-2">
        <Label htmlFor="reason">Reason</Label>
        <Textarea 
          id="reason" 
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Describe the reason for the disruption..."
          required
        />
      </div>

      <DialogFooter>
        <Button type="submit" className="w-full sm:w-auto">Save Disruption</Button>
      </DialogFooter>
    </form>
  );
};

export default DisruptionForm;
