
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
