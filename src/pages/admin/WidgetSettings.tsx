import { useState, useEffect } from 'react';
import { useAppStore } from '@/lib/store';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Palette, Settings, CheckSquare, Type, Layout, Box } from 'lucide-react';
import { useAuth } from '@/lib/auth';
import { AlertWidget } from '@/components/AlertWidget';
import { AuthModal } from '@/components/auth/AuthModal';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { WidgetThemes } from '@/components/WidgetThemes';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export const WidgetSettings = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [authModalOpen, setAuthModalOpen] = useState(false);
  
  const widgetSettings = useAppStore((state) => state.widgetSettings);
  const updateWidgetSettings = useAppStore((state) => state.updateWidgetSettings);
  const loading = useAppStore((state) => state.loading);
  
  const [localSettings, setLocalSettings] = useState(widgetSettings);
  const [activeTab, setActiveTab] = useState('content');

  useEffect(() => {
    setLocalSettings(widgetSettings);
  }, [widgetSettings]);

  const handleSettingChange = (key: keyof typeof widgetSettings, value: any) => {
    setLocalSettings(prev => ({ ...prev, [key]: value }));
  };

  const saveSettings = async () => {
    if (!user) {
      setAuthModalOpen(true);
      return;
    }
    
    try {
      await updateWidgetSettings(localSettings);
      toast({
        title: "Settings saved",
        description: "Widget settings have been updated successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to save settings",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="space-y-6 animate-fade-in">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4 w-full grid grid-cols-5">
            <TabsTrigger value="content" className="flex items-center gap-1.5">
              <CheckSquare className="h-4 w-4" />
              <span className="hidden sm:inline">Content</span>
            </TabsTrigger>
            <TabsTrigger value="appearance" className="flex items-center gap-1.5">
              <Palette className="h-4 w-4" />
              <span className="hidden sm:inline">Style</span>
            </TabsTrigger>
            <TabsTrigger value="typography" className="flex items-center gap-1.5">
              <Type className="h-4 w-4" />
              <span className="hidden sm:inline">Text</span>
            </TabsTrigger>
            <TabsTrigger value="layout" className="flex items-center gap-1.5">
              <Layout className="h-4 w-4" />
              <span className="hidden sm:inline">Layout</span>
            </TabsTrigger>
            <TabsTrigger value="themes" className="flex items-center gap-1.5">
              <Settings className="h-4 w-4" />
              <span className="hidden sm:inline">Themes</span>
            </TabsTrigger>
          </TabsList>

          <Card>
            <CardContent className="pt-6">
              <TabsContent value="content" className="space-y-6">
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
              </TabsContent>

              <TabsContent value="appearance" className="space-y-6">
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
                  <Label>Border Radius</Label>
                  <Select 
                    value={localSettings.borderRadius} 
                    onValueChange={(value: any) => handleSettingChange('borderRadius', value)}
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
                    value={localSettings.shadow} 
                    onValueChange={(value: any) => handleSettingChange('shadow', value)}
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
                    value={localSettings.borderWidth} 
                    onValueChange={(value: any) => handleSettingChange('borderWidth', value)}
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
              </TabsContent>

              <TabsContent value="typography" className="space-y-6">
                <div className="space-y-3">
                  <Label>Font Style</Label>
                  <Select 
                    value={localSettings.fontStyle} 
                    onValueChange={(value: any) => handleSettingChange('fontStyle', value)}
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
              </TabsContent>

              <TabsContent value="layout" className="space-y-6">
                <div className="space-y-3">
                  <Label>Layout Style</Label>
                  <Select 
                    value={localSettings.layout} 
                    onValueChange={(value: any) => handleSettingChange('layout', value)}
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
              </TabsContent>

              <TabsContent value="themes" className="space-y-6">
                <WidgetThemes />
              </TabsContent>
            </CardContent>
          </Card>
        </Tabs>
        
        <Button 
          onClick={saveSettings}
          className="w-full mt-2 bg-sea-500 hover:bg-sea-600"
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            'Save Settings'
          )}
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

      <AuthModal 
        isOpen={authModalOpen} 
        onClose={() => setAuthModalOpen(false)} 
      />
    </div>
  );
};

export default WidgetSettings;
