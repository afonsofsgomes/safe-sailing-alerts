
import { useEffect, useRef } from 'react';
import { AlertWidget } from '@/components/AlertWidget';
import { useAppStore } from '@/lib/store';
import { useIsMobile } from '@/hooks/use-mobile';

function EmbedWidget() {
  const fetchData = useAppStore((state) => state.fetchData);
  const containerRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  
  useEffect(() => {
    // Fetch data on mount
    fetchData();
    
    // Add a log to check if data is being fetched
    console.log('Embed widget mounted, fetching data');
  }, [fetchData]);

  useEffect(() => {
    // Send the height of the widget to the parent window if embedded in an iframe
    const sendHeightToParent = () => {
      if (window.parent !== window && containerRef.current) {
        const height = containerRef.current.offsetHeight;
        console.log('Sending height to parent:', height);
        window.parent.postMessage(
          { type: 'safesailing-widget-height', height }, 
          '*'
        );
      }
    };

    // Send initial height
    sendHeightToParent();

    // Setup observer to detect size changes
    const resizeObserver = new ResizeObserver(() => {
      sendHeightToParent();
    });

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    // Also listen for window resize events for better mobile support
    window.addEventListener('resize', sendHeightToParent);

    // Add console logs to debug embedding issues
    console.log('Widget container ref:', containerRef.current);
    console.log('Is mobile:', isMobile);
    console.log('Window parent is same as window:', window.parent === window);

    return () => {
      if (containerRef.current) {
        resizeObserver.disconnect();
      }
      window.removeEventListener('resize', sendHeightToParent);
    };
  }, [isMobile]);

  return (
    <div className="embed-widget-container pb-3" ref={containerRef} style={{ minHeight: '50px' }}>
      <AlertWidget 
        standalone={true} 
        className={isMobile ? "mobile-alert-widget" : ""}
        showFallback={true}
      />
    </div>
  );
}

export default EmbedWidget;
