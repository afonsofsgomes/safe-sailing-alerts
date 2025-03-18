
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  WidgetContent,
  WidgetAppearance,
  WidgetTypography,
  WidgetLayout,
  WidgetPreview
} from '@/components/widget-settings';
import { SocialMediaSettings } from '@/components/social/SocialMediaSettings';

export const WidgetSettings = () => {
  const [activeTab, setActiveTab] = useState('content');

  return (
    <div className="grid gap-8 md:grid-cols-[1fr_350px]">
      <div>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="content">Content</TabsTrigger>
            <TabsTrigger value="appearance">Appearance</TabsTrigger>
            <TabsTrigger value="typography">Typography</TabsTrigger>
            <TabsTrigger value="layout">Layout</TabsTrigger>
            <TabsTrigger value="social">Social Media</TabsTrigger>
          </TabsList>
          
          <TabsContent value="content">
            <WidgetContent />
          </TabsContent>
          
          <TabsContent value="appearance">
            <WidgetAppearance />
          </TabsContent>
          
          <TabsContent value="typography">
            <WidgetTypography />
          </TabsContent>
          
          <TabsContent value="layout">
            <WidgetLayout />
          </TabsContent>
          
          <TabsContent value="social">
            <SocialMediaSettings />
          </TabsContent>
        </Tabs>
      </div>
      
      <div className="sticky top-24">
        <WidgetPreview className={activeTab !== 'social' ? '' : 'hidden md:block'} />
      </div>
    </div>
  );
};

export default WidgetSettings;
