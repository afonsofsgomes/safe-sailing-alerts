
import { useEffect, useRef } from 'react';
import { AlertWidget } from '@/components/AlertWidget';
import { useAppStore } from '@/lib/store';
import { useIsMobile } from '@/hooks/use-mobile';

function EmbedWidget() {
  const fetchData = useAppStore((state) => state.fetchData);
  const containerRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    // Send the height of the widget to the parent window if embedded in an iframe
    const sendHeightToParent = () => {
      if (window.parent !== window && containerRef.current) {
        const height = containerRef.current.offsetHeight;
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

    return () => {
      if (containerRef.current) {
        resizeObserver.disconnect();
      }
      window.removeEventListener('resize', sendHeightToParent);
    };
  }, []);

  return (
    <div className="embed-widget-container" ref={containerRef}>
      <AlertWidget standalone={true} className={isMobile ? "mobile-alert-widget" : ""} />
    </div>
  );
}

export default EmbedWidget;
