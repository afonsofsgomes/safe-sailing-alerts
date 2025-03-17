
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { WidgetSettings } from '@/lib/types';

interface WidgetTypographyProps {
  settings: WidgetSettings;
  onSettingChange: (key: keyof WidgetSettings, value: any) => void;
}

export const WidgetTypography = ({ settings, onSettingChange }: WidgetTypographyProps) => {
  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <Label>Font Style</Label>
        <Select 
          value={settings.fontStyle} 
          onValueChange={(value: any) => onSettingChange('fontStyle', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select font style" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="default">Default Sans</SelectItem>
            <SelectItem value="serif">Serif</SelectItem>
            <SelectItem value="mono">Monospace</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
