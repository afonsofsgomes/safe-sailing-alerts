
import { useState } from 'react';
import { useAppStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { DialogFooter } from '@/components/ui/dialog';
import { Loader2, InfoIcon, Euro, Share2 } from 'lucide-react';
import { format, addDays, differenceInDays } from 'date-fns';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { fetchSocialMediaSettings } from '@/lib/services';

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
  const [postToSocial, setPostToSocial] = useState<boolean>(true);
  const [socialSettingsChecked, setSocialSettingsChecked] = useState<boolean>(false);
  const [socialEnabled, setSocialEnabled] = useState<boolean>(false);

  // Check if social media posting is enabled
  const checkSocialSettings = async () => {
    if (socialSettingsChecked) return;
    
    try {
      const settings = await fetchSocialMediaSettings();
      const isEnabled = settings?.enabled ?? false;
      setSocialEnabled(isEnabled);
      setPostToSocial(isEnabled);
      setSocialSettingsChecked(true);
    } catch (error) {
      console.error('Error fetching social media settings:', error);
      setSocialEnabled(false);
      setPostToSocial(false);
      setSocialSettingsChecked(true);
    }
  };
  
  // Call this function when the component mounts
  useState(() => {
    checkSocialSettings();
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (!startDate) {
      toast({
        title: "Error",
        description: "Please select a start date",
        variant: "destructive",
      });
      return;
    }

    if (isDateRange && (!endDate || endDate < startDate)) {
      toast({
        title: "Error",
        description: "End date must be after start date",
        variant: "destructive",
      });
      return;
    }

    if (!reason.trim()) {
      toast({
        title: "Error",
        description: "Please provide a reason for the disruption",
        variant: "destructive",
      });
      return;
    }

    if (!isFullDay && (!startTime || !endTime)) {
      toast({
        title: "Error",
        description: "Please provide both start and end times",
        variant: "destructive",
      });
      return;
    }

    if (refundProvided && (refundAmount <= 0)) {
      toast({
        title: "Error",
        description: "Please enter a valid refund amount",
        variant: "destructive",
      });
      return;
    }

    try {
      if (isDateRange) {
        // Calculate days between dates
        const daysDiff = differenceInDays(endDate, startDate);
        
        // Create a disruption for each day in the range
        for (let i = 0; i <= daysDiff; i++) {
          const currentDate = addDays(startDate, i);
          await addDisruption({
            date: currentDate,
            startTime: isFullDay ? undefined : startTime,
            endTime: isFullDay ? undefined : endTime,
            reason,
            isFullDay,
            refundProvided,
            refundAmount: refundProvided ? refundAmount : undefined
          });
        }
        
        toast({
          title: "Success",
          description: `${daysDiff + 1} disruptions added successfully${postToSocial && socialEnabled ? ' and posted to social media' : ''}`,
        });
      } else {
        // Add a single disruption
        await addDisruption({
          date: startDate,
          startTime: isFullDay ? undefined : startTime,
          endTime: isFullDay ? undefined : endTime,
          reason,
          isFullDay,
          refundProvided,
          refundAmount: refundProvided ? refundAmount : undefined
        });
        
        toast({
          title: "Success",
          description: `Disruption added successfully${postToSocial && socialEnabled ? ' and posted to social media' : ''}`,
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
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex items-center space-x-2 mb-4">
        <Switch 
          id="date-range" 
          checked={isDateRange} 
          onCheckedChange={setIsDateRange}
        />
        <Label htmlFor="date-range">Add a date range</Label>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <InfoIcon className="h-4 w-4 text-gray-400" />
            </TooltipTrigger>
            <TooltipContent>
              <p>Create multiple alerts for consecutive dates</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      {isDateRange ? (
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="start-date">Start Date</Label>
            <Input 
              id="start-date" 
              type="date" 
              value={startDate ? format(startDate, 'yyyy-MM-dd') : ''}
              onChange={(e) => setStartDate(new Date(e.target.value))}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="end-date">End Date</Label>
            <Input 
              id="end-date" 
              type="date" 
              value={endDate ? format(endDate, 'yyyy-MM-dd') : ''}
              onChange={(e) => setEndDate(new Date(e.target.value))}
              min={startDate ? format(startDate, 'yyyy-MM-dd') : ''}
              required
            />
          </div>
        </div>
      ) : (
        <div className="space-y-2">
          <Label htmlFor="date">Date</Label>
          <Input 
            id="date" 
            type="date" 
            value={startDate ? format(startDate, 'yyyy-MM-dd') : ''}
            onChange={(e) => setStartDate(new Date(e.target.value))}
            required
          />
        </div>
      )}

      <div className="flex items-center space-x-2">
        <Switch 
          id="full-day" 
          checked={isFullDay} 
          onCheckedChange={setIsFullDay}
        />
        <Label htmlFor="full-day">Full day disruption</Label>
      </div>

      {!isFullDay && (
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="start-time">Start Time</Label>
            <Input 
              id="start-time" 
              type="time" 
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              required={!isFullDay}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="end-time">End Time</Label>
            <Input 
              id="end-time" 
              type="time" 
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              required={!isFullDay}
            />
          </div>
        </div>
      )}

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
      
      {socialSettingsChecked && socialEnabled && (
        <div className="flex items-center space-x-2 pt-2">
          <Switch 
            id="post-to-social" 
            checked={postToSocial} 
            onCheckedChange={setPostToSocial}
          />
          <Label htmlFor="post-to-social" className="flex items-center gap-1.5">
            <Share2 className="h-4 w-4 text-gray-600" />
            Post to social media
          </Label>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <InfoIcon className="h-4 w-4 text-gray-400" />
              </TooltipTrigger>
              <TooltipContent>
                <p>Share this alert on configured social media platforms</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      )}

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
  );
};

export default DisruptionForm;
