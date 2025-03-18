
import React from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface DateSelectorProps {
  forecastDates: string[];
  selectedDate: string;
  onDateChange: (date: string) => void;
  formatDateTab: (dateStr: string) => string;
}

export const DateSelector = ({
  forecastDates,
  selectedDate,
  onDateChange,
  formatDateTab
}: DateSelectorProps) => {
  return (
    <Tabs defaultValue={forecastDates[0]} value={selectedDate} onValueChange={onDateChange}>
      <TabsList className="mb-4 w-full grid grid-cols-3 md:grid-cols-6">
        {forecastDates.map(date => (
          <TabsTrigger key={date} value={date}>
            {formatDateTab(date)}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
};
