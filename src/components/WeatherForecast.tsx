
import React, { useState, useEffect } from 'react';
import { 
  locations, 
  fetchMarineWeather, 
  fetchWeatherData, 
  getForecastDates,
  degreesToCardinal,
  formatValueWithUnit,
  getDailyAverageFromHourly
} from '@/lib/weatherService';
import { MarineWeatherData, WeatherData, WeatherLocation } from '@/lib/types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Waves, Wind, Droplets, Compass, Gauge } from 'lucide-react';
import { ChartContainer, ChartLegendContent, ChartTooltipContent, ChartTooltip } from '@/components/ui/chart';
import { Legend, Line, LineChart, ResponsiveContainer, XAxis, YAxis } from 'recharts';
import { useToast } from '@/hooks/use-toast';

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

  const getWaveData = () => {
    if (!marineData) return [];
    
    const dailyData = marineData.time
      .map((time, index) => ({
        time,
        date: time.split('T')[0],
        wave_height: marineData.wave_height[index],
        wave_period: marineData.wave_period[index],
      }))
      .filter(item => item.date === selectedDate);
    
    return dailyData.map(item => ({
      time: new Date(item.time).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      'Wave Height': item.wave_height,
      'Wave Period': item.wave_period,
    }));
  };

  const getWindData = () => {
    if (!marineData || !weatherData) return [];
    
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

  const getPressureData = () => {
    if (!weatherData) return null;
    
    const pressureIndex = weatherData.daily.time.indexOf(selectedDate);
    if (pressureIndex === -1) return null;
    
    return weatherData.daily.pressure_msl_mean[pressureIndex];
  };

  const getPrecipitationData = () => {
    if (!weatherData) return null;
    
    const precipIndex = weatherData.daily.time.indexOf(selectedDate);
    if (precipIndex === -1) return null;
    
    return weatherData.daily.precipitation_sum[precipIndex];
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Marine Weather Forecast</h2>
      
      <Card>
        <CardHeader>
          <CardTitle>Select a Location</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
            {locations.map(location => (
              <button
                key={location.name}
                onClick={() => handleLocationChange(location)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors 
                  ${selectedLocation.name === location.name 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-card text-card-foreground hover:bg-muted border'}`}
              >
                {location.name}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>
      
      {loading ? (
        <div className="flex justify-center items-center p-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2">Loading weather data...</span>
        </div>
      ) : error ? (
        <Card className="bg-red-50">
          <CardContent className="pt-6">
            <p className="text-red-600">{error}</p>
          </CardContent>
        </Card>
      ) : (
        <>
          <Tabs defaultValue={forecastDates[0]} value={selectedDate} onValueChange={handleDateChange}>
            <TabsList className="mb-4 w-full grid grid-cols-3 md:grid-cols-6">
              {forecastDates.map(date => (
                <TabsTrigger key={date} value={date}>
                  {formatDateTab(date)}
                </TabsTrigger>
              ))}
            </TabsList>
            
            {forecastDates.map(date => (
              <TabsContent key={date} value={date}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Waves className="h-5 w-5 text-blue-500" />
                        Wave Conditions
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {marineData && (
                        <div className="space-y-6">
                          <div className="grid grid-cols-2 gap-4">
                            <div className="flex flex-col">
                              <span className="text-sm text-muted-foreground">Wave Height</span>
                              <span className="text-2xl font-bold">
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
                            <div className="flex flex-col">
                              <span className="text-sm text-muted-foreground">Wave Period</span>
                              <span className="text-2xl font-bold">
                                {formatValueWithUnit(
                                  getDailyAverageFromHourly(
                                    marineData.time, 
                                    marineData.wave_period, 
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
                                    marineData.time, 
                                    marineData.wave_direction, 
                                    selectedDate
                                  )
                                )}
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
                      )}
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Wind className="h-5 w-5 text-blue-500" />
                        Wind Conditions
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {marineData && (
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
                      )}
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Droplets className="h-5 w-5 text-blue-500" />
                        Precipitation & Pressure
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {weatherData && (
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
                      )}
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Compass className="h-5 w-5 text-blue-500" />
                        Summary for {selectedLocation.name}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {marineData && weatherData && (
                        <div className="space-y-4">
                          <p className="text-sm">
                            Marine conditions for {formatDateTab(selectedDate)} at {selectedLocation.name} show
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
                      )}
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </>
      )}
    </div>
  );
};

export default WeatherForecast;
