
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Wind, Sun, Moon } from 'lucide-react';
import { MarineWeatherData } from '@/lib/types';
import { formatValueWithUnit, degreesToCardinal, getDailyAverageFromHourly, getMorningEveningAverages } from '@/lib/weatherService';
import { ChartContainer, ChartLegendContent, ChartTooltipContent, ChartTooltip } from '@/components/ui/chart';
import { Legend, Line, LineChart, ResponsiveContainer, XAxis, YAxis } from 'recharts';

interface WindConditionsProps {
  marineData: MarineWeatherData;
  selectedDate: string;
}

export const WindConditions = ({ marineData, selectedDate }: WindConditionsProps) => {
  const getWindData = () => {
    const dailyData = marineData.time
      .map((time, index) => ({
        time,
        date: time.split('T')[0],
        wind_speed: marineData.wind_speed_10m[index],
        wind_direction: marineData.wind_direction_10m[index],
      }))
      .filter(item => item.date === selectedDate);
    
    return dailyData.map(item => ({
      time: new Date(item.time).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      'Wind Speed': item.wind_speed,
      'Wind Direction': item.wind_direction,
    }));
  };

  const timeAverages = getMorningEveningAverages(
    marineData.time,
    marineData.wind_speed_10m,
    selectedDate
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wind className="h-5 w-5 text-blue-500" />
          Wind Conditions
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col">
              <span className="text-sm text-muted-foreground">Wind Speed</span>
              <span className="text-2xl font-bold">
                {formatValueWithUnit(
                  getDailyAverageFromHourly(
                    marineData.time, 
                    marineData.wind_speed_10m, 
                    selectedDate
                  ),
                  'km/h'
                )}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm text-muted-foreground">Wind Direction</span>
              <span className="text-2xl font-bold">
                {degreesToCardinal(
                  getDailyAverageFromHourly(
                    marineData.time, 
                    marineData.wind_direction_10m, 
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
                {formatValueWithUnit(timeAverages.morning, 'km/h')}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                <Moon className="h-4 w-4 text-indigo-500" />
                <span className="text-xs font-medium">Evening</span>
              </div>
              <span className="text-sm font-medium">
                {formatValueWithUnit(timeAverages.evening, 'km/h')}
              </span>
            </div>
          </div>
          
          <div className="h-[200px] w-full">
            <ChartContainer
              config={{
                'Wind Speed': { color: '#10b981' },
              }}
            >
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={getWindData()}>
                  <XAxis dataKey="time" fontSize={12} />
                  <YAxis fontSize={12} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line
                    type="monotone"
                    dataKey="Wind Speed"
                    stroke="#10b981"
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
