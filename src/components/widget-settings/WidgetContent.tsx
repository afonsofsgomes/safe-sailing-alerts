
import { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { WidgetSettings } from '@/lib/types';

interface WidgetContentProps {
  settings: WidgetSettings;
  onSettingChange: (key: keyof WidgetSettings, value: any) => void;
}

export const WidgetContent = ({ settings, onSettingChange }: WidgetContentProps) => {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="title">Alert Title</Label>
        <Input 
          id="title" 
          value={settings.title} 
          onChange={(e) => onSettingChange('title', e.target.value)}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="description">Alert Description</Label>
        <Textarea 
          id="description" 
          value={settings.description}
          onChange={(e) => onSettingChange('description', e.target.value)}
          rows={3}
        />
      </div>
      
      <div className="flex items-center justify-between">
        <Label htmlFor="showDates">Show Dates</Label>
        <Switch 
          id="showDates" 
          checked={settings.showDates}
          onCheckedChange={(checked) => onSettingChange('showDates', checked)}
        />
      </div>
      
      <div className="flex items-center justify-between">
        <Label htmlFor="showTimes">Show Times</Label>
        <Switch 
          id="showTimes" 
          checked={settings.showTimes}
          onCheckedChange={(checked) => onSettingChange('showTimes', checked)}
        />
      </div>
      
      <div className="flex items-center justify-between">
        <Label htmlFor="showIcon">Show Alert Icon</Label>
        <Switch 
          id="showIcon" 
          checked={settings.showIcon}
          onCheckedChange={(checked) => onSettingChange('showIcon', checked)}
        />
      </div>
    </div>
  );
};
