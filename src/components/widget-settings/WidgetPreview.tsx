
import { AlertWidget } from '@/components/AlertWidget';
import { useIsMobile } from '@/hooks/use-mobile';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Phone, Monitor } from 'lucide-react';

interface WidgetPreviewProps {
  className?: string;
}

export const WidgetPreview = ({ className }: WidgetPreviewProps) => {
  const isMobile = useIsMobile();
  const [previewMode, setPreviewMode] = useState<'desktop' | 'mobile'>(isMobile ? 'mobile' : 'desktop');
  
  return (
    <div className={`space-y-6 animate-fade-in ${className}`}>
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold">Widget Preview</h3>
        <div className="flex items-center space-x-2">
          <Button 
            variant={previewMode === 'desktop' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => setPreviewMode('desktop')}
            className="flex items-center gap-1.5"
          >
            <Monitor className="h-4 w-4" />
            <span className="hidden sm:inline">Desktop</span>
          </Button>
          <Button 
            variant={previewMode === 'mobile' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => setPreviewMode('mobile')}
            className="flex items-center gap-1.5"
          >
            <Phone className="h-4 w-4" />
            <span className="hidden sm:inline">Mobile</span>
          </Button>
        </div>
      </div>
      
      <div className={`overflow-hidden ${previewMode === 'mobile' ? 'max-w-[375px] mx-auto border border-border rounded-lg' : ''}`}>
        <div className={previewMode === 'mobile' ? 'w-full' : 'bg-white p-6 rounded-xl shadow-sm border overflow-hidden'}>
          <AlertWidget standalone={true} className={previewMode === 'mobile' ? 'mobile-alert-widget' : ''} />
        </div>
      </div>
      
      <p className="text-sm text-muted-foreground">
        This is a preview of how your alert widget will appear on your website.
        Changes will be reflected in real-time.
      </p>
    </div>
  );
};
