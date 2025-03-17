
export interface Disruption {
  id: string;
  date: Date;
  startTime?: string;
  endTime?: string;
  reason: string;
  isFullDay: boolean;
  createdAt: Date;
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
}
