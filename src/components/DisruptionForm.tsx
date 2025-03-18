
import { useState } from 'react';
import { useAppStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { DialogFooter } from '@/components/ui/dialog';
import { Loader2 } from 'lucide-react';
import { addDays, differenceInDays } from 'date-fns';
import { ConfirmationDialog } from './ConfirmationDialog';
import { DateSelectionSection } from './disruption-form/DateSelectionSection';
import { TimeSelectionSection } from './disruption-form/TimeSelectionSection';
import { RefundSection } from './disruption-form/RefundSection';

interface DisruptionFormProps {
  initialDate?: Date;
  onSuccess?: () => void;
}

export const DisruptionForm = ({ initialDate, onSuccess }: DisruptionFormProps) => {
  const addDisruption = useAppStore((state) => state.addDisruption);
  const loading = useAppStore((state) => state.loading);
  const { toast } = useToast();

  const [isDateRange, setIsDateRange] = useState<boolean>(false);
  const [startDate, setStartDate] = useState<Date>(initialDate || new Date());
  const [endDate, setEndDate] = useState<Date>(addDays(initialDate || new Date(), 1));
  const [startTime, setStartTime] = useState<string>('09:00');
  const [endTime, setEndTime] = useState<string>('17:00');
  const [reason, setReason] = useState<string>('Unfavorable weather conditions');
  const [isFullDay, setIsFullDay] = useState<boolean>(true);
  const [refundProvided, setRefundProvided] = useState<boolean>(false);
  const [refundAmount, setRefundAmount] = useState<number>(0);

  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [formValues, setFormValues] = useState<any>(null);

  const validateForm = () => {
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    // Store form values to be used after confirmation
    setFormValues({
      startDate,
      endDate,
      startTime,
      endTime,
      reason,
      isFullDay,
      refundProvided,
      refundAmount,
      isDateRange
    });

    // Open confirmation dialog
    setConfirmDialogOpen(true);
  };

  const submitDisruption = async () => {
    if (!formValues) return;

    try {
      if (formValues.isDateRange) {
        // Calculate days between dates
        const daysDiff = differenceInDays(formValues.endDate, formValues.startDate);
        
        // Create a disruption for each day in the range
        for (let i = 0; i <= daysDiff; i++) {
          const currentDate = addDays(formValues.startDate, i);
          await addDisruption({
            date: currentDate,
            startTime: formValues.isFullDay ? undefined : formValues.startTime,
            endTime: formValues.isFullDay ? undefined : formValues.endTime,
            reason: formValues.reason,
            isFullDay: formValues.isFullDay,
            refundProvided: formValues.refundProvided,
            refundAmount: formValues.refundProvided ? formValues.refundAmount : undefined
          });
        }
        
        toast({
          title: "Success",
          description: `${daysDiff + 1} disruptions added successfully`,
        });
      } else {
        // Add a single disruption
        await addDisruption({
          date: formValues.startDate,
          startTime: formValues.isFullDay ? undefined : formValues.startTime,
          endTime: formValues.isFullDay ? undefined : formValues.endTime,
          reason: formValues.reason,
          isFullDay: formValues.isFullDay,
          refundProvided: formValues.refundProvided,
          refundAmount: formValues.refundProvided ? formValues.refundAmount : undefined
        });
        
        toast({
          title: "Success",
          description: "Disruption added successfully",
        });
      }

      // Call the success callback if provided
      if (onSuccess) {
        onSuccess();
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to add disruption",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-4">
        <DateSelectionSection
          isDateRange={isDateRange}
          setIsDateRange={setIsDateRange}
          startDate={startDate}
          setStartDate={setStartDate}
          endDate={endDate}
          setEndDate={setEndDate}
        />

        <TimeSelectionSection
          isFullDay={isFullDay}
          setIsFullDay={setIsFullDay}
          startTime={startTime}
          setStartTime={setStartTime}
          endTime={endTime}
          setEndTime={setEndTime}
        />

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

        <RefundSection
          refundProvided={refundProvided}
          setRefundProvided={setRefundProvided}
          refundAmount={refundAmount}
          setRefundAmount={setRefundAmount}
        />

        <DialogFooter>
          <Button type="submit" className="w-full sm:w-auto" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              'Save Disruption'
            )}
          </Button>
        </DialogFooter>
      </form>

      <ConfirmationDialog
        isOpen={confirmDialogOpen}
        onClose={() => setConfirmDialogOpen(false)}
        onConfirm={submitDisruption}
        title="Confirm Disruption"
        description="Have you already applied this disruption in the Bokun system? This information will be publicly visible in the widget immediately after confirmation."
        confirmText="Yes, Publish Disruption"
        cancelText="Cancel"
        variant="warning"
      />
    </>
  );
};

export default DisruptionForm;
