
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Droplets } from 'lucide-react';
import { WeatherData } from '@/lib/types';
import { formatValueWithUnit } from '@/lib/weatherService';

interface PrecipitationPressureProps {
  weatherData: WeatherData;
  selectedDate: string;
}

export const PrecipitationPressure = ({ weatherData, selectedDate }: PrecipitationPressureProps) => {
  const getPressureData = () => {
    const pressureIndex = weatherData.daily.time.indexOf(selectedDate);
    if (pressureIndex === -1) return null;
    
    return weatherData.daily.pressure_msl_mean[pressureIndex];
  };

  const getPrecipitationData = () => {
    const precipIndex = weatherData.daily.time.indexOf(selectedDate);
    if (precipIndex === -1) return null;
    
    return weatherData.daily.precipitation_sum[precipIndex];
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Droplets className="h-5 w-5 text-blue-500" />
          Precipitation & Pressure
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col">
            <span className="text-sm text-muted-foreground">Precipitation</span>
            <span className="text-2xl font-bold">
              {formatValueWithUnit(
                getPrecipitationData(),
                'mm'
              )}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm text-muted-foreground">Pressure</span>
            <span className="text-2xl font-bold">
              {formatValueWithUnit(
                getPressureData(),
                'hPa'
              )}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
