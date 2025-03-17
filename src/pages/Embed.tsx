
import { useEffect } from 'react';
import { AlertWidget } from '@/components/AlertWidget';
import { useAppStore } from '@/lib/store';

function EmbedWidget() {
  const fetchData = useAppStore((state) => state.fetchData);
  
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <div className="embed-widget-container">
      <AlertWidget standalone={true} />
    </div>
  );
}

export default EmbedWidget;
