
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { DisruptionForm } from '@/components/DisruptionForm';

interface DisruptionDialogContentProps {
  selectedDate: Date | undefined;
  onSuccess: () => void;
}

export const DisruptionDialogContent = ({
  selectedDate,
  onSuccess
}: DisruptionDialogContentProps) => {
  return (
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
  );
};

export default DisruptionDialogContent;
