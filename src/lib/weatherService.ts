
import { WeatherLocation, MarineWeatherData, WeatherData, ForecastData } from './types';

// Define our five locations
export const locations: WeatherLocation[] = [
  { name: 'Funchal', latitude: 32.6431, longitude: -16.9243, type: 'marine' },
  { name: 'Calheta', latitude: 32.7172, longitude: -17.1730, type: 'marine' },
  { name: 'Caniçal', latitude: 32.7422, longitude: -16.7422, type: 'marine' },
  { name: 'Desertas', latitude: 32.5044, longitude: -16.5047, type: 'marine' },
  { name: 'Porto Santo', latitude: 33.0582, longitude: -16.3334, type: 'marine' },
];

// Function to fetch marine weather data from Open-Meteo marine API
export const fetchMarineWeather = async (latitude: number, longitude: number): Promise<MarineWeatherData> => {
  const url = `https://marine-api.open-meteo.com/v1/marine?latitude=${latitude}&longitude=${longitude}&hourly=wave_height,wave_direction,wave_period,wind_wave_height,wind_wave_direction,wind_wave_period,wind_speed_10m,wind_direction_10m,precipitation,pressure_msl&forecast_days=6`;
  
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch marine data: ${response.statusText}`);
    }
    const data = await response.json();
    return data.hourly as MarineWeatherData;
  } catch (error) {
    console.error('Error fetching marine weather:', error);
    throw error;
  }
};

// Function to fetch regular weather data from Open-Meteo weather API
export const fetchWeatherData = async (latitude: number, longitude: number): Promise<WeatherData> => {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m&hourly=wind_speed_10m,wind_direction_10m&daily=precipitation_sum,pressure_msl_mean&forecast_days=6`;
  
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch weather data: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching weather data:', error);
    throw error;
  }
};

// Function to process forecast data for a specific date
export const processWeatherForDate = (location: WeatherLocation, marineData: MarineWeatherData, weatherData: WeatherData, date: string): ForecastData => {
  return {
    location,
    marineData,
    weatherData,
    date
  };
};

// Get dates for the next 6 days (including today)
export const getForecastDates = (): string[] => {
  const dates = [];
  const today = new Date();
  
  for (let i = 0; i < 6; i++) {
    const date = new Date();
    date.setDate(today.getDate() + i);
    dates.push(date.toISOString().split('T')[0]);
  }
  
  return dates;
};

// Format value with units
export const formatValueWithUnit = (value: number | undefined, unit: string): string => {
  if (value === undefined) return 'N/A';
  return `${value.toFixed(1)} ${unit}`;
};

// Convert degrees to cardinal direction
export const degreesToCardinal = (degrees: number | undefined): string => {
  if (degrees === undefined) return 'N/A';
  
  const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  const index = Math.round(((degrees % 360) / 22.5)) % 16;
  return directions[index];
};

// Get the average value for a specific date from hourly data
export const getDailyAverageFromHourly = (hourlyTimes: string[], hourlyValues: number[], targetDate: string): number => {
  const dateValues = hourlyValues.filter((_, index) => hourlyTimes[index].startsWith(targetDate));
  
  if (dateValues.length === 0) return 0;
  
  const sum = dateValues.reduce((acc, val) => acc + val, 0);
  return sum / dateValues.length;
};
