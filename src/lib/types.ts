
export interface Disruption {
  id: string;
  date: Date;
  startTime?: string;
  endTime?: string;
  reason: string;
  isFullDay: boolean;
  createdAt: Date;
  refundProvided?: boolean;
  refundAmount?: number;
  createdByEmail?: string;
}

export interface WidgetSettings {
  title: string;
  description: string;
  primaryColor: string;
  accentColor: string;
  showDates: boolean;
  showTimes: boolean;
  showIcon: boolean;
  animation: 'none' | 'fade' | 'slide' | 'wave';
  borderRadius: 'none' | 'small' | 'medium' | 'large' | 'pill';
  shadow: 'none' | 'small' | 'medium' | 'large';
  fontStyle: 'default' | 'serif' | 'mono';
  layout: 'standard' | 'compact' | 'minimal';
  borderWidth: 'none' | 'thin' | 'medium' | 'thick';
}

export interface WeatherLocation {
  name: string;
  latitude: number;
  longitude: number;
  type: 'marine' | 'land';
}

export interface MarineWeatherData {
  time: string[];
  wave_height: number[];
  wave_period: number[];
  wave_direction: number[];
  wind_speed_10m: number[];
  wind_direction_10m: number[];
  precipitation: number[];
  pressure_msl: number[];
}

export interface WeatherData {
  daily: {
    time: string[];
    precipitation_sum: number[];
    pressure_msl_mean: number[];
  };
  hourly: {
    time: string[];
    wind_speed_10m: number[];
    wind_direction_10m: number[];
  };
  current: {
    time: string;
    temperature_2m: number;
  };
}

export interface ForecastData {
  location: WeatherLocation;
  marineData?: MarineWeatherData;
  weatherData?: WeatherData;
  date: string;
}
