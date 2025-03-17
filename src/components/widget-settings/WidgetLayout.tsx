
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { WidgetSettings } from '@/lib/types';

interface WidgetLayoutProps {
  settings: WidgetSettings;
  onSettingChange: (key: keyof WidgetSettings, value: any) => void;
}

export const WidgetLayout = ({ settings, onSettingChange }: WidgetLayoutProps) => {
  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <Label>Layout Style</Label>
        <Select 
          value={settings.layout} 
          onValueChange={(value: any) => onSettingChange('layout', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select layout style" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="standard">Standard</SelectItem>
            <SelectItem value="compact">Compact</SelectItem>
            <SelectItem value="minimal">Minimal</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-3">
        <Label>Animation Style</Label>
        <RadioGroup 
          value={settings.animation} 
          onValueChange={(value) => onSettingChange('animation', value)}
          className="flex flex-col space-y-1"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="none" id="none" />
            <Label htmlFor="none">None</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="fade" id="fade" />
            <Label htmlFor="fade">Fade In</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="slide" id="slide" />
            <Label htmlFor="slide">Slide Up</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="wave" id="wave" />
            <Label htmlFor="wave">Wave Effect</Label>
          </div>
        </RadioGroup>
      </div>
    </div>
  );
};
