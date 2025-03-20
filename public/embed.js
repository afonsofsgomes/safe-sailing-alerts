
(function() {
  // SafeSailing Alert Widget Embed Script
  const createAlertWidget = () => {
    // Create container for the widget
    const container = document.createElement('div');
    container.className = 'safesailing-alert-container';
    container.style.width = '100%';
    container.style.margin = '0';
    container.style.padding = '0';
    container.style.overflow = 'hidden';
    container.style.boxSizing = 'border-box';
    
    // Create iframe for the widget
    const iframe = document.createElement('iframe');
    iframe.src = window.location.origin.includes('localhost') 
      ? 'http://localhost:5173/embed' 
      : window.location.origin + '/embed';
    iframe.style.width = '100%';
    iframe.style.border = 'none';
    iframe.style.overflow = 'hidden';
    iframe.style.display = 'block'; // Ensure the iframe is a block element
    iframe.style.height = '150px'; // Set an initial height
    iframe.scrolling = 'no';
    iframe.allowFullscreen = false;
    iframe.title = 'SafeSailing Alert Widget';
    
    // Add event listener to receive height from the iframe and handle resize
    window.addEventListener('message', (event) => {
      // Only accept messages from our own origin
      const iframeOrigin = iframe.src.split('/').slice(0, 3).join('/');
      console.log('Message received, origin:', event.origin, 'expected:', iframeOrigin);
      
      // Less strict origin check for development
      if (event.origin !== iframeOrigin && 
          !event.origin.includes('localhost') && 
          !iframeOrigin.includes('localhost')) {
        console.log('Origin mismatch, ignoring message');
        return;
      }
      
      if (event.data && event.data.type === 'safesailing-widget-height') {
        console.log('Received height update:', event.data.height);
        // Set minimum height to prevent collapse
        const newHeight = Math.max(event.data.height, 100);
        iframe.style.height = newHeight + 'px';
      }
    });
    
    // Handle window resize for responsive behavior
    window.addEventListener('resize', () => {
      // Force recalculation of iframe size after resize
      setTimeout(() => {
        const message = {
          type: 'safesailing-widget-resize',
          width: container.offsetWidth
        };
        iframe.contentWindow?.postMessage(message, '*');
      }, 100);
    });
    
    container.appendChild(iframe);
    
    // Find insertion point - prefer elements with id or class containing 'alert', 'notification', or 'header'
    const targetSelectors = [
      '#alert', '.alert', '[id*="alert"]', '[class*="alert"]',
      '#notification', '.notification', '[id*="notification"]', '[class*="notification"]',
      'header', '.header', '#header', 'body'
    ];
    
    let insertionPoint = null;
    for (const selector of targetSelectors) {
      const element = document.querySelector(selector);
      if (element) {
        insertionPoint = element;
        break;
      }
    }
    
    // Insert as first child of the insertion point or body if nothing else found
    if (insertionPoint) {
      if (insertionPoint.tagName.toLowerCase() === 'body') {
        // For body, insert as first element
        document.body.insertBefore(container, document.body.firstChild);
      } else {
        // For other elements, insert within
        insertionPoint.insertBefore(container, insertionPoint.firstChild);
      }
    } else {
      // Fallback to body
      document.body.insertBefore(container, document.body.firstChild);
    }
    
    console.log('Alert widget embedded successfully');
  };

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', createAlertWidget);
  } else {
    createAlertWidget();
  }
})();
