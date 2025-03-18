
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Compass, Waves, Wind, Droplets, Gauge, Sun, Moon } from 'lucide-react';
import { WeatherLocation, MarineWeatherData, WeatherData } from '@/lib/types';
import { 
  formatValueWithUnit, 
  degreesToCardinal, 
  getDailyAverageFromHourly,
  getMorningEveningAverages
} from '@/lib/weatherService';

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

  const waveHeightTimes = getMorningEveningAverages(
    marineData.hourly.time,
    marineData.hourly.wave_height,
    selectedDate
  );
  
  const windSpeedTimes = getMorningEveningAverages(
    marineData.hourly.time,
    marineData.hourly.wind_speed_10m,
    selectedDate
  );

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
                marineData.hourly.time, 
                marineData.hourly.wave_height, 
                selectedDate
              ),
              'm'
            )} 
            with winds at {formatValueWithUnit(
              getDailyAverageFromHourly(
                marineData.hourly.time, 
                marineData.hourly.wind_speed_10m, 
                selectedDate
              ),
              'km/h'
            )} 
            from the {degreesToCardinal(
              getDailyAverageFromHourly(
                marineData.hourly.time, 
                marineData.hourly.wind_direction_10m, 
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
                    marineData.hourly.time, 
                    marineData.hourly.wave_height, 
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
                    marineData.hourly.time, 
                    marineData.hourly.wind_speed_10m, 
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
          
          <div className="mt-4 border-t pt-4">
            <h4 className="text-sm font-medium mb-2">Morning & Evening Averages</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-sky-50 p-3 rounded-md">
                <div className="flex items-center gap-2 mb-2">
                  <Sun className="h-4 w-4 text-amber-500" />
                  <span className="text-sm font-medium">Morning</span>
                </div>
                <div className="grid grid-cols-1 gap-2">
                  <div className="flex justify-between">
                    <span className="text-xs">Wave Height:</span>
                    <span className="text-xs font-medium">
                      {formatValueWithUnit(waveHeightTimes.morning, 'm')}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs">Wind Speed:</span>
                    <span className="text-xs font-medium">
                      {formatValueWithUnit(windSpeedTimes.morning, 'km/h')}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="bg-indigo-50 p-3 rounded-md">
                <div className="flex items-center gap-2 mb-2">
                  <Moon className="h-4 w-4 text-indigo-500" />
                  <span className="text-sm font-medium">Evening</span>
                </div>
                <div className="grid grid-cols-1 gap-2">
                  <div className="flex justify-between">
                    <span className="text-xs">Wave Height:</span>
                    <span className="text-xs font-medium">
                      {formatValueWithUnit(waveHeightTimes.evening, 'm')}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs">Wind Speed:</span>
                    <span className="text-xs font-medium">
                      {formatValueWithUnit(windSpeedTimes.evening, 'km/h')}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
