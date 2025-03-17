
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Disruption, WidgetSettings } from './types';

interface AppState {
  disruptions: Disruption[];
  widgetSettings: WidgetSettings;
  addDisruption: (disruption: Omit<Disruption, 'id' | 'createdAt'>) => void;
  removeDisruption: (id: string) => void;
  updateDisruption: (id: string, disruption: Partial<Disruption>) => void;
  updateWidgetSettings: (settings: Partial<WidgetSettings>) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
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
      addDisruption: (disruption) => 
        set((state) => ({
          disruptions: [
            ...state.disruptions,
            { 
              ...disruption, 
              id: crypto.randomUUID(),
              createdAt: new Date()
            }
          ]
        })),
      removeDisruption: (id) => 
        set((state) => ({
          disruptions: state.disruptions.filter(d => d.id !== id)
        })),
      updateDisruption: (id, disruption) => 
        set((state) => ({
          disruptions: state.disruptions.map(d => 
            d.id === id ? { ...d, ...disruption } : d
          )
        })),
      updateWidgetSettings: (settings) => 
        set((state) => ({
          widgetSettings: { ...state.widgetSettings, ...settings }
        })),
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

export const formatDisruptionTime = (startTime?: string, endTime?: string, isFullDay: boolean) => {
  if (isFullDay) return 'All Day';
  if (!startTime) return '';
  if (!endTime) return `From ${startTime}`;
  return `${startTime} - ${endTime}`;
};
