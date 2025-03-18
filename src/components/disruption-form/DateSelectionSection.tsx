
import { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { InfoIcon } from 'lucide-react';
import { format, addDays } from 'date-fns';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface DateSelectionSectionProps {
  isDateRange: boolean;
  setIsDateRange: (value: boolean) => void;
  startDate: Date;
  setStartDate: (date: Date) => void;
  endDate: Date;
  setEndDate: (date: Date) => void;
}

export const DateSelectionSection = ({
  isDateRange,
  setIsDateRange,
  startDate,
  setStartDate,
  endDate,
  setEndDate
}: DateSelectionSectionProps) => {
  return (
    <>
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
    </>
  );
};

export default DateSelectionSection;
