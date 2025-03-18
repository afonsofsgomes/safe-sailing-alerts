
import { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { useAuth } from '@/lib/auth';
import { AuthModal } from '@/components/auth/AuthModal';
import { ConfirmationDialog } from '@/components/ConfirmationDialog';
import { CalendarView } from './CalendarView';
import { DisruptionsList } from './DisruptionsList';
import { DisruptionDialogContent } from './DisruptionDialogContent';

export const AlertCalendar = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [disruptionToDelete, setDisruptionToDelete] = useState<string | null>(null);
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
    setDisruptionToDelete(id);
    setDeleteConfirmOpen(true);
  };

  const confirmDeleteDisruption = async () => {
    if (!disruptionToDelete) return;
    
    try {
      await removeDisruption(disruptionToDelete);
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
      <CalendarView
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        disruptions={disruptions}
        onAddDisruption={handleAddDisruption}
        hasDisruption={hasDisruption}
        isDialogOpen={isDialogOpen}
        setIsDialogOpen={setIsDialogOpen}
      />

      <DisruptionsList
        selectedDate={selectedDate}
        getDisruptionsForDate={getDisruptionsForDate}
        onDeleteDisruption={handleDeleteDisruption}
        loading={loading}
      />
      
      {isDialogOpen && (
        <DisruptionDialogContent
          selectedDate={selectedDate}
          onSuccess={() => {
            setIsDialogOpen(false);
          }}
        />
      )}
      
      <ConfirmationDialog
        isOpen={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        onConfirm={confirmDeleteDisruption}
        title="Delete Disruption"
        description="Are you sure you want to delete this disruption? This action cannot be undone and will immediately remove the information from the public widget."
        confirmText="Delete"
        cancelText="Cancel"
        variant="delete"
      />
      
      <AuthModal 
        isOpen={authModalOpen} 
        onClose={() => setAuthModalOpen(false)} 
      />
    </div>
  );
};

export default AlertCalendar;
