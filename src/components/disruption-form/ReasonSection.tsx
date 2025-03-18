
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface ReasonSectionProps {
  reason: string;
  setReason: (reason: string) => void;
}

export const ReasonSection = ({
  reason,
  setReason
}: ReasonSectionProps) => {
  return (
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
  );
};

export default ReasonSection;
