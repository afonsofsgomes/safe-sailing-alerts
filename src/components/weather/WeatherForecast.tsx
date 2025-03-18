
import React, { useState, useEffect } from 'react';
import { 
  locations, 
  fetchMarineWeather, 
  fetchWeatherData, 
  getForecastDates
} from '@/lib/weatherService';
import { MarineWeatherData, WeatherData, WeatherLocation } from '@/lib/types';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { LocationSelector } from './LocationSelector';
import { WaveConditions } from './WaveConditions';
import { WindConditions } from './WindConditions';
import { PrecipitationPressure } from './PrecipitationPressure';
import { WeatherSummary } from './WeatherSummary';
import { DateSelector } from './DateSelector';

export const WeatherForecast = () => {
  const [selectedLocation, setSelectedLocation] = useState<WeatherLocation>(locations[0]);
  const [marineData, setMarineData] = useState<MarineWeatherData | null>(null);
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>(getForecastDates()[0]);
  const { toast } = useToast();
  
  const fetchForecastData = async (location: WeatherLocation) => {
    setLoading(true);
    setError(null);
    
    try {
      const [marine, weather] = await Promise.all([
        fetchMarineWeather(location.latitude, location.longitude),
        fetchWeatherData(location.latitude, location.longitude)
      ]);
      
      setMarineData(marine);
      setWeatherData(weather);
    } catch (err) {
      const errorMessage = 'Failed to load weather data. Please try again later.';
      setError(errorMessage);
      console.error('Weather fetch error:', err);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchForecastData(selectedLocation);
  }, [selectedLocation]);

  const handleLocationChange = (location: WeatherLocation) => {
    setSelectedLocation(location);
  };

  const handleDateChange = (date: string) => {
    setSelectedDate(date);
  };

  const forecastDates = getForecastDates();
  
  const formatDateTab = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Marine Weather Forecast</h2>
      
      <LocationSelector 
        locations={locations}
        selectedLocation={selectedLocation}
        onLocationChange={handleLocationChange}
      />
      
      {loading ? (
        <div className="flex justify-center items-center p-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2">Loading weather data...</span>
        </div>
      ) : error ? (
        <div className="bg-red-50 p-6 rounded-lg">
          <p className="text-red-600">{error}</p>
        </div>
      ) : (
        <>
          <DateSelector 
            forecastDates={forecastDates}
            selectedDate={selectedDate}
            onDateChange={handleDateChange}
            formatDateTab={formatDateTab}
          />
          
          {forecastDates.map(date => (
            <TabsContent key={date} value={date}>
              {marineData && weatherData && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <WaveConditions 
                    marineData={marineData}
                    selectedDate={selectedDate}
                  />
                  
                  <WindConditions 
                    marineData={marineData}
                    selectedDate={selectedDate}
                  />
                  
                  <PrecipitationPressure 
                    weatherData={weatherData}
                    selectedDate={selectedDate}
                  />
                  
                  <WeatherSummary 
                    selectedLocation={selectedLocation}
                    marineData={marineData}
                    weatherData={weatherData}
                    selectedDate={selectedDate}
                    formattedDate={formatDateTab(selectedDate)}
                  />
                </div>
              )}
            </TabsContent>
          ))}
        </>
      )}
    </div>
  );
};

export default WeatherForecast;
