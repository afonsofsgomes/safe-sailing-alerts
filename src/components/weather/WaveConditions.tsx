
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Waves, Sun, Moon } from 'lucide-react';
import { MarineWeatherData } from '@/lib/types';
import { formatValueWithUnit, degreesToCardinal, getDailyAverageFromHourly, getMorningEveningAverages } from '@/lib/weatherService';
import { ChartContainer, ChartLegendContent, ChartTooltipContent, ChartTooltip } from '@/components/ui/chart';
import { Legend, Line, LineChart, ResponsiveContainer, XAxis, YAxis } from 'recharts';

interface WaveConditionsProps {
  marineData: MarineWeatherData;
  selectedDate: string;
}

export const WaveConditions = ({ marineData, selectedDate }: WaveConditionsProps) => {
  const getWaveData = () => {
    const dailyData = marineData.hourly.time
      .map((time, index) => ({
        time,
        date: time.split('T')[0],
        wave_height: marineData.hourly.wave_height[index],
        wave_period: marineData.hourly.wave_period[index],
      }))
      .filter(item => item.date === selectedDate);
    
    return dailyData.map(item => ({
      time: new Date(item.time).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      'Wave Height': item.wave_height,
      'Wave Period': item.wave_period,
    }));
  };

  const timeAverages = getMorningEveningAverages(
    marineData.hourly.time,
    marineData.hourly.wave_height,
    selectedDate
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Waves className="h-5 w-5 text-blue-500" />
          Wave Conditions
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col">
              <span className="text-sm text-muted-foreground">Wave Height</span>
              <span className="text-2xl font-bold">
                {formatValueWithUnit(
                  getDailyAverageFromHourly(
                    marineData.hourly.time, 
                    marineData.hourly.wave_height, 
                    selectedDate
                  ),
                  'm'
                )}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm text-muted-foreground">Wave Period</span>
              <span className="text-2xl font-bold">
                {formatValueWithUnit(
                  getDailyAverageFromHourly(
                    marineData.hourly.time, 
                    marineData.hourly.wave_period, 
                    selectedDate
                  ),
                  's'
                )}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm text-muted-foreground">Wave Direction</span>
              <span className="text-2xl font-bold">
                {degreesToCardinal(
                  getDailyAverageFromHourly(
                    marineData.hourly.time, 
                    marineData.hourly.wave_direction, 
                    selectedDate
                  )
                )}
              </span>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 py-2 border-t border-b my-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                <Sun className="h-4 w-4 text-amber-500" />
                <span className="text-xs font-medium">Morning</span>
              </div>
              <span className="text-sm font-medium">
                {formatValueWithUnit(timeAverages.morning, 'm')}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                <Moon className="h-4 w-4 text-indigo-500" />
                <span className="text-xs font-medium">Evening</span>
              </div>
              <span className="text-sm font-medium">
                {formatValueWithUnit(timeAverages.evening, 'm')}
              </span>
            </div>
          </div>
          
          <div className="h-[200px] w-full">
            <ChartContainer
              config={{
                'Wave Height': { color: '#3b82f6' },
                'Wave Period': { color: '#6366f1' },
              }}
            >
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={getWaveData()}>
                  <XAxis dataKey="time" fontSize={12} />
                  <YAxis fontSize={12} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line
                    type="monotone"
                    dataKey="Wave Height"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    dot={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="Wave Period"
                    stroke="#6366f1"
                    strokeWidth={2}
                    dot={false}
                  />
                  <Legend content={<ChartLegendContent />} />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
