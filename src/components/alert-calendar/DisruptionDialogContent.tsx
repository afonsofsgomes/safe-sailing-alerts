
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { DisruptionForm } from '@/components/DisruptionForm';

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
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Disruption</DialogTitle>
          <DialogDescription>
            Enter details about the disruption.
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
