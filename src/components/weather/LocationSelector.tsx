
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { WeatherLocation } from '@/lib/types';

interface LocationSelectorProps {
  locations: WeatherLocation[];
  selectedLocation: WeatherLocation;
  onLocationChange: (location: WeatherLocation) => void;
}

export const LocationSelector = ({
  locations,
  selectedLocation,
  onLocationChange,
}: LocationSelectorProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Select a Location</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
          {locations.map(location => (
            <button
              key={location.name}
              onClick={() => onLocationChange(location)}
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
  );
};
