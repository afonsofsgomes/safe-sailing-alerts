
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

export interface SocialMediaSettings {
  id: string;
  enabled: boolean;
  platforms: {
    facebook: {
      enabled: boolean;
      pageId?: string;
      pageName?: string;
    };
    instagram: {
      enabled: boolean;
      accountId?: string;
      username?: string;
    };
  };
  postSettings: {
    includeImage: boolean;
    message: string;
    hashtags: string[];
    autoPost: boolean;
  };
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}
