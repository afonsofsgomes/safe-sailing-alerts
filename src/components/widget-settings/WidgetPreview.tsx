
import { AlertWidget } from '@/components/AlertWidget';

interface WidgetPreviewProps {
  className?: string;
}

export const WidgetPreview = ({ className }: WidgetPreviewProps) => {
  return (
    <div className={`space-y-6 animate-fade-in ${className}`}>
      <h3 className="text-xl font-semibold">Widget Preview</h3>
      <div className="bg-white p-6 rounded-xl shadow-sm border">
        <AlertWidget standalone={true} className="" />
      </div>
      <p className="text-sm text-muted-foreground">
        This is a preview of how your alert widget will appear on your website.
        Changes will be reflected in real-time.
      </p>
    </div>
  );
};
