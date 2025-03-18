
import { useState, useEffect } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { useAppStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Trash2, Loader2 } from 'lucide-react';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { DisruptionForm } from './DisruptionForm';
import { useAuth } from '@/lib/auth';
import { AuthModal } from './auth/AuthModal';

export const AlertCalendar = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const { user } = useAuth();
  
  const disruptions = useAppStore((state) => state.disruptions);
  const loading = useAppStore((state) => state.loading);
  const fetchData = useAppStore((state) => state.fetchData);
  const removeDisruption = useAppStore((state) => state.removeDisruption);

  useEffect(() => {
    fetchData();
  }, [fetchData, user]);

  // Function to check if a date has disruptions
  const hasDisruption = (date: Date) => {
    return disruptions.some(disruption => {
      const disruptionDate = new Date(disruption.date);
      return (
        disruptionDate.getDate() === date.getDate() &&
        disruptionDate.getMonth() === date.getMonth() &&
        disruptionDate.getFullYear() === date.getFullYear()
      );
    });
  };

  // Get disruptions for the selected date
  const getDisruptionsForDate = (date: Date) => {
    if (!date) return [];
    
    return disruptions.filter(disruption => {
      const disruptionDate = new Date(disruption.date);
      return (
        disruptionDate.getDate() === date.getDate() &&
        disruptionDate.getMonth() === date.getMonth() &&
        disruptionDate.getFullYear() === date.getFullYear()
      );
    });
  };

  const handleAddDisruption = () => {
    if (!user) {
      setAuthModalOpen(true);
      return;
    }
    setIsDialogOpen(true);
  };

  const handleDeleteDisruption = async (id: string) => {
    try {
      await removeDisruption(id);
    } catch (error) {
      console.error("Failed to delete disruption:", error);
    }
  };

  if (loading && disruptions.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      <div className="flex-1 bg-white rounded-xl shadow-sm border p-5 animate-fade-in">
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={setSelectedDate}
          className="rounded-md pointer-events-auto"
          modifiers={{
            disruption: (date) => hasDisruption(date),
          }}
          modifiersClassNames={{
            disruption: "bg-red-100 text-red-600 font-medium rounded-md",
          }}
        />
        
        <div className="mt-4 flex flex-wrap gap-2">
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button 
                className="flex items-center gap-2 bg-sea-500 hover:bg-sea-600 transition-colors"
                onClick={handleAddDisruption}
              >
                Add Disruption
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Add Disruption</DialogTitle>
                <DialogDescription>
                  Enter details about the disruption.
                </DialogDescription>
              </DialogHeader>
              <DisruptionForm
                initialDate={selectedDate}
                onSuccess={() => {
                  setIsDialogOpen(false);
                }}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>

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
                </div>
                {user && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDeleteDisruption(disruption.id)}
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
      
      <AuthModal 
        isOpen={authModalOpen} 
        onClose={() => setAuthModalOpen(false)} 
      />
    </div>
  );
};

export default AlertCalendar;
