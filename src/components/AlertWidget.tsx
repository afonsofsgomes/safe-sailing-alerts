
import { useEffect, useState } from 'react';
import { formatDisruptionDate, formatDisruptionTime, getActiveDisruptions, useAppStore } from '@/lib/store';
import { AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AlertWidgetProps {
  className?: string;
  standalone?: boolean;
}

export const AlertWidget = ({ className, standalone = false }: AlertWidgetProps) => {
  const activeDisruptions = getActiveDisruptions();
  const widgetSettings = useAppStore((state) => state.widgetSettings);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;
  
  if (activeDisruptions.length === 0) return null;

  const getAnimationClass = () => {
    switch (widgetSettings.animation) {
      case 'fade':
        return 'animate-fade-in';
      case 'slide':
        return 'animate-slide-up';
      case 'wave':
        return '';
      default:
        return '';
    }
  };

  const formatDates = () => {
    if (!widgetSettings.showDates) return null;
    
    const dates = activeDisruptions.map(d => formatDisruptionDate(d.date));
    
    if (dates.length === 1) return dates[0];
    if (dates.length === 2) return `${dates[0]} and ${dates[1]}`;
    
    const lastDate = dates.pop();
    return `${dates.join(', ')}, and ${lastDate}`;
  };

  return (
    <div 
      className={cn(
        'alert-widget p-4 rounded-lg shadow-lg text-white overflow-hidden',
        getAnimationClass(),
        standalone ? 'max-w-lg mx-auto my-4' : '',
        className
      )}
      style={{ 
        backgroundColor: widgetSettings.primaryColor,
        borderColor: widgetSettings.accentColor,
        borderWidth: '1px'
      }}
    >
      <div className="relative z-10">
        <div className="flex items-start gap-3">
          {widgetSettings.showIcon && (
            <AlertTriangle className="h-5 w-5 mt-0.5 flex-shrink-0" 
              style={{ color: widgetSettings.accentColor }} />
          )}
          <div>
            <h3 className="font-semibold text-lg">
              {widgetSettings.title}
            </h3>
            <p className="text-sm mt-1 opacity-90">
              {widgetSettings.description}
            </p>
            
            {widgetSettings.showDates && (
              <p className="font-medium mt-2">
                {formatDates()}
              </p>
            )}

            {widgetSettings.showTimes && (
              <div className="mt-2 text-sm space-y-1">
                {activeDisruptions.map(disruption => (
                  <div key={disruption.id} className="flex items-center gap-2">
                    <span className="font-medium">
                      {formatDisruptionDate(disruption.date)}:
                    </span>
                    <span>
                      {formatDisruptionTime(
                        disruption.isFullDay, 
                        disruption.startTime, 
                        disruption.endTime
                      )}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {widgetSettings.animation === 'wave' && (
        <div 
          className="wave-animation animate-wave" 
          style={{ '--wave-color': widgetSettings.accentColor } as React.CSSProperties}
        />
      )}
    </div>
  );
};

export default AlertWidget;
