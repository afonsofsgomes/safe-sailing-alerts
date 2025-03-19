
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Trash2, Loader2, User } from 'lucide-react';
import { Disruption } from '@/lib/types';
import { useAuth } from '@/lib/auth';

interface DisruptionsListProps {
  selectedDate: Date | undefined;
  getDisruptionsForDate: (date: Date) => Disruption[];
  onDeleteDisruption: (id: string) => void;
  loading: boolean;
}

export const DisruptionsList = ({
  selectedDate,
  getDisruptionsForDate,
  onDeleteDisruption,
  loading
}: DisruptionsListProps) => {
  const { user } = useAuth();

  return (
    <div className="flex-1 bg-white rounded-xl shadow-sm border p-5 animate-fade-in">
      <h3 className="text-lg font-medium mb-4">
        {selectedDate ? format(selectedDate, 'MMMM d, yyyy') : 'Select a date'}
      </h3>
      
      <div className="space-y-3">
        {selectedDate && getDisruptionsForDate(selectedDate).length === 0 && (
          <p className="text-muted-foreground">No disruptions scheduled for this date.</p>
        )}
        
        {selectedDate && getDisruptionsForDate(selectedDate).map((disruption) => (
          <div 
            key={disruption.id} 
            className="p-3 rounded-lg border bg-amber-50 border-amber-200 animate-fade-in"
          >
            <div className="flex justify-between items-start">
              <div>
                <div className="flex gap-2 items-center">
                  <Badge variant="outline" className="bg-amber-100 text-amber-700 border-amber-200">
                    {disruption.isFullDay
                      ? 'Full Day'
                      : `${disruption.startTime || '00:00'} - ${disruption.endTime || '23:59'}`}
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    Created {format(new Date(disruption.createdAt), 'MMM d, yyyy')}
                  </span>
                </div>
                <p className="mt-2">{disruption.reason}</p>
                
                {disruption.createdByEmail && (
                  <div className="mt-1 flex items-center gap-1 text-xs text-gray-500">
                    <User className="h-3 w-3" />
                    <span>{disruption.createdByEmail}</span>
                  </div>
                )}
              </div>
              {user && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onDeleteDisruption(disruption.id)}
                  className="text-red-500 hover:text-red-700 hover:bg-red-50"
                  disabled={loading}
                >
                  {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Trash2 className="h-4 w-4" />
                  )}
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DisruptionsList;
