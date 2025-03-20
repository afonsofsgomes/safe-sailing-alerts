
import { useEffect, useState } from 'react';
import { formatDisruptionDate, formatDisruptionTime, getActiveDisruptions, useAppStore } from '@/lib/store';
import { AlertTriangle, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';

interface AlertWidgetProps {
  className?: string;
  standalone?: boolean;
  showFallback?: boolean;
}

export const AlertWidget = ({ className, standalone = false, showFallback = false }: AlertWidgetProps) => {
  const activeDisruptions = getActiveDisruptions();
  const widgetSettings = useAppStore((state) => state.widgetSettings);
  const [mounted, setMounted] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    setMounted(true);
    console.log('AlertWidget mounted, active disruptions:', activeDisruptions.length);
    console.log('showFallback:', showFallback);
  }, [activeDisruptions.length, showFallback]);

  if (!mounted) return null;
  
  console.log('Rendering AlertWidget, active disruptions:', activeDisruptions.length);
  
  if (activeDisruptions.length === 0) {
    if (!showFallback) {
      console.log('No disruptions and no fallback - rendering null');
      return null;
    }
    
    console.log('No disruptions but showing fallback');
    
    // Fallback message when no disruptions are active
    return (
      <div 
        className={cn(
          'alert-widget overflow-hidden',
          'rounded-lg',
          'shadow-lg',
          'font-sans',
          'border',
          isMobile ? 'p-3 text-sm' : 'p-4',
          'text-white bg-green-500', // Explicitly set text color to white and background to green
          standalone ? (isMobile ? 'w-full mx-auto my-2' : 'max-w-lg mx-auto my-4') : '',
          className
        )}
        style={{ backgroundColor: '#10B981' }} // Explicitly set a background color
      >
        <div className="relative z-10">
          <div className={`flex items-start ${isMobile ? 'gap-2' : 'gap-3'}`}>
            <CheckCircle className={`${isMobile ? 'h-4 w-4' : 'h-5 w-5'} mt-0.5 flex-shrink-0`} />
            <div>
              <h3 className={`font-semibold ${isMobile ? 'text-base' : 'text-lg'}`}>
                All Services Operating Normally
              </h3>
              <p className={`${isMobile ? 'text-xs' : 'text-sm'} mt-1 opacity-90`}>
                There are currently no service alerts. All routes and services are running as scheduled.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const getBorderRadiusClass = () => {
    switch (widgetSettings.borderRadius) {
      case 'none': return 'rounded-none';
      case 'small': return 'rounded-sm';
      case 'medium': return 'rounded-lg';
      case 'large': return 'rounded-xl';
      case 'pill': return 'rounded-full';
      default: return 'rounded-lg';
    }
  };

  const getShadowClass = () => {
    switch (widgetSettings.shadow) {
      case 'none': return 'shadow-none';
      case 'small': return 'shadow-sm';
      case 'medium': return 'shadow-lg';
      case 'large': return 'shadow-xl';
      default: return 'shadow-lg';
    }
  };

  const getFontClass = () => {
    switch (widgetSettings.fontStyle) {
      case 'serif': return 'font-serif';
      case 'mono': return 'font-mono';
      default: return 'font-sans';
    }
  };

  const getBorderWidthClass = () => {
    switch (widgetSettings.borderWidth) {
      case 'none': return 'border-0';
      case 'thin': return 'border';
      case 'medium': return 'border-2';
      case 'thick': return 'border-4';
      default: return 'border';
    }
  };

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

  const getLayoutClasses = () => {
    // Adjust padding for mobile devices
    if (isMobile) {
      switch (widgetSettings.layout) {
        case 'compact':
          return 'p-2';
        case 'minimal':
          return 'p-1.5';
        default:
          return 'p-3';
      }
    }
    
    switch (widgetSettings.layout) {
      case 'compact':
        return 'p-3';
      case 'minimal':
        return 'p-2';
      default:
        return 'p-4';
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
        'alert-widget overflow-hidden',
        getBorderRadiusClass(),
        getShadowClass(),
        getFontClass(),
        getBorderWidthClass(),
        getLayoutClasses(),
        getAnimationClass(),
        'text-white', // Explicitly set text color to white
        isMobile ? 'text-sm' : '',
        standalone ? (isMobile ? 'w-full mx-auto my-2' : 'max-w-lg mx-auto my-4') : '',
        className
      )}
      style={{ 
        backgroundColor: widgetSettings.primaryColor || '#0EA5E9', // Ensure there's a default color
        borderColor: widgetSettings.accentColor || '#F59E0B',
        color: 'white' // Explicitly set text color in inline style as well
      }}
    >
      <div className="relative z-10">
        <div className={`flex items-start ${isMobile ? 'gap-2' : 'gap-3'}`}>
          {widgetSettings.showIcon && (
            <AlertTriangle className={`${isMobile ? 'h-4 w-4' : 'h-5 w-5'} mt-0.5 flex-shrink-0`} 
              style={{ color: widgetSettings.accentColor || '#F59E0B' }} />
          )}
          <div>
            <h3 className={`font-semibold ${isMobile ? 'text-base' : 'text-lg'}`}>
              {widgetSettings.title}
            </h3>
            <p className={`${isMobile ? 'text-xs' : 'text-sm'} mt-1 opacity-90`}>
              {widgetSettings.description}
            </p>
            
            {widgetSettings.showDates && (
              <p className={`font-medium ${isMobile ? 'mt-1.5 text-xs' : 'mt-2'}`}>
                {formatDates()}
              </p>
            )}

            {widgetSettings.showTimes && (
              <div className={`${isMobile ? 'mt-1.5 text-xs' : 'mt-2 text-sm'} space-y-1`}>
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
          style={{ '--wave-color': widgetSettings.accentColor || '#F59E0B' } as React.CSSProperties}
        />
      )}
    </div>
  );
};

export default AlertWidget;
