
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { DisruptionForm } from '@/components/DisruptionForm';
import { format } from 'date-fns';

interface DisruptionDialogContentProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  selectedDate: Date | undefined;
  onSuccess: () => void;
}

export const DisruptionDialogContent = ({
  isOpen,
  onOpenChange,
  selectedDate,
  onSuccess
}: DisruptionDialogContentProps) => {
  const formattedDate = selectedDate 
    ? format(selectedDate, 'EEEE, MMMM d, yyyy')
    : 'Selected Date';

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Disruption for {formattedDate}</DialogTitle>
          <DialogDescription>
            Enter details about the disruption. Note that you cannot create overlapping disruptions for the same day.
          </DialogDescription>
        </DialogHeader>
        <DisruptionForm
          initialDate={selectedDate}
          onSuccess={onSuccess}
        />
      </DialogContent>
    </Dialog>
  );
};

export default DisruptionDialogContent;
