
import { useToast } from '@/hooks/use-toast';

export const useFormValidation = () => {
  const { toast } = useToast();

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

    return true;
  };

  return { validateForm };
};
