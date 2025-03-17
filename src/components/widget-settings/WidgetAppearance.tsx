
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { WidgetSettings } from '@/lib/types';

interface WidgetAppearanceProps {
  settings: WidgetSettings;
  onSettingChange: (key: keyof WidgetSettings, value: any) => void;
}

export const WidgetAppearance = ({ settings, onSettingChange }: WidgetAppearanceProps) => {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="primaryColor">Primary Color</Label>
        <div className="flex items-center gap-3">
          <Input 
            id="primaryColor" 
            type="color" 
            value={settings.primaryColor}
            onChange={(e) => onSettingChange('primaryColor', e.target.value)}
            className="w-12 h-10 p-1"
          />
          <Input 
            value={settings.primaryColor}
            onChange={(e) => onSettingChange('primaryColor', e.target.value)}
            className="flex-1"
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="accentColor">Accent Color</Label>
        <div className="flex items-center gap-3">
          <Input 
            id="accentColor" 
            type="color" 
            value={settings.accentColor}
            onChange={(e) => onSettingChange('accentColor', e.target.value)}
            className="w-12 h-10 p-1"
          />
          <Input 
            value={settings.accentColor}
            onChange={(e) => onSettingChange('accentColor', e.target.value)}
            className="flex-1"
          />
        </div>
      </div>

      <div className="space-y-3">
        <Label>Border Radius</Label>
        <Select 
          value={settings.borderRadius} 
          onValueChange={(value: any) => onSettingChange('borderRadius', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select border radius" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">None</SelectItem>
            <SelectItem value="small">Small</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="large">Large</SelectItem>
            <SelectItem value="pill">Pill</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-3">
        <Label>Shadow</Label>
        <Select 
          value={settings.shadow} 
          onValueChange={(value: any) => onSettingChange('shadow', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select shadow size" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">None</SelectItem>
            <SelectItem value="small">Small</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="large">Large</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-3">
        <Label>Border Width</Label>
        <Select 
          value={settings.borderWidth} 
          onValueChange={(value: any) => onSettingChange('borderWidth', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select border width" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">None</SelectItem>
            <SelectItem value="thin">Thin</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="thick">Thick</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
