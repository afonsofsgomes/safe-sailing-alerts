
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { InfoIcon, Euro } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface RefundSectionProps {
  refundProvided: boolean;
  setRefundProvided: (value: boolean) => void;
  refundAmount: number;
  setRefundAmount: (amount: number) => void;
}

export const RefundSection = ({
  refundProvided,
  setRefundProvided,
  refundAmount,
  setRefundAmount
}: RefundSectionProps) => {
  return (
    <>
      <div className="flex items-center space-x-2 pt-2">
        <Switch 
          id="refund-provided" 
          checked={refundProvided} 
          onCheckedChange={setRefundProvided}
        />
        <Label htmlFor="refund-provided">Refund needed</Label>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <InfoIcon className="h-4 w-4 text-gray-400" />
            </TooltipTrigger>
            <TooltipContent>
              <p>Check this if refund was needed for this disruption</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      {refundProvided && (
        <div className="space-y-2">
          <Label htmlFor="refund-amount">Refund Amount (€)</Label>
          <div className="relative">
            <Euro className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
            <Input 
              id="refund-amount" 
              type="number" 
              min="0" 
              step="0.01"
              className="pl-10"
              value={refundAmount}
              onChange={(e) => setRefundAmount(parseFloat(e.target.value))}
              required={refundProvided}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default RefundSection;
