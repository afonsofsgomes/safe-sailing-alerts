import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Disruption, WidgetSettings } from './types';
import { 
  fetchDisruptions, 
  createDisruption, 
  updateDisruption as updateDisruptionService, 
  deleteDisruption as deleteDisruptionService,
  fetchWidgetSettings,
  updateWidgetSettings as updateWidgetSettingsService
} from './services';

interface AppState {
  disruptions: Disruption[];
  widgetSettings: WidgetSettings;
  loading: boolean;
  error: string | null;
  // Actions
  fetchData: () => Promise<void>;
  addDisruption: (disruption: Omit<Disruption, 'id' | 'createdAt'>) => Promise<void>;
  removeDisruption: (id: string) => Promise<void>;
  updateDisruption: (id: string, disruption: Partial<Disruption>) => Promise<void>;
  updateWidgetSettings: (settings: Partial<WidgetSettings>) => Promise<void>;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      disruptions: [],
      widgetSettings: {
        title: 'Alert: Unfavorable Weather Conditions',
        description: 'For the safety of everyone, operations will be suspended on the following dates:',
        primaryColor: '#0EA5E9',
        accentColor: '#F59E0B',
        showDates: true,
        showTimes: true,
        showIcon: true,
        animation: 'wave',
      },
      loading: false,
      error: null,
      
      fetchData: async () => {
        try {
          set({ loading: true, error: null });
          const [disruptions, settings] = await Promise.all([
            fetchDisruptions(),
            fetchWidgetSettings()
          ]);
          
          set({
            disruptions,
            widgetSettings: settings || get().widgetSettings,
            loading: false
          });
        } catch (error: any) {
          console.error('Error fetching data:', error);
          set({
            loading: false,
            error: error.message || 'Failed to fetch data'
          });
        }
      },
      
      addDisruption: async (disruption) => {
        try {
          set({ loading: true, error: null });
          const newDisruption = await createDisruption(disruption);
          set(state => ({
            disruptions: [...state.disruptions, newDisruption],
            loading: false
          }));
        } catch (error: any) {
          console.error('Error adding disruption:', error);
          set({
            loading: false,
            error: error.message || 'Failed to add disruption'
          });
          throw error;
        }
      },
      
      removeDisruption: async (id) => {
        try {
          set({ loading: true, error: null });
          await deleteDisruptionService(id);
          set(state => ({
            disruptions: state.disruptions.filter(d => d.id !== id),
            loading: false
          }));
        } catch (error: any) {
          console.error('Error removing disruption:', error);
          set({
            loading: false,
            error: error.message || 'Failed to remove disruption'
          });
          throw error;
        }
      },
      
      updateDisruption: async (id, disruption) => {
        try {
          set({ loading: true, error: null });
          await updateDisruptionService(id, disruption);
          set(state => ({
            disruptions: state.disruptions.map(d => 
              d.id === id ? { ...d, ...disruption } : d
            ),
            loading: false
          }));
        } catch (error: any) {
          console.error('Error updating disruption:', error);
          set({
            loading: false,
            error: error.message || 'Failed to update disruption'
          });
          throw error;
        }
      },
      
      updateWidgetSettings: async (settings) => {
        try {
          set({ loading: true, error: null });
          await updateWidgetSettingsService(settings);
          set(state => ({
            widgetSettings: { ...state.widgetSettings, ...settings },
            loading: false
          }));
        } catch (error: any) {
          console.error('Error updating widget settings:', error);
          set({
            loading: false,
            error: error.message || 'Failed to update widget settings'
          });
          throw error;
        }
      },
    }),
    {
      name: 'boat-tour-alerts-storage',
    }
  )
);

// Helper functions for working with disruptions
export const getActiveDisruptions = () => {
  const { disruptions } = useAppStore.getState();
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return disruptions.filter(disruption => {
    const disruptionDate = new Date(disruption.date);
    disruptionDate.setHours(0, 0, 0, 0);
    return disruptionDate >= today;
  }).sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    return dateA.getTime() - dateB.getTime();
  });
};

export const formatDisruptionDate = (date: Date) => {
  return new Date(date).toLocaleDateString('en-US', { 
    weekday: 'short', 
    month: 'short', 
    day: 'numeric' 
  });
};

// Fix formatDisruptionTime function to put required parameters first
export const formatDisruptionTime = (isFullDay: boolean, startTime?: string, endTime?: string) => {
  if (isFullDay) return 'All Day';
  if (!startTime) return '';
  if (!endTime) return `From ${startTime}`;
  return `${startTime} - ${endTime}`;
};
