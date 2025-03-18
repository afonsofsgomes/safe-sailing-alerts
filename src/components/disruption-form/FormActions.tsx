
import { Button } from '@/components/ui/button';
import { DialogFooter } from '@/components/ui/dialog';
import { Loader2 } from 'lucide-react';

interface FormActionsProps {
  loading: boolean;
  onSubmit: (e: React.FormEvent) => void;
}

export const FormActions = ({
  loading,
  onSubmit
}: FormActionsProps) => {
  return (
    <DialogFooter>
      <Button type="submit" className="w-full sm:w-auto" disabled={loading} onClick={onSubmit}>
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
  );
};

export default FormActions;
