
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Compass, Waves, Wind, Droplets, Gauge } from 'lucide-react';
import { WeatherLocation, MarineWeatherData, WeatherData } from '@/lib/types';
import { formatValueWithUnit, degreesToCardinal, getDailyAverageFromHourly } from '@/lib/weatherService';

interface WeatherSummaryProps {
  selectedLocation: WeatherLocation;
  marineData: MarineWeatherData;
  weatherData: WeatherData;
  selectedDate: string;
  formattedDate: string;
}

export const WeatherSummary = ({ 
  selectedLocation, 
  marineData, 
  weatherData, 
  selectedDate,
  formattedDate
}: WeatherSummaryProps) => {
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
          <Compass className="h-5 w-5 text-blue-500" />
          Summary for {selectedLocation.name}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p className="text-sm">
            Marine conditions for {formattedDate} at {selectedLocation.name} show
            waves of {formatValueWithUnit(
              getDailyAverageFromHourly(
                marineData.time, 
                marineData.wave_height, 
                selectedDate
              ),
              'm'
            )} 
            with winds at {formatValueWithUnit(
              getDailyAverageFromHourly(
                marineData.time, 
                marineData.wind_speed_10m, 
                selectedDate
              ),
              'km/h'
            )} 
            from the {degreesToCardinal(
              getDailyAverageFromHourly(
                marineData.time, 
                marineData.wind_direction_10m, 
                selectedDate
              )
            )}.
          </p>
          
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <div className="flex items-center gap-1 text-sm">
              <Waves className="h-4 w-4 text-blue-500" />
              <span>
                {formatValueWithUnit(
                  getDailyAverageFromHourly(
                    marineData.time, 
                    marineData.wave_height, 
                    selectedDate
                  ),
                  'm'
                )}
              </span>
            </div>
            
            <div className="flex items-center gap-1 text-sm">
              <Wind className="h-4 w-4 text-green-500" />
              <span>
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
            
            <div className="flex items-center gap-1 text-sm">
              <Droplets className="h-4 w-4 text-blue-400" />
              <span>
                {formatValueWithUnit(
                  getPrecipitationData(),
                  'mm'
                )}
              </span>
            </div>
            
            <div className="flex items-center gap-1 text-sm">
              <Gauge className="h-4 w-4 text-gray-500" />
              <span>
                {formatValueWithUnit(
                  getPressureData(),
                  'hPa'
                )}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
