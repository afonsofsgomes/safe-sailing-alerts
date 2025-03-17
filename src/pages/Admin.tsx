
import { useState } from 'react';
import { Header } from '@/components/Header';
import { AlertCalendar } from '@/components/AlertCalendar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAppStore } from '@/lib/store';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { AlertWidget } from '@/components/AlertWidget';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

const Admin = () => {
  const { toast } = useToast();
  const widgetSettings = useAppStore((state) => state.widgetSettings);
  const updateWidgetSettings = useAppStore((state) => state.updateWidgetSettings);
  
  const [localSettings, setLocalSettings] = useState(widgetSettings);

  const handleSettingChange = (key: keyof typeof widgetSettings, value: any) => {
    setLocalSettings(prev => ({ ...prev, [key]: value }));
  };

  const saveSettings = () => {
    updateWidgetSettings(localSettings);
    toast({
      title: "Settings saved",
      description: "Widget settings have been updated successfully",
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <main className="flex-1 pt-24 pb-12 px-6 max-w-7xl mx-auto w-full">
        <div className="mb-10 animate-fade-in">
          <h1 className="text-3xl font-bold text-gray-900">Alert Management</h1>
          <p className="mt-2 text-gray-600">
            Manage weather-related disruptions and customize your alert widget.
          </p>
        </div>
        
        <Tabs defaultValue="calendar" className="w-full animate-fade-in">
          <TabsList className="mb-8">
            <TabsTrigger value="calendar">Calendar</TabsTrigger>
            <TabsTrigger value="settings">Widget Settings</TabsTrigger>
          </TabsList>
          
          <TabsContent value="calendar" className="space-y-6">
            <AlertCalendar />
          </TabsContent>
          
          <TabsContent value="settings" className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-6 bg-white p-6 rounded-xl shadow-sm border animate-fade-in">
                <h3 className="text-xl font-semibold">Content Settings</h3>
                
                <div className="space-y-2">
                  <Label htmlFor="title">Alert Title</Label>
                  <Input 
                    id="title" 
                    value={localSettings.title} 
                    onChange={(e) => handleSettingChange('title', e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">Alert Description</Label>
                  <Textarea 
                    id="description" 
                    value={localSettings.description}
                    onChange={(e) => handleSettingChange('description', e.target.value)}
                    rows={3}
                  />
                </div>
                
                <h3 className="text-xl font-semibold pt-4">Display Settings</h3>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="showDates">Show Dates</Label>
                  <Switch 
                    id="showDates" 
                    checked={localSettings.showDates}
                    onCheckedChange={(checked) => handleSettingChange('showDates', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="showTimes">Show Times</Label>
                  <Switch 
                    id="showTimes" 
                    checked={localSettings.showTimes}
                    onCheckedChange={(checked) => handleSettingChange('showTimes', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="showIcon">Show Alert Icon</Label>
                  <Switch 
                    id="showIcon" 
                    checked={localSettings.showIcon}
                    onCheckedChange={(checked) => handleSettingChange('showIcon', checked)}
                  />
                </div>
                
                <h3 className="text-xl font-semibold pt-4">Appearance</h3>
                
                <div className="space-y-2">
                  <Label htmlFor="primaryColor">Primary Color</Label>
                  <div className="flex items-center gap-3">
                    <Input 
                      id="primaryColor" 
                      type="color" 
                      value={localSettings.primaryColor}
                      onChange={(e) => handleSettingChange('primaryColor', e.target.value)}
                      className="w-12 h-10 p-1"
                    />
                    <Input 
                      value={localSettings.primaryColor}
                      onChange={(e) => handleSettingChange('primaryColor', e.target.value)}
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
                      value={localSettings.accentColor}
                      onChange={(e) => handleSettingChange('accentColor', e.target.value)}
                      className="w-12 h-10 p-1"
                    />
                    <Input 
                      value={localSettings.accentColor}
                      onChange={(e) => handleSettingChange('accentColor', e.target.value)}
                      className="flex-1"
                    />
                  </div>
                </div>
                
                <div className="space-y-3">
                  <Label>Animation Style</Label>
                  <RadioGroup 
                    value={localSettings.animation} 
                    onValueChange={(value) => handleSettingChange('animation', value)}
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
                
                <Button 
                  onClick={saveSettings}
                  className="w-full mt-2 bg-sea-500 hover:bg-sea-600"
                >
                  Save Settings
                </Button>
              </div>
              
              <div className="space-y-6 animate-fade-in">
                <h3 className="text-xl font-semibold">Widget Preview</h3>
                <div className="bg-white p-6 rounded-xl shadow-sm border">
                  <AlertWidget standalone={true} className="" />
                </div>
                <p className="text-sm text-muted-foreground">
                  This is a preview of how your alert widget will appear on your website.
                  Changes will be reflected in real-time.
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Admin;
