
import { useToast } from '@/hooks/use-toast';
import { useAppStore } from '@/lib/store';

export const useFormValidation = () => {
  const { toast } = useToast();
  const disruptions = useAppStore((state) => state.disruptions);

  const validateForm = (
    startDate: Date,
    endDate: Date | null,
    reason: string,
    isDateRange: boolean,
    isFullDay: boolean,
    startTime: string,
    endTime: string,
    refundProvided: boolean,
    refundAmount: number
  ) => {
    // Basic validation
    if (!startDate) {
      toast({
        title: "Error",
        description: "Please select a start date",
        variant: "destructive",
      });
      return false;
    }

    if (isDateRange && (!endDate || endDate < startDate)) {
      toast({
        title: "Error",
        description: "End date must be after start date",
        variant: "destructive",
      });
      return false;
    }

    if (!reason.trim()) {
      toast({
        title: "Error",
        description: "Please provide a reason for the disruption",
        variant: "destructive",
      });
      return false;
    }

    if (!isFullDay && (!startTime || !endTime)) {
      toast({
        title: "Error",
        description: "Please provide both start and end times",
        variant: "destructive",
      });
      return false;
    }

    if (refundProvided && (refundAmount <= 0)) {
      toast({
        title: "Error",
        description: "Please enter a valid refund amount",
        variant: "destructive",
      });
      return false;
    }

    // Check for existing disruptions on the selected date(s)
    if (isDateRange && endDate) {
      // Create an array of dates in the range
      const dates: Date[] = [];
      const currentDate = new Date(startDate);
      
      while (currentDate <= endDate) {
        dates.push(new Date(currentDate));
        currentDate.setDate(currentDate.getDate() + 1);
      }
      
      // Check each date for existing disruptions
      for (const date of dates) {
        const conflictingDisruption = hasDisruptionConflict(date, isFullDay, startTime, endTime);
        if (conflictingDisruption) {
          const formattedDate = date.toLocaleDateString('en-US', { 
            weekday: 'short', 
            month: 'short', 
            day: 'numeric' 
          });
          
          toast({
            title: "Disruption Conflict",
            description: `A disruption already exists for ${formattedDate}. Cannot create overlapping disruptions.`,
            variant: "destructive",
          });
          return false;
        }
      }
    } else {
      // Single date check
      const conflictingDisruption = hasDisruptionConflict(startDate, isFullDay, startTime, endTime);
      if (conflictingDisruption) {
        const formattedDate = startDate.toLocaleDateString('en-US', { 
          weekday: 'short', 
          month: 'short', 
          day: 'numeric' 
        });
        
        toast({
          title: "Disruption Conflict",
          description: `A disruption already exists for ${formattedDate}. Cannot create overlapping disruptions.`,
          variant: "destructive",
        });
        return false;
      }
    }

    return true;
  };

  // Helper function to check if a disruption already exists for a specific date
  const hasDisruptionConflict = (
    date: Date, 
    isFullDay: boolean, 
    startTime?: string, 
    endTime?: string
  ) => {
    // Reset the time to midnight for date comparison
    const targetDate = new Date(date);
    targetDate.setHours(0, 0, 0, 0);
    
    // Find disruptions on the same date
    const existingDisruptions = disruptions.filter(disruption => {
      const disruptionDate = new Date(disruption.date);
      disruptionDate.setHours(0, 0, 0, 0);
      return disruptionDate.getTime() === targetDate.getTime();
    });
    
    if (existingDisruptions.length === 0) {
      return false; // No disruptions found for this date
    }
    
    // If there's any full-day disruption, there's a conflict
    if (existingDisruptions.some(d => d.isFullDay) || isFullDay) {
      return true; // Full day disruptions conflict with anything
    }
    
    // Check time overlap for time-specific disruptions
    if (!isFullDay && startTime && endTime) {
      // Convert times to comparable values (minutes since midnight)
      const newStartMinutes = convertTimeToMinutes(startTime);
      const newEndMinutes = convertTimeToMinutes(endTime);
      
      // Check for overlap with any existing time-specific disruption
      return existingDisruptions.some(disruption => {
        if (!disruption.startTime || !disruption.endTime) return false;
        
        const existingStartMinutes = convertTimeToMinutes(disruption.startTime);
        const existingEndMinutes = convertTimeToMinutes(disruption.endTime);
        
        // Check for any overlap in time ranges
        return (
          (newStartMinutes <= existingEndMinutes && newEndMinutes >= existingStartMinutes)
        );
      });
    }
    
    return false;
  };
  
  // Helper function to convert time string ("HH:MM") to minutes since midnight
  const convertTimeToMinutes = (time: string) => {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  };

  return { validateForm };
};
