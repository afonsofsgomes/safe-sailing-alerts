
import { useState, useEffect } from 'react';
import { AlertWidget } from '@/components/AlertWidget';
import { useAppStore } from '@/lib/store';

function EmbedWidget() {
  const fetchData = useAppStore((state) => state.fetchData);
  
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <div className="p-2 embed-container">
      <AlertWidget standalone={true} />
    </div>
  );
}

export default EmbedWidget;
