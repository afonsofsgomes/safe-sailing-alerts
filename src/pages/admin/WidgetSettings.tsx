
import { useState, useEffect } from 'react';
import { useAppStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Palette, Settings, CheckSquare, Type, Layout, Box } from 'lucide-react';
import { useAuth } from '@/lib/auth';
import { AuthModal } from '@/components/auth/AuthModal';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { WidgetThemes } from '@/components/WidgetThemes';
import { Header } from '@/components/Header';
import {
  WidgetContent,
  WidgetAppearance,
  WidgetTypography,
  WidgetLayout,
  WidgetPreview
} from '@/components/widget-settings';

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
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <main className="flex-1 pt-24 pb-12 px-6 max-w-7xl mx-auto w-full">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Widget Settings</h1>
          <p className="mt-2 text-gray-600">
            Customize the appearance and behavior of your widget
          </p>
        </div>
        
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
                  <TabsContent value="content">
                    <WidgetContent 
                      settings={localSettings} 
                      onSettingChange={handleSettingChange} 
                    />
                  </TabsContent>

                  <TabsContent value="appearance">
                    <WidgetAppearance 
                      settings={localSettings} 
                      onSettingChange={handleSettingChange} 
                    />
                  </TabsContent>

                  <TabsContent value="typography">
                    <WidgetTypography 
                      settings={localSettings} 
                      onSettingChange={handleSettingChange} 
                    />
                  </TabsContent>

                  <TabsContent value="layout">
                    <WidgetLayout 
                      settings={localSettings} 
                      onSettingChange={handleSettingChange} 
                    />
                  </TabsContent>

                  <TabsContent value="themes">
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
          
          <WidgetPreview />

          <AuthModal 
            isOpen={authModalOpen} 
            onClose={() => setAuthModalOpen(false)} 
          />
        </div>
      </main>
    </div>
  );
};

export default WidgetSettings;
