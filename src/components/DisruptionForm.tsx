
import { useState } from 'react';
import { useAppStore } from '@/lib/store';
import { useToast } from '@/hooks/use-toast';
import { addDays, differenceInDays } from 'date-fns';
import { ConfirmationDialog } from './ConfirmationDialog';
import { 
  DateSelectionSection,
  TimeSelectionSection,
  RefundSection,
  ReasonSection,
  FormActions,
  useFormValidation
} from './disruption-form';

interface DisruptionFormProps {
  initialDate?: Date;
  onSuccess?: () => void;
}

export const DisruptionForm = ({ initialDate, onSuccess }: DisruptionFormProps) => {
  const addDisruption = useAppStore((state) => state.addDisruption);
  const loading = useAppStore((state) => state.loading);
  const { toast } = useToast();
  const { validateForm } = useFormValidation();

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm(
      startDate,
      isDateRange ? endDate : null,
      reason,
      isDateRange,
      isFullDay,
      startTime,
      endTime,
      refundProvided,
      refundAmount
    )) {
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

        <ReasonSection 
          reason={reason}
          setReason={setReason}
        />

        <RefundSection
          refundProvided={refundProvided}
          setRefundProvided={setRefundProvided}
          refundAmount={refundAmount}
          setRefundAmount={setRefundAmount}
        />

        <FormActions 
          loading={loading}
          onSubmit={handleSubmit}
        />
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
